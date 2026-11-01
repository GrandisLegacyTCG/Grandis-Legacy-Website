"""Focused Chromium acceptance checks for v1.32.4, both original visual styles."""
import pathlib, json, re
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
def inline_page(style):
 file=ROOT/('index.html' if style=='style1' else 'style-2/index.html')
 html=file.read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', html, flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>', '', html, flags=re.I)
 css=['css/app.css','css/s0-enhancements-v1.32.2.css'] if style=='style1' else ['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css']
 js=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/app-s0.js' if style=='style1' else 'style-2/js/app-s0.js']
 html=html.replace('</head>', ''.join('<style>'+(ROOT/x).read_text()+'</style>' for x in css)+'</head>')
 scripts='<script>window.GL_DECK_BUILDER_BASE="'+('' if style=='style1' else '../')+'";</script>'
 scripts+=''.join('<script>'+(ROOT/f).read_text()+'</script>' for f in js)
 return html.replace('</body>',scripts+'</body>')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for style in ['style1','style2']:
  page=browser.new_page(viewport={'width':1423,'height':860})
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_content(inline_page(style),wait_until='commit',timeout=15000)
  if style=='style1':
   page.locator('#createBlankDeck').click()
   page.locator('[data-hero-action="S0-ARC-H001"]').click()
   page.locator('[data-library-tab="skills"]').click()
   assert page.locator('#cardPoolSelect').input_value()=='available'
   page.locator('#filterToggle').click()
   page.locator('#effectFilter').select_option('Poison')
   skill_ids=page.locator('[data-main-library-id]').evaluate_all('(x)=>x.map(c=>c.dataset.mainLibraryId)')
   assert 'S0-ARC-002' in skill_ids
   page.locator('[data-library-tab="items"]').click()
   item_ids=page.locator('[data-main-library-id]').evaluate_all('(x)=>x.map(c=>c.dataset.mainLibraryId)')
   assert 'S0-ITM-011' in item_ids
  else:
   page.locator('[data-choose-hero="0"]').click()
   page.locator('[data-progression-choice="S0-ARC-H001"]').click()
   page.locator('[data-tab="main"]').click()
   assert page.locator('#availableCardsToggle').get_attribute('aria-checked')=='true'
   page.locator('#filterToggle').click()
   page.locator('#effectFilter').select_option('Poison')
   ids=page.locator('[data-library-card]').evaluate_all('(x)=>x.map(c=>c.dataset.libraryCard)')
   assert 'S0-ITM-011' in ids
   page.locator('#effectFilter').select_option('Swap')
   ids=page.locator('[data-library-card]').evaluate_all('(x)=>x.map(c=>c.dataset.libraryCard)')
   assert 'S0-ITM-019' in ids
  # All Cards displays off-class entries without allowing their addition.
  before=page.evaluate('countDeck()')
  page.evaluate('addMainCard("S0-MAG-001")')
  assert page.evaluate('countDeck()')==before,(style,'off-class Skill was added')
  page.evaluate('addMainCard("S0-ARC-001")')
  assert page.evaluate('state.deck["S0-ARC-001"]')==1,(style,'legal Archer Skill not added')
  # Formation change restores v1.31 confirm -> remove only incompatible copies.
  if style=='style1':
   page.evaluate('() => {placeHeroAtSlot("S0-MAG-H001",0);return null}')
  else:
   page.locator('[data-tab="legacy"]').click()
   page.locator('[data-choose-hero="0"]').click()
   page.locator('[data-progression-choice="S0-MAG-H001"]').click()
  assert page.locator('#confirmDialog').evaluate('(el)=>el.open'),(style,'missing v1.31 removal prompt')
  assert page.evaluate('state.deck["S0-ARC-001"]')==1,(style,'premature deletion before confirmation')
  page.locator('#confirmOk').click()
  assert not page.evaluate('Boolean(state.deck["S0-ARC-001"])'),(style,'incompatible card not removed')
  assert page.evaluate('state.slots[0].progressionId')=='S0-MAG-H001'
  assert not errors,(style,errors)
  print('PASS',style,'Effect filter, Available Cards default, and Hero selection',flush=True)
  page.close()
 browser.close()
