"""Grandis Legacy Deck Builder v1.45.0: all Area Attack previews + zero unrelated diffs.
Uses Chromium inlined-document harness because local file:// navigation is sandbox-blocked.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, re

ROOT = Path(__file__).resolve().parents[1]
STYLES = {
    'Style1': {'html': 'index.html', 'app': 'js/app-s0.js', 'base': '', 'css': ['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css']},
    'Style2': {'html': 'style-2/index.html', 'app': 'style-2/js/app-s0.js', 'base': '../', 'css': ['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css']},
}
COMMON = ['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js',
          'js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
CSS_COMMON = ['css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css',
              'css/s0-review-v1.41.css','css/s0-review-v1.42.css','css/s0-review-v1.43.css','css/s0-review-v1.44.css']
baseline_clarity = (ROOT / 'tests/fixtures/s0-review-clarity-v1.44.js').read_text()


def mount(page, style, baseline):
    cfg = STYLES[style]
    html = (ROOT / cfg['html']).read_text()
    html = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', html, flags=re.I)
    html = re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>', '', html, flags=re.I)
    css = cfg['css'] + (['style-2/css/s0-style2-quantities-v1.36.css'] if style == 'Style2' else []) + CSS_COMMON
    html = html.replace('</head>', ''.join('<style>' + (ROOT / file).read_text() + '</style>' for file in css) + '</head>')
    html = html.replace('</head>', "<script>window.__TEST_STORAGE={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
    scripts = '<script>window.GL_DECK_BUILDER_BASE=' + json.dumps(cfg['base']) + ';</script>'
    for f in COMMON + [cfg['app']]:
        content = baseline_clarity if baseline and f == 'js/s0-review-clarity.js' else (ROOT / f).read_text()
        scripts += '<script>' + content + '</script>'
    html = html.replace('</body>', scripts + '</body>')
    page.set_content(html, wait_until='commit')


def capture(page):
    return page.evaluate('''() => {
      let all={},areaIds=[],areas=0,allCards=0;
      for(const card of state.cards) {
        if(card.family!=='Skill')continue;
        openCardReview(card.id);
        let effects=[...document.querySelectorAll('.review-effect-info p')].map(n=>n.textContent.trim());
        all[card.id]={name:card.name,effects:effects,type:card.classification};
        allCards++;
        if(card.classification==='Area Attack'){areas+=effects.length;areaIds.push(card.id)}
      }
      return {all,areas,areaIds,allCards};
    }''')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for style in STYLES:
        for viewport in [(1366,768),(1920,1080),(3840,2160)]:
            outputs={}
            for mode in ('baseline','updated'):
                page=browser.new_page(viewport={'width':viewport[0],'height':viewport[1]})
                errors=[]
                page.on('pageerror', lambda ex: errors.append(str(ex)))
                mount(page,style,mode=='baseline')
                outputs[mode]=capture(page)
                assert not errors,(style,viewport,mode,errors[:6])
                page.close()
            old,now=outputs['baseline'],outputs['updated']
            assert old['allCards']==now['allCards'],(style,viewport,'card count')
            assert len(now['areaIds'])==14 and now['areas']==24,(style,viewport,len(now['areaIds']),now['areas'])
            changed=0
            for card_id, before in old['all'].items():
                after=now['all'][card_id]
                assert before['type']==after['type']
                assert len(before['effects'])==len(after['effects'])
                for a,b in zip(before['effects'],after['effects']):
                    expected=re.sub(r'\bDeal Area (\d+) (Physical|Magical) damage\b',r'Deal \1 Area \2 damage',a)
                    if a!=expected:
                        assert before['type']=='Area Attack',(style,card_id,'non-Area changed',a,b)
                        changed+=1
                    assert b==expected,(style,viewport,card_id,b,'expected',expected)
                    assert not re.search(r'\bDeal Area\s+\d+\s+(Physical|Magical)\s+damage',b), (style,card_id,b)
            assert changed==24,(style,viewport,changed)
            assert now['all']['S0-MAG-029']['effects']==['Deal 30 Area Magical damage.','Deal 50 Area Magical damage.']
            assert now['all']['S0-ARC-009']['effects']==['Deal 20 Area Physical damage.','Deal 30 Area Physical damage.']
            assert 'Inflict Stun' in now['all']['S0-CLE-019']['effects'][0]
            assert 'all your Heroes by +20 HP' in now['all']['S0-CLE-009']['effects'][0]
            assert 'Each time this Attack hits' in now['all']['S0-MAG-024']['effects'][-1]
            print(f'PASS {style} {viewport[0]}x{viewport[1]}: {len(now["areaIds"])} Area cards / {changed} rows rewritten; unrelated effects identical; no browser errors',flush=True)
    browser.close()
