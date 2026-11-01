"""Offline browser integration for DB-08..DB-13 (HTTP/file navigation blocked by runtime)."""
from pathlib import Path
import re, json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
styles={
 'style1':{'html':'index.html','base':'','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css'],'js':['js/app-s0.js']},
 'style2':{'html':'style-2/index.html','base':'../','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','style-2/css/s0-style2-quantities-v1.36.css'],'js':['style-2/js/app-s0.js']},
}
common=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js']
def mount(page,style,saved=None,viewport=None):
 d=styles[style];page.set_viewport_size(viewport or {'width':1440,'height':820})
 html=(R/d['html']).read_text();html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I);html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I);html=html.replace('<base href="../">','')
 html=html.replace('</head>',''.join(f'<style>{(R/f).read_text()}</style>' for f in d['css'])+'</head>')
 mock="""<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script>"""
 html=html.replace('</head>',mock+'</head>')
 if saved is not None:
  html=html.replace('</head>','<script>window.__TEST_STORAGE["grandis-season0-deck-draft-v2"]='+json.dumps(saved)+';</script></head>')
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+repr(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in common+d['js'])+'</body>')
 page.set_content(html,wait_until='commit')
 return page

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for style in ('style1','style2'):
   page=browser.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   mount(page,style,viewport={'width':1280,'height':620})
   assert page.evaluate('countDeck()')==0
   page.evaluate("openCardReview('S0-MAG-031')") # Absolute Defense
   row=page.locator('#reviewRows');imgs=row.locator('img.review-keyword-image')
   alt=imgs.evaluate_all('(els)=>els.map(x=>x.alt)')
   assert 'REFLECT' in alt and 'INVINCIBLE' in alt,(style,alt)
   assert page.locator('.review-detail-column').evaluate('(e)=>getComputedStyle(e).overflowY')=='auto'
   metrics=page.locator('.review-detail-column').evaluate('(e)=>({scroll:e.scrollHeight,visible:e.clientHeight})')
   assert metrics['scroll']>=metrics['visible'],(style,metrics)
   # The new single Keyword Explanation makes Absolute Defense shorter.
   # Test an actually overflowing card rather than requiring unnecessary scroll.
   page.locator('#reviewClose').click()
   page.evaluate("openCardReview('S0-CLE-031')")
   scrolling=page.locator('.review-detail-column').evaluate('(e)=>({scroll:e.scrollHeight,visible:e.clientHeight})')
   assert scrolling['scroll']>scrolling['visible'],(style,scrolling)
   before=page.locator('.review-art-column').bounding_box();page.locator('.review-detail-column').evaluate('(e)=>e.scrollTop=e.scrollHeight')
   after=page.locator('.review-art-column').bounding_box()
   assert before==after,(style,before,after)
   page.locator('#reviewClose').click()
   page.evaluate("openCardReview('S0-THF-009')")
   alt=page.locator('#reviewRows img.review-keyword-image').evaluate_all('(els)=>els.map(x=>x.alt)')
   assert 'CONDITION' in alt and 'SURE HIT' in alt,(style,alt)
   assert '90 Physical damage' in page.locator('#reviewRows').inner_text()
   page.locator('#reviewClose').click()
   labels=page.evaluate("[...document.querySelector('#keywordFilter').options].map(x=>x.textContent)")
   assert 'ALL ALLIES' not in labels and 'MANA COST +1' in labels and 'MANA COST +2' in labels
   hdr=page.locator('.topbar .brand-copy h1').evaluate('(e)=>{let s=getComputedStyle(e);return [s.fontFamily,s.fontSize,s.fontWeight,s.letterSpacing,s.lineHeight]}')
   print('PASS',style,'Review scroll on long card:',scrolling,'art fixed, image keyword, typography:',hdr)
   assert not errs,errs
   if style=='style1':head_ref=hdr
   else:assert hdr==head_ref,('font mismatch',head_ref,hdr)
   page.close()
  page=browser.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  mount(page,'style2')
  # Import-eligible demo state: one selected Mage progression, two Mirror Image cards.
  page.evaluate("""()=>{const pr=state.progressions.find(p=>p.baseClass==='Mage');state.slots[2]={progressionId:pr.id,legacyId:''};renderLegacy();setTab('main');addMainCard('S0-MAG-002');addMainCard('S0-MAG-002');}""")
  m=page.evaluate("({d:state.deck,keys:state.slots.map(x=>x.progressionId),name:document.querySelector('#deckName').value})")
  assert m['d'].get('S0-MAG-002')==2,m
  tile=page.locator('#deckGrid .deck-card').first
  assert tile.locator('.deck-qty-bar').count()==1
  assert tile.get_attribute('data-hover-card-id'),'missing new requested hover preview'
  tile.hover();assert page.locator('#hoverCardZoom').is_visible()
  assert page.locator('#hoverCardZoom').get_attribute('data-side')=='left'
  tile.locator('[data-deck-add]').click();assert page.evaluate("state.deck['S0-MAG-002']")==3
  assert page.locator('#deckGrid [data-deck-add]').is_disabled()
  tile=page.locator('#deckGrid .deck-card').first
  tile.locator('[data-deck-remove]').click();assert page.evaluate("state.deck['S0-MAG-002']")==2
  tile=page.locator('#deckGrid .deck-card').first
  tile.click(position={'x':40,'y':40})
  assert page.locator('#cardReviewDialog').evaluate('(x)=>x.open')
  page.locator('#reviewClose').click()
  saved=page.evaluate("localStorage.getItem('grandis-season0-deck-draft-v2')")
  assert saved, 'style2 did not persist its draft'
  print('PASS Style 2: hover preview on left, direct click to Review, −/+ quantity, copy limit, shared persistence')
  assert not errs,errs
  page.close()
  for target in ('style1','style2'):
   pg=browser.new_page();mount(pg,target,saved)
   count=pg.evaluate('countDeck()')
   slots=pg.evaluate('state.slots.map(s=>s.progressionId)')
   assert count==2 and slots==['','','S0-MAG-H001'],(target,count,slots)
   saved=pg.evaluate("localStorage.getItem('grandis-season0-deck-draft-v2')")
   print('PASS shared draft rehydration →',target,count,'Mage progression',slots[2])
   pg.close()
  # Mobile review remains accessible with dynamic scroll.
  pg=browser.new_page();mount(pg,'style2',viewport={'width':390,'height':780})
  pg.evaluate("openCardReview('S0-MAG-031')")
  assert pg.locator('.review-detail-column').evaluate('(e)=>getComputedStyle(e).overflowY')=='auto'
  assert pg.locator('.review-detail-column').evaluate('(e)=>e.clientHeight')>50
  pg.close()
  print('PASS mobile Review scrolling')
 finally:browser.close()
print('v1.36.0 DB-08..DB-13 offline browser integration PASS')
