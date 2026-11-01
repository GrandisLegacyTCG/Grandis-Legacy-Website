"""Deck Builder v1.36.1: single distinct keyword panel, source-order and scoped hover."""
from pathlib import Path
import re
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
styles={
 'style1':{'html':'index.html','base':'','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css'],'js':'js/app-s0.js'},
 'style2':{'html':'style-2/index.html','base':'../','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','style-2/css/s0-style2-quantities-v1.36.css'],'js':'style-2/js/app-s0.js'},
}
common=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js']
def mount(page,style):
 d=styles[style]
 html=(R/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I).replace('<base href="../">','')
 html=html.replace('</head>',''.join(f'<style>{(R/f).read_text()}</style>' for f in d['css'])+'</head>')
 html=html.replace('</head>','<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>')
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in common+[d['js']])+'</body>')
 page.set_content(html,wait_until='commit')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for style in ('style1','style2'):
   page=browser.new_page(viewport={'width':1440,'height':820})
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   mount(page,style)
   page.evaluate("openCardReview('S0-MAG-031')")
   children=page.locator('#reviewRows').evaluate('(n)=>[...n.children].map(x=>x.className)')
   assert children==['review-effect-row no-metric','review-effect-row no-metric','review-keyword-explanation','review-ultimate-rules'],(style,children)
   explanation=page.locator('#reviewRows > .review-keyword-explanation')
   assert explanation.count()==1
   assert explanation.locator('.review-keyword-line').count()==2
   keys=explanation.locator('img.review-keyword-image').evaluate_all('(xs)=>xs.map(x=>x.alt)')
   assert keys==['REFLECT','INVINCIBLE'],(style,keys)
   # Both the original Rank effects retain their keyword badges.
   assert page.locator('.review-effect-row .review-keyword-image').count()==3
   assert 'Only Only' not in page.locator('.review-ultimate-rules').inner_text()
   assert page.locator('.review-ultimate-rules').inner_text().count('Only Bromir')==1
   assert 'Mage Shard for EXP' in page.locator('.review-ultimate-rules').inner_text()
   page.locator('#reviewClose').click()
   page.evaluate("openCardReview('S0-THF-009')")
   assert page.locator('#reviewRows > .review-keyword-explanation').count()==1
   assert 'Deal 90 Physical damage' in page.locator('#reviewRows').inner_text()
   page.locator('#reviewClose').click()
   page.evaluate("openCardReview('S0-MAG-018')")
   assert page.locator('#reviewRows > .review-keyword-explanation').count()==1
   assert page.locator('#reviewRows > .review-keyword-explanation img[alt="MANA COST +2"]').count()==1
   page.locator('#reviewClose').click()
   assert not errors,(style,errors)
   print('PASS',style,'one independent Keyword Explanation panel, rank-order, keyword-image union, accurate Ultimate Rules')
   page.close()

  page=browser.new_page(viewport={'width':1440,'height':820})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  mount(page,'style2')
  page.evaluate("()=>{const p=state.progressions.find(p=>p.baseClass==='Mage');state.slots[0]={progressionId:p.id,legacyId:''};renderLegacy();setTab('main');}")
  library_tile=page.locator('#cardLibrary [data-hover-card-id]').first
  hover_id=library_tile.get_attribute('data-hover-card-id')
  assert hover_id
  library_tile.hover()
  hover=page.locator('#hoverCardZoom')
  assert hover.is_visible() and 'is-visible' in (hover.get_attribute('class') or '')
  assert hover.locator('img').get_attribute('src').endswith(hover_id+'.webp')
  # Do not remove the original library expand/review button.
  assert library_tile.locator('.review-button').count()==1
  page.mouse.move(1440,40);assert not hover.is_visible()
  page.evaluate("addMainCard('S0-MAG-002')")
  deck_tile=page.locator('#deckGrid .deck-card').first
  assert deck_tile.locator('.deck-qty-step').count()==2
  assert deck_tile.locator('.review-button').count()==0
  assert deck_tile.get_attribute('data-hover-card-id')
  deck_tile.hover();assert hover.is_visible(), 'Main Deck must have left-side hover preview'
  assert hover.get_attribute('data-side')=='left'
  deck_tile.locator('[data-deck-add]').click();assert page.evaluate("state.deck['S0-MAG-002']")==2
  deck_tile=page.locator('#deckGrid .deck-card').first
  deck_tile.click(position={'x':20,'y':20});assert page.locator('#cardReviewDialog').evaluate('(x)=>x.open')
  page.locator('#reviewClose').click()
  assert not errors,errors
  print('PASS style2 Card Library enlargement on hover retained, library Review button retained, Main Deck hover shown on left, quantity and Review click preserved')
  page.close()
 finally:
  browser.close()
print('v1.36.1 scoped UX regressions PASS')
