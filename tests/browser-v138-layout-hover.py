"""Deck Builder v1.38 UX: unified keyword badge height, gold/white font scale, Main Deck left hover, root cleanup."""
import json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
STYLES={
 'style1':{'html':'index.html','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css'],'app':'js/app-s0.js','base':''},
 'style2':{'html':'style-2/index.html','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','style-2/css/s0-style2-quantities-v1.36.css'],'app':'style-2/js/app-s0.js','base':'../'}
}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
def mount(page,style):
 d=STYLES[style]
 html=(R/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
 html=html.replace('<base href="../">','')
 html=html.replace('</head>',''.join(f'<style>{(R/c).read_text()}</style>' for c in d['css'])+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for style in ('style1','style2'):
   page=browser.new_page(viewport={'width':1440,'height':850})
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   mount(page,style)
   page.evaluate("openCardReview('S0-MAG-031')")
   keys=page.locator('#reviewRows img.review-keyword-image')
   assert keys.count()==5,(style,keys.count())
   heights=keys.evaluate_all("xs=>xs.map(x=>Math.round(x.getBoundingClientRect().height))")
   assert set(heights)=={20},(style,heights)
   for gold,white in [('.review-effect-row .review-effect-info > span','.review-effect-row .review-effect-info > p'),
                       ('.review-keyword-heading','.review-keyword-description'),
                       ('.review-ultimate-rules > span','.review-ultimate-rules > p'),
                       ('.review-summary-item > span','.review-summary-item > strong')]:
    g=page.locator('#cardReviewDialog '+gold).first
    w=page.locator('#cardReviewDialog '+white).first
    assert g.count() and w.count(),(style,gold,white)
    gs=float(g.evaluate('(x)=>getComputedStyle(x).fontSize.replace("px","")'))
    ws=float(w.evaluate('(x)=>getComputedStyle(x).fontSize.replace("px","")'))
    assert gs==14 and ws==12,(style,gold,gs,white,ws)
   assert page.locator('#reviewRows > .review-keyword-explanation').count()==1
   assert page.locator('#reviewRows > .review-ultimate-rules').count()==1
   assert page.locator('.review-detail-column').evaluate('(x)=>getComputedStyle(x).overflowY')=='auto'
   page.locator('#reviewClose').click()
   assert not errors,(style,errors)
   print('PASS',style,'keyword images all 20px; gold 14px white 12px; one explanation; independently scrolling right pane')
   page.close()
  page=browser.new_page(viewport={'width':1440,'height':850})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  mount(page,'style2')
  page.evaluate("()=>{const pr=state.progressions.find(p=>p.baseClass==='Mage');state.slots[2]={progressionId:pr.id,legacyId:''};renderLegacy();setTab('main');addMainCard('S0-MAG-002');}")
  hover=page.locator('#hoverCardZoom')
  library=page.locator('#cardLibrary [data-hover-card-id]').first
  library.hover()
  assert hover.is_visible()
  assert hover.get_attribute('data-side')=='right'
  page.mouse.move(1435,40)
  deck=page.locator('#deckGrid .deck-card').first
  assert deck.get_attribute('data-hover-card-id')==deck.get_attribute('data-deck-card')
  assert deck.get_attribute('data-hover-side')=='left'
  assert deck.locator('.deck-qty-step').count()==2
  assert deck.locator('.review-button').count()==0
  deck.hover()
  assert hover.is_visible()
  assert hover.get_attribute('data-side')=='left'
  x=hover.bounding_box()['x']; deckx=page.locator('.main-deck-panel').bounding_box()['x']
  assert x<deckx,(x,deckx)
  deck.locator('[data-deck-add]').click()
  assert page.evaluate("state.deck['S0-MAG-002']")==2
  page.locator('#deckGrid .deck-card').first.click(position={'x':15,'y':18})
  assert page.locator('#cardReviewDialog').evaluate('(e)=>e.open')
  assert not errors,errors
  print('PASS Style 2 Library hover on right, Main Deck hover on left, card click Review, quantity control isolated')
  page.close()
  root_files={p.name for p in R.iterdir() if p.is_file()}
  assert root_files=={'.nojekyll','index.html','README.md','package.json','FILE_MANIFEST_SHA256.csv','SOURCE_LOCK_v3.20.json'},root_files
  archived=list((R/'archive/historical-root-docs').glob('*'))
  assert len(archived)>=12,len(archived)
  print('PASS root cleanup:',len(root_files),'active root files,',len(archived),'historical files grouped separately')
 finally:
  browser.close()
print('v1.38.0 UI + cleanup acceptance PASS')
