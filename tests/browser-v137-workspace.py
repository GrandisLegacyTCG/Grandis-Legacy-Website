"""DB-11 v1.37.0: real click handoff using both app implementations, round-trip edits.
HTTP/file navigation is blocked by the harness; manually recreate a destination page with
exact hash as produced by the real click handler (not injected saved localStorage).
"""
from pathlib import Path
from urllib.parse import urlsplit
import json,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
STYLES={'style1':{'html':'index.html','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css'],'app':'js/app-s0.js','base':''},
        'style2':{'html':'style-2/index.html','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','style-2/css/s0-style2-quantities-v1.36.css'],'app':'style-2/js/app-s0.js','base':'../'}}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']

def mount(page,style,hash_value=''):
 d=STYLES[style]
 page.goto('about:blank'+hash_value)
 html=(ROOT/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I).replace('<base href="../">','')
 html=html.replace('</head>',''.join('<style>'+(ROOT/c).read_text()+'</style>' for c in d['css'])+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(ROOT/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')
 assert page.evaluate('Boolean(window.GL_S0_SHARED_WORKSPACE)')
 # The about:blank harness has no document base URL, but live navigation links
 # have resolved absolute hrefs. Supply only the href, not the transfer fragment.
 page.evaluate("({style})=>{document.querySelector('.style-switch-link').href='https://example.test/'+(style==='style2'?'style-1/index.html':'style-2/index.html');document.addEventListener('click',e=>{if(e.target.closest('.style-switch-link'))e.preventDefault();},true)}",{'style':style})
 return page

def handoff(page):
 page.locator('.style-switch-link').first.click()
 href=page.locator('.style-switch-link').first.get_attribute('href')
 frag='#'+urlsplit(href).fragment
 assert frag.startswith('#gl-s0-workspace='),href
 saved=page.evaluate("localStorage.getItem('grandis-season0-deck-draft-v2')")
 assert saved, 'current style failed to save its own draft'
 return frag

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  a=browser.new_page();errors=[];a.on('pageerror',lambda e:errors.append(str(e)));mount(a,'style2')
  assert a.evaluate('countDeck()')==0
  a.evaluate("""()=>{const p=state.progressions.find(p=>p.baseClass==='Mage'); state.slots[2]={progressionId:p.id,legacyId:''};renderLegacy();setTab('main');addMainCard('S0-MAG-002');addMainCard('S0-MAG-002');document.querySelector('#deckName').value='Style 2 initial';document.querySelector('#deckName').dispatchEvent(new Event('input',{bubbles:true}));}""")
  assert a.evaluate('countDeck()')==2
  frag=handoff(a)
  assert len(frag)<10000
  b=browser.new_page();b.on('pageerror',lambda e:errors.append(str(e)));mount(b,'style1',frag)
  assert b.evaluate('countDeck()')==2,b.evaluate('state.deck')
  assert b.evaluate("state.deck['S0-MAG-002']")==2
  assert b.evaluate('state.slots.map(s=>s.progressionId)')==['','','S0-MAG-H001']
  assert b.evaluate('state.slots[2].legacyId')==''
  assert b.locator('#deckName').input_value()=='Style 2 initial'
  # about:blank blocks history.replaceState; production HTTP navigation consumes the hash.
  # Edit Style 1 and prove those changes reach Style 2 (not just old persisted Style 2 draft).
  b.evaluate("""()=>{addMainCard('S0-MAG-002');const pr=state.progressions.find(p=>p.baseClass==='Thief');state.slots[0]={progressionId:pr.id,legacyId:''};renderAll();document.querySelector('#deckName').value='Edited in Style 1';document.querySelector('#deckName').dispatchEvent(new Event('input',{bubbles:true}));}""")
  assert b.evaluate("state.deck['S0-MAG-002']")==3
  frag2=handoff(b)
  c=browser.new_page();c.on('pageerror',lambda e:errors.append(str(e)));mount(c,'style2',frag2)
  assert c.evaluate('countDeck()')==3
  assert c.evaluate("state.deck['S0-MAG-002']")==3
  assert c.evaluate('state.slots.map(s=>s.progressionId)')==['S0-THF-H001','','S0-MAG-H001']
  assert c.locator('#deckName').input_value()=='Edited in Style 1'
  # A third round-trip after deletion must not resurrect stale cards.
  c.evaluate("removeMainCard('S0-MAG-002')")
  frag3=handoff(c)
  d=browser.new_page();d.on('pageerror',lambda e:errors.append(str(e)));mount(d,'style1',frag3)
  assert d.evaluate('countDeck()')==2
  assert d.evaluate('state.slots.map(s=>s.progressionId)')==['S0-THF-H001','','S0-MAG-H001']
  print('PASS DB-11 Style 2 → Style 1 → Style 2 → Style 1 with edited deck and exact slot persistence')
  # Shared-origin multi-tab update: receive the storage event from a sibling instance.
  c.evaluate("addMainCard('S0-MAG-002')")
  newest=c.evaluate("localStorage.getItem('grandis-season0-deck-draft-v2')")
  d.evaluate("raw=>window.dispatchEvent(new StorageEvent('storage',{key:'grandis-season0-deck-draft-v2',newValue:raw}))",newest)
  assert d.evaluate('countDeck()')==3
  assert d.locator('#deckName').input_value()=='Edited in Style 1'
  print('PASS DB-11 shared-origin cross-tab storage event updates existing Style 1 view')
  # Exact blank state is also portable, not silently restored from stale local data.
  c.evaluate('blankDeck()')
  blank=handoff(c)
  e=browser.new_page();e.on('pageerror',lambda e2:errors.append(str(e2)));mount(e,'style1',blank)
  assert e.evaluate('countDeck()')==0
  assert e.evaluate('state.slots.every(s=>!s.progressionId&&!s.legacyId)')
  print('PASS DB-11 intentional blank deck propagates to the other style')
  assert not errors,errors
 finally:
  browser.close()
print('v1.37.0 cross-style handoff regression PASS')
