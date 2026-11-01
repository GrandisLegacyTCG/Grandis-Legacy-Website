import pathlib
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent
import re

def inline_page(style):
 html=(root/('index.html' if style=='style1' else 'style-2/index.html')).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', html, flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>', '', html, flags=re.I)
 css_files=['css/app.css','css/s0-enhancements-v1.32.2.css'] if style=='style1' else ['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css']
 js_files=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js', 'js/app-s0.js' if style=='style1' else 'style-2/js/app-s0.js']
 html=html.replace('</head>', ''.join('<style>'+ (root/c).read_text()+'</style>' for c in css_files)+'</head>')
 scripts='<script>window.GL_DECK_BUILDER_BASE="'+('' if style=='style1' else '../')+'";</script>'
 scripts+=''.join('<script>'+(root/f).read_text()+'</script>' for f in js_files)
 return html.replace('</body>',scripts+'</body>')
errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for style in ('style1','style2'):
  page=browser.new_page(viewport={'width':1423,'height':745})
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(inline_page(style),wait_until='domcontentloaded')
  assert page.locator('#keywordFilter option').count()>3,(style,'keywords missing')
  kw=page.locator('#keywordFilter option').all_text_contents()
  print(style,'keyword options:',len(kw),kw[:8]);
  if style=='style1':
   page.locator('#createBlankDeck').click()
   page.locator('#filterToggle').click()
   page.locator('button[data-library-tab="skills"]').click()
  else:
   page.locator('button[data-tab="main"]').click()
   page.locator('#filterToggle').click()
  page.locator('#keywordFilter').select_option('DODGE')
  kwcount=int(page.locator('#libraryResultCount' if style=='style1' else '#resultCount').inner_text().split()[0])
  print(style,'DODGE results',kwcount)
  assert kwcount>0
  page.locator('#keywordFilter').select_option('')
  if style=='style2':
   page.locator('[data-hover-card-id]').first.hover()
   geom=page.evaluate('''() => {const box=document.querySelector('#hoverCardZoom').getBoundingClientRect();const main=document.querySelector('.main-deck-panel').getBoundingClientRect();return {boxX:box.left,mainX:main.left}}''')
   print('style2 hover Library',geom)
   assert abs(geom['boxX']-geom['mainX'])<2,geom
   page.locator('[data-library-card]').first.click()
   page.locator('[data-deck-card]').first.hover()
   geom=page.evaluate('''() => {const box=document.querySelector('#hoverCardZoom').getBoundingClientRect();const library=document.querySelector('.library-panel').getBoundingClientRect();return {boxR:box.right,libR:library.right}}''')
   print('style2 hover Deck',geom)
   assert abs(geom['boxR']-geom['libR'])<2,geom
   page.locator('button[data-tab="legacy"]').click()
   page.locator('[data-choose-hero]').first.click()
   assert page.locator('#heroPickerDialog').evaluate('(el)=>el.open')
   metrics=page.evaluate('''() => {const dlg=document.querySelector('#heroPickerDialog .dialog-card');const grid=document.querySelector('#heroPickerGrid')||document.querySelector('.hero-picker-grid'); return {client:dlg.clientWidth,scroll:dlg.scrollWidth,gridClient:grid.clientWidth,gridScroll:grid.scrollWidth,height:dlg.clientHeight,scrollHeight:dlg.scrollHeight}}''')
   print('style2 popup measurements',metrics)
   assert metrics['scroll']<=metrics['client']+2,metrics
   assert metrics['gridScroll']<=metrics['gridClient']+2,metrics
   page.locator('#heroPickerClose').click()
  # import real S1 legacy deck via source archive file
  imported=root/'release/history/starter_deck_examples_v1.5_retired/starter_01_elemental_lord_conqueror_saint_GL_DECK_1_0.json'
  file_sel='#deckFileInput' if style=='style1' else '#jsonFileInput'
  page.locator(file_sel).set_input_files(str(imported))
  page.locator('#confirmDialog').wait_for(state='visible',timeout=3000)
  summary=page.locator('#confirmMessage').inner_text()
  print(style,'import preview',summary[:145])
  assert '58' in summary and '60' in summary and '2' in summary
  page.locator('#confirmOk').click()
  if style=='style1':
   total=page.locator('#mainTotal').inner_text()
  else:
   total=page.locator('#deckCount').inner_text()
  assert '58' in total,(style,total)
  print(style,'imported count:',total)
  page.close()
 browser.close()
print('browser errors',errors)
assert not errors
print('PASS interactive tests: both styles, keyword, S1 import, hover, popup')
# Responsive popup QA on constrained viewports (test renderer shares the actual CSS/JS).
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for style in ('style1','style2'):
  for width,height in ((900,520),(390,700)):
   page=browser.new_page(viewport={'width':width,'height':height})
   page.set_content(inline_page(style),wait_until='domcontentloaded')
   if style=='style1':
    popup=page.locator('#newDeckDialog')
   else:
    page.locator('[data-choose-hero]').first.click()
    popup=page.locator('#heroPickerDialog')
   dimensions=popup.evaluate('''d=>{let card=d.querySelector('.dialog-card');let choices=d.querySelector('.hero-picker-grid');return {vw:innerWidth,dialog:card.clientWidth,scroll:card.scrollWidth,visible:card.clientHeight,total:card.scrollHeight,choices:choices?choices.scrollWidth:null,choicesClient:choices?choices.clientWidth:null}}''')
   print('responsive',style,width,height,dimensions)
   assert dimensions['scroll']<=dimensions['dialog']+2,dimensions
   assert dimensions['dialog']<=width,dimensions
   assert dimensions['choices'] is None or dimensions['choices']<=dimensions['choicesClient']+2,dimensions
   page.close()
 browser.close()
print('PASS constrained responsive popup checks')
