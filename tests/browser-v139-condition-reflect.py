from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
import json,re
STYLES={
 'Style1':{'html':'index.html','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css'],'app':'js/app-s0.js','base':''},
 'Style2':{'html':'style-2/index.html','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css','style-2/css/s0-style2-quantities-v1.36.css'],'app':'style-2/js/app-s0.js','base':'../'}
}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
def mount(page,style):
 d=STYLES[style];html=(R/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
 html=html.replace('<base href="../">','')
 html=html.replace('</head>',''.join(f'<style>{(R/c).read_text()}</style>' for c in d['css'])+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')

with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
 for st in ('Style1','Style2'):
  page=b.new_page(viewport={'width':1440,'height':830})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  mount(page,st)
  try:
   page.evaluate("openCardReview('S0-ARC-031')")
   assert page.locator('.review-condition-panel').count()==1,(st,'no panel')
   assert page.locator('.review-condition-line').count()==1,(st,'resonance expected 1 condition')
   assert page.locator('.review-effect-row').count()==2,(st,'need two ranks')
   assert page.locator('.review-effect-row .review-condition-section').count()==0
   assert page.locator('.review-rows').evaluate('(x)=>x.firstElementChild.classList.contains("review-condition-panel")')
   assert page.locator('.review-rows > .review-keyword-explanation').count()==1
   assert page.locator('.review-condition-text').first.inner_text().startswith('Return 1')
   assert 'CONDITION' not in ' '.join(page.locator('.review-effect-info p').all_inner_texts())
   art=page.locator('.review-art-column').evaluate('(x)=>getComputedStyle(x).backgroundColor')
   shell=page.locator('.review-card').evaluate('(x)=>getComputedStyle(x).backgroundColor')
   assert art=='rgba(0, 0, 0, 0)' or art=='transparent',(st,art)
   # screenshot actual rendering
   
   page.evaluate("openCardReview('S0-MAG-015')")
   assert page.locator('.review-condition-line').count()==1,(st,'Permafrost metadata repeated but artwork prints 1')
   assert page.locator('.review-effect-row').count()==2
   permafrost_effects=page.locator('.review-effect-info p').all_inner_texts()
   assert permafrost_effects==['Deal 80 Magical damage.','Deal 100 Magical damage.'],(st,permafrost_effects)
   page.evaluate("openCardReview('S0-MAG-031')")
   assert page.locator('.review-condition-panel').count()==0
   reflect=page.locator('.review-keyword-explanation').inner_text()
   assert 'When this Hero is attacked, deal damage to the attacker as stated on the card.' in reflect,(st,reflect)
   assert 'when REFLECT resolves' not in reflect
   assert not errors,errors
   # All known cards with a printed CONDITION have exactly one on their R3.4 artwork.
   ids=['S0-ARC-003','S0-CLE-013','S0-EVT-005','S0-ITM-012','S0-MAG-015','S0-THF-009','S0-ARC-028','S0-ARC-029','S0-ARC-030','S0-ARC-031','S0-CLE-028','S0-CLE-030','S0-CLE-031']
   for cid in ids:
    page.evaluate('(cid)=>openCardReview(cid)',cid)
    assert page.locator('.review-condition-panel').count()==1,(st,cid,'panel')
    assert page.locator('.review-condition-line').count()==1,(st,cid,'condition duplicate')
    assert page.locator('.review-rows').evaluate('(x)=>x.firstElementChild.classList.contains("review-condition-panel")'),(st,cid,'ordering')
   assert not errors,(st,errors)
   print('PASS',st,'13/13 printed CONDITION cards (one each), R3.4 rank behavior, REFLECT, artwork background')
  finally:
   page.close()
 b.close()
