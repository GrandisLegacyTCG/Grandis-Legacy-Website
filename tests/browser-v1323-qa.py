"""Chromium end-to-end QA for Season0 v1.32.3, with actual original CSS and inline JS.
The QA environment blocks browser navigation to local HTTP/file URLs."""
import pathlib, json, re
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
def inline_page(style):
 file=ROOT/('index.html' if style=='style1' else 'style-2/index.html')
 html=file.read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', html, flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>', '', html, flags=re.I)
 css=['css/app.css','css/s0-enhancements-v1.32.2.css'] if style=='style1' else ['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css']
 js=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/app-s0.js' if style=='style1' else 'style-2/js/app-s0.js']
 html=html.replace('</head>', ''.join('<style>'+(ROOT/x).read_text()+'</style>' for x in css)+'</head>')
 scripts='<script>window.GL_DECK_BUILDER_BASE="'+('' if style=='style1' else '../')+'";</script>'
 scripts+=''.join('<script>'+(ROOT/f).read_text()+'</script>' for f in js)
 return html.replace('</body>',scripts+'</body>')
results=[]
with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for style in ['style1','style2']:
   page=browser.new_page(viewport={'width':1423,'height':860},accept_downloads=True)
   page.set_default_timeout(10000)
   errors=[]
   page.on('pageerror',lambda err:errors.append(str(err)))
   page.set_content(inline_page(style),wait_until='commit',timeout=15000)
   page.wait_for_function('typeof window.GL_S0_AVAILABLE_CARDS === "object"')
   print(style,'init',flush=True)
   if style=='style1':
    page.locator('#createBlankDeck').click()
    page.locator('[data-hero-action="S0-ARC-H001"]').click()
    page.locator('button[data-library-tab="skills"]').click()
    page.locator('#filterToggle').click()
    page.locator('#cardPoolSelect').select_option('available')
    ids=page.locator('[data-main-library-id]').evaluate_all('(els)=>els.map(x=>x.dataset.mainLibraryId)')
    assert 'S0-ARC-001' in ids, ('Korvak own Skill missing',style)
    assert 'S0-MAG-001' not in ids, ('Off-class Mage Skill exposed',style)
    assert 'S0-ARC-018' in ids and 'S0-ARC-025' not in ids, ('Ultimate owner filtering',style)
    page.locator('#cardPoolSelect').select_option('all')
    all_ids=page.locator('[data-main-library-id]').evaluate_all('(els)=>els.map(x=>x.dataset.mainLibraryId)')
    assert 'S0-MAG-001' in all_ids
    for name in ['S0-CLE-H001','S0-WAR-H001']:
     page.locator('button[data-library-tab="heroes"]').click()
     page.locator(f'[data-hero-action="{name}"]').click()
    print('style1 chosen heroes',page.evaluate('state.slots'))
    export_sel='#exportDeckButton';count_sel='#mainTotal'
   else:
    assert page.locator('#availableCardsToggle').is_disabled(), 'Available should require hero'
    for slot,prog in enumerate(['S0-ARC-H001','S0-CLE-H001','S0-WAR-H001']):
     page.locator(f'[data-choose-hero="{slot}"]').click()
     page.locator(f'[data-progression-choice="{prog}"]').click()
    page.locator('button[data-tab="main"]').click()
    page.locator('#filterToggle').click()
    page.locator('#availableCardsToggle').click()
    ids=page.locator('[data-library-card]').evaluate_all('(els)=>els.map(x=>x.dataset.libraryCard)')
    assert 'S0-ARC-001' in ids
    assert 'S0-MAG-001' not in ids
    assert 'S0-ARC-018' in ids and 'S0-ARC-025' not in ids
    page.locator('#allCardsToggle').click()
    ids=page.locator('[data-library-card]').evaluate_all('(els)=>els.map(x=>x.dataset.libraryCard)')
    assert 'S0-MAG-001' in ids
    export_sel='#exportJson';count_sel='#deckCount'
   print(style,'heroes/filter checks OK',flush=True)
   assert page.locator(export_sel).is_disabled(),f'{style} enabled export empty'
   # Exercise actual add method repeatedly; 17 items -> 50; 20 -> 60.
   valid_item_ids=page.evaluate('state.cards.filter(c=>c.family === "Item").map(c=>c.id)')
   assert len(valid_item_ids)==20
   print(style,'building 50',flush=True)
   for item_id in valid_item_ids[:16]:
    for _ in range(3):page.evaluate('(id)=>addMainCard(id)',item_id)
   for _ in range(2):page.evaluate('(id)=>addMainCard(id)',valid_item_ids[16])
   cnt=page.locator(count_sel).inner_text();assert '50' in cnt,(style,cnt)
   validity=page.evaluate('({issues:validationIssues(),count:countDeck()})')
   print(style,'50 construction',validity)
   assert not validity['issues'],(style,validity)
   assert not page.locator(export_sel).is_disabled(),f'{style} disabled valid 50-card export'
   with page.expect_download(timeout=8000) as info:page.locator(export_sel).click()
   download=info.value
   assert download.suggested_filename.endswith('.json')
   with open(download.path()) as stream:
    exported=json.load(stream)
   assert exported['is_valid'] and exported['builder_version']=='1.32.3'
   page.evaluate('(id)=>addMainCard(id)',valid_item_ids[16]);cnt=page.locator(count_sel).inner_text();assert '51' in cnt,(style,cnt)
   assert page.locator(export_sel).is_disabled(),f'{style} export enabled at 51'
   for _ in range(3):page.evaluate('(id)=>addMainCard(id)',valid_item_ids[17])
   for _ in range(3):page.evaluate('(id)=>addMainCard(id)',valid_item_ids[18])
   for _ in range(3):page.evaluate('(id)=>addMainCard(id)',valid_item_ids[19])
   # 51 + 9 = 60 exactly
   assert page.evaluate('countDeck()')==60,(style,'60 not reached',page.evaluate('countDeck()'))
   before=page.evaluate('JSON.stringify(state.deck)')
   page.evaluate('(id)=>addMainCard(id)',valid_item_ids[0])
   assert page.evaluate('countDeck()')==60 and page.evaluate('JSON.stringify(state.deck)')==before,style
   assert page.locator(export_sel).is_disabled(),f'{style} exported at 60'
   print(style,'workspace count',page.locator(count_sel).inner_text(),'; export disabled at 60')
   # Verify 60-card draft round-trip through the same normalization used by import/restore.
   restored=page.evaluate('''() => {const saved=s0Export('shared');const encoded=JSON.stringify(saved);state.deck={};applyDeck(normalizeImportedDeck(JSON.parse(encoded)));return countDeck()}''')
   assert restored==60,(style,'60-copy S0 draft round trip failed')
   assert page.locator(export_sel).is_disabled()
   for _ in range(10):page.evaluate('(id)=>removeMainCard(id)',valid_item_ids[0] if _<3 else valid_item_ids[1] if _<6 else valid_item_ids[2] if _<9 else valid_item_ids[3])
   # Removes 10 cards, still 50
   assert page.evaluate('countDeck()')==50,(style,'count after trimming')
   assert not page.locator(export_sel).is_disabled(),(style,'50 valid after trim')
   assert not errors,(style,errors)
   results.append(style+' inline Chromium browser PASS')
   page.close()
  browser.close()
print('\n'.join(results))
