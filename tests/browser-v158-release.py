#!/usr/bin/env python3
"""Off-network Chromium review of both v1.58 styles from real source HTML/CSS/JS."""
from pathlib import Path
import re, posixpath, json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]

def mount(page, style, shared_storage=None):
    entry='index.html' if style==1 else 'style-2/index.html'
    html=(R/entry).read_text()
    d=Path(entry).parent
    scripts=[]
    pat=re.compile(r'<script\b([^>]*)>(.*?)</script>', re.I|re.S)
    def scrape(m):
        match=re.search(r'\bsrc="([^"]+)"',m.group(1))
        if match and match.group(1).startswith('https://'): return ''
        if match:
            f=R/d/str(match.group(1).split('?')[0]);scripts.append((f, None))
        else:scripts.append((None,m.group(2)))
        return ''
    html=pat.sub(scrape,html)
    css=[]
    patcss=re.compile(r'<link\b[^>]*?rel="stylesheet"[^>]*>',re.I|re.S)
    def css_load(m):
        match=re.search(r'\bhref="([^"]+)"',m.group(0));
        if not match or match.group(1).startswith('https://'):return ''
        file=R/d/str(match.group(1).split('?')[0])
        assert file.exists(), file
        css.append(file)
        return ''
    html=patcss.sub(css_load,html)
    html=re.sub(r'<link\b[^>]*(?:fonts\.googleapis|fonts\.gstatic)[^>]*>', '', html,flags=re.I)
    html=html.replace('</head>',''.join(f'<style>{c.read_text()}</style>' for c in css)+'</head>')
    # Provide localStorage in about:blank browser sandbox for initialization, preserving state per context.
    html=html.replace('</head>', '''<script>
    window.__TEST_STORAGE = STORAGE_PLACEHOLDER;
    Object.defineProperty(window,'localStorage',{configurable:true,value:{
      getItem(k){return window.__TEST_STORAGE[k]??null},
      setItem(k,v){window.__TEST_STORAGE[k]=String(v)},removeItem(k){delete window.__TEST_STORAGE[k]}
    }});
    </script></head>''')
    html=html.replace('STORAGE_PLACEHOLDER',json.dumps(shared_storage or {}))
    page.set_content(html, wait_until='commit')
    for file,content in scripts:
        if file:
            assert file.exists(),file
            page.add_script_tag(content=file.read_text())
        elif content.strip():page.add_script_tag(content=content)
    return entry

with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for style in [1,2]:
  page=b.new_page(viewport={'width':1600,'height':1000})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  entry=mount(page,style)
  all_cards=page.locator('#libraryResultCount').inner_text() if style==1 else str(page.evaluate('window.GL_DECK_BUILDER_DATA.legacyCards.length'))+' legacy cards loaded'
  assert ('15' in all_cards or 'Hero' in all_cards) if style==1 else (page.evaluate('window.GL_DECK_BUILDER_DATA.legacyCards.length')>=45),(style,all_cards)
  assert page.locator('.style-switch-link').get_attribute('href')==('style-2/' if style==1 else '../')
  assert page.locator('.global-nav').evaluate('(el)=>getComputedStyle(el).display')=='none'
  assert page.locator('.mobile-app-menu-button').evaluate('(el)=>getComputedStyle(el).display')=='none'
  # Check the four actual artwork-printed RANGE abilities, and explanation.
  for id in ['S0-ARC-H002','S0-ARC-H003','S0-ARC-H005','S0-ARC-H006']:
   page.evaluate('(id)=>openCardReview(id)',id)
   images=page.locator('#reviewRows .review-hero-block p img.review-keyword-image[alt="RANGE"]')
   assert images.count()==1,(style,id,page.locator('#reviewRows').inner_text())
   text=page.locator('#reviewRows .hero-class-section p').inner_text() if style==1 else page.locator('#reviewRows .review-hero-block').last.inner_text()
   assert 'Range Attack' not in text,(style,id,text)
   assert page.locator('#reviewRows .review-keyword-explanation img[alt="RANGE"]').count()==1,(style,id)
  page.evaluate("openCardReview('S0-ARC-H001')")
  assert page.locator('#reviewRows .review-keyword-image[alt="RANGE"]').count()==0
  page.evaluate("openCardReview('S0-ARC-020')")
  assert page.locator('#reviewRows .review-keyword-image[alt="RANGE"]').count()>=1
  assert not errors,(style,errors)
  print(f'Style {style} PASS: {all_cards}; canonical link, hidden future app controls, 4 Hero RANGE badges + explanation, existing Skill RANGE, no JS errors')
  page.close()
 # Cross-style localStorage sync without a long fragment (hosted same-origin scenario).
 one=b.new_page();mount(one,1)
 one.evaluate("() => {state.deck={'S0-ARC-001':2};document.getElementById('deckName').value='QA Preserve Deck';s0Persist()}")
 saved=one.evaluate('window.__TEST_STORAGE')
 assert 'grandis-season0-deck-draft-v2' in saved
 two=b.new_page();mount(two,2,saved)
 restored=two.evaluate("() => [document.getElementById('deckName').value,state.deck['S0-ARC-001']]")
 assert restored==['QA Preserve Deck',2],restored
 two.evaluate("() => {state.deck={'S0-ARC-001':1};document.getElementById('deckName').value='QA Reverse';s0Persist()}")
 saved=two.evaluate('window.__TEST_STORAGE')
 three=b.new_page();mount(three,1,saved)
 restored=three.evaluate("() => [document.getElementById('deckName').value,state.deck['S0-ARC-001']]")
 assert restored==['QA Reverse',1],restored
 print('PASS Deck state round-trip Style 1 -> Style 2 -> Style 1 using only same-origin shared storage.')
 one.close();two.close();three.close()
 b.close()
