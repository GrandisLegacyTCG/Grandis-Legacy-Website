from pathlib import Path
import re,json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
css={'style1':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css'], 'style2':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css']}
js={'style1':['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/app-s0.js'], 'style2':['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','style-2/js/app-s0.js']}
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for style,rel,base in [('style1','index.html',''),('style1','style-1/index.html',''),('style2','style-2/index.html','../')]:
  page=browser.new_page(viewport={'width':1440,'height':860});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  html=(R/rel).read_text();html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I);html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I);html=html.replace('<base href="../">','')
  html=html.replace('</head>',''.join(f'<style>{(R/f).read_text()}</style>' for f in css[style])+'</head>')
  html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+repr(base)+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in js[style])+'</body>')
  page.set_content(html,wait_until='commit')
  initial=page.evaluate('''() => ({deck:Object.values(state.deck).reduce((a,b)=>a+b,0),slots:state.slots.map(x=>x.progressionId),dialog:document.querySelector('#newDeckDialog')?.open??false,keywords:[...document.querySelector('#keywordFilter').options].map(x=>x.value),count:state.cards.length})''')
  assert initial['count']==187 and initial['deck']==0 and not any(initial['slots']) and not initial['dialog'],initial
  assert 'ALL ALLIES' not in initial['keywords'] and 'Stun' not in initial['keywords'] and 'Sleep' not in initial['keywords']
  assert 'MANA COST +1' in initial['keywords'] and 'MANA COST +2' in initial['keywords'],initial['keywords']
  effects=page.evaluate("[...document.querySelector('#effectFilter').options].map(x=>x.value)");assert 'Sleep' in effects and 'Stun' in effects, effects
  page.evaluate("openCardReview('S0-THF-009')");txt=page.locator('#reviewRows').inner_text()
  assert 'Vertical Slash' in txt and 'Horizontal Slash' in txt and '90' in txt,txt
  assert {'CONDITION','SURE HIT'}.issubset(set(page.locator('#reviewRows .review-keyword-image').evaluate_all('(els)=>els.map(x=>x.alt)')))
  assert 'Deal 90 Physical damage.' in txt and 'This Attack cannot be Dodged.' in txt,txt
  page.locator('#reviewClose').click()
  page.evaluate("openCardReview('S0-MAG-018')");t2=page.locator('#reviewRows').inner_text()
  assert 'The required Mana is 2 higher than the printed Mana Cost.' in t2,t2
  assert 'MANA COST +2' in page.locator('#reviewRows .review-keyword-image').evaluate_all('(els)=>els.map(x=>x.alt)')
  page.locator('#reviewClose').click()
  page.evaluate("openCardReview('S0-MAG-021')");t3=page.locator('#reviewRows').inner_text()
  assert 'Mana Deck' in t3,t3
  assert 'MANA STEAL' in page.locator('#reviewRows .review-keyword-image').evaluate_all('(els)=>els.map(x=>x.alt)')
  page.locator('#reviewClose').click()
  if style=='style1':
   # Blank wizard must NOT automatically appear on fresh start, but New Deck remains user-initiated.
   assert not page.locator('#newDeckDialog').evaluate('(x)=>x.open')
  print('PASS',rel,'blank, keywords, X Cross CONDITION+90, Double Casting modifier, Mana Steal')
  assert not errors,(rel,errors)
  results.append(rel);page.close()
 browser.close()
print('OFFLINE BROWSER TEST PASS',len(results),'/',len(results),results)
