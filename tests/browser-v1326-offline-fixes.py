from pathlib import Path
import re
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
css={'style1':['css/app.css','css/s0-enhancements-v1.32.2.css'],'style2':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css']}
js={'style1':['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/app-s0.js'], 'style2':['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','style-2/js/app-s0.js']}
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for sty,rel,base in [('style1','index.html',''),('style1','style-1/index.html',''),('style2','style-2/index.html','../')]:
  page=browser.new_page(viewport={'width':1440,'height':840});errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  html=(R/rel).read_text()
  html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
  html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
  html=html.replace('<base href="../">','') # test set_content has synthetic document, not file URL
  html=html.replace('</head>', ''.join(f'<style>{(R/path).read_text()}</style>' for path in css[sty])+'</head>')
  script='<script>window.GL_DECK_BUILDER_BASE='+repr(base)+';</script>'
  for path in js[sty]: script+='<script>'+(R/path).read_text()+'</script>'
  html=html.replace('</body>',script+'</body>')
  page.set_content(html,wait_until='commit')
  info=page.evaluate('''() => ({cards:window.GL_DECK_BUILDER_DATA.mainCards.length,
   sourceImage:window.GL_DECK_BUILDER_DATA.mainCards[0].image,
   srcHero:window.GL_DECK_BUILDER_DATA.legacyCards[0].image,
   srcCover:window.GL_DECK_BUILDER_DATA.legacyPackages[0].coverImage,
   available:state.progressions.map(x=>x.name),
   url:document.querySelector('.style-switch-link')?.getAttribute('href')})''')
  assert info['cards']==163
  assert len(info['available'])==13,info['available']
  assert 'Melody Silverstring' not in info['available'] and 'Bromir Oathforge' not in info['available']
  assert info['sourceImage']==base+'assets/season0/cards/S0-ARC-001.webp', info['sourceImage']
  assert info['srcHero'].startswith(base+'assets/season0/cards/')
  assert info['srcCover'].startswith(base+'assets/season0/cards/')
  assert 'index.html' in info['url'],info['url']
  if sty=='style1':
   assert page.locator('.hero-package').count()==13
   assert page.locator('.hero-package').filter(has_text='Melody Silverstring').count()==0
   assert page.locator('.hero-package').filter(has_text='Bromir Oathforge').count()==0
   assert page.locator('img[src*="{S0_IMAGE_BASE}"]').count()==0
   assert page.locator('.hero-package img').first.get_attribute('src').startswith(base+'assets/season0/cards/')
  else:
   page.locator('[data-choose-hero="0"]').click()
   assert page.locator('[data-progression-choice]').count()==13
   assert page.locator('[data-progression-choice="S0-MAG-H007"]').count()==0
   assert page.locator('[data-progression-choice="S0-CLE-H007"]').count()==0
   assert page.locator('.hero-choice img').first.get_attribute('src').startswith(base+'assets/season0/cards/')
   page.locator('[data-progression-choice="S0-ARC-H001"]').click();page.locator('[data-tab="main"]').click()
   assert page.locator('.library-card img').first.get_attribute('src').startswith(base+'assets/season0/cards/')
  assert not errors,errors
  print('PASS Chromium injected DOM',rel,'13 available heroes, assets prefixed, direct switch',info['url'])
  page.close()
 browser.close()
