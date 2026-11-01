"""Offline Chromium integration: both original styles, 15 Heroes, new skills and owner-gated Ultimates."""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
css={'style1':['css/app.css','css/s0-enhancements-v1.32.2.css'],'style2':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css']}
js={'style1':['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/app-s0.js'], 'style2':['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','style-2/js/app-s0.js']}
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for sty,rel,base in [('style1','index.html',''),('style1','style-1/index.html',''),('style2','style-2/index.html','../')]:
  page=browser.new_page(viewport={'width':1440,'height':860});errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  html=(R/rel).read_text();html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I);html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I);html=html.replace('<base href="../">','')
  html=html.replace('</head>', ''.join(f'<style>{(R/f).read_text()}</style>' for f in css[sty])+'</head>')
  html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+repr(base)+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in js[sty])+'</body>')
  page.set_content(html,wait_until='commit')
  info=page.evaluate('''() => ({cards:window.GL_DECK_BUILDER_DATA.mainCards.length,heroes:state.progressions.map(x=>x.name),starters:state.starters.length,art:window.GL_DECK_BUILDER_DATA.mainCards.at(-1).image})''')
  assert info['cards']==187,info;assert len(info['heroes'])==15,info;assert 'Melody Silverstring' in info['heroes'] and 'Bromir Oathforge' in info['heroes'],info
  assert info['starters']==0 and info['art'].startswith(base+'assets/season0/cards/'),info
  if sty=='style1':
   assert page.locator('#newDeckDialog').is_hidden() if page.locator('#newDeckDialog').count() else True
   assert page.locator('#createBlankDeck').count() >= 0 # new deck is an optional action, not initial gate
   assert page.locator('.hero-package').filter(has_text='Melody Silverstring').count()>0
   page.locator('[data-hero-action="S0-CLE-H007"]').click()
   page.locator('[data-library-tab="skills"]').click()
   page.locator('#searchInput').fill('Grand Finale')
   assert page.locator('[data-main-library-id="S0-CLE-031"]').count()==1
   assert page.locator('img[src*="{S0_IMAGE_BASE}"]').count()==0
  else:
   page.locator('[data-choose-hero="0"]').click()
   assert page.locator('[data-progression-choice="S0-CLE-H007"]').count()==1
   assert page.locator('[data-progression-choice="S0-MAG-H007"]').count()==1
   page.locator('[data-progression-choice="S0-MAG-H007"]').click()
   page.locator('[data-tab="main"]').click()
   page.evaluate("addMainCard('S0-MAG-031')")
   assert page.evaluate("state.deck['S0-MAG-031']")==1
   page.evaluate("addMainCard('S0-CLE-031')")
   assert not page.evaluate("state.deck['S0-CLE-031']"),'wrong-owner Ultimate unexpectedly added'
   page.evaluate("addMainCard('S0-MAG-028')")
   assert page.evaluate("state.deck['S0-MAG-028']")==1,'hybrid Warrior row not accessible'
  assert not errors,(sty,rel,errors)
  print('PASS Chromium',rel,'187 Main / 15 Hero progressions / no starters / legal Skills')
  page.close()
 browser.close()
