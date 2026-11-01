"""Style 2, R2 source 218, preserve-if-visible and reset-to-available-if-hidden interactions."""
import pathlib,re
from playwright.sync_api import sync_playwright
R=pathlib.Path(__file__).resolve().parent.parent
html=(R/'style-2/index.html').read_text()
html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
css=['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css']
js=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','style-2/js/app-s0.js']
html=html.replace('</head>',''.join('<style>'+(R/x).read_text()+'</style>' for x in css)+'</head>')
html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE="../";</script>'+''.join('<script>'+(R/x).read_text()+'</script>' for x in js)+'</body>')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1423,'height':850});err=[];page.on('pageerror',lambda x:err.append(str(x)))
 page.set_content(html,wait_until='commit')
 page.locator('[data-choose-hero="0"]').click();page.locator('[data-progression-choice="S0-ARC-H001"]').click();page.locator('[data-tab="main"]').click()
 page.evaluate('addMainCard("S0-ARC-001")')
 page.locator('#filterToggle').click()
 # Card still available when Type Skill: click must preserve current Type/Pool.
 page.locator('#familyFilter').select_option('Skill')
 assert page.locator('#availableCardsToggle').get_attribute('aria-checked')=='true'
 page.locator('[data-deck-card="S0-ARC-001"]').first.click()
 assert page.locator('#familyFilter').input_value()=='Skill','filter unexpectedly reset despite tile visible'
 # Card hidden under Item filter: click must reset to All Types + Available Cards.
 page.locator('#familyFilter').select_option('Item')
 assert page.locator('#cardLibrary [data-library-card="S0-ARC-001"]').count()==0
 page.locator('[data-deck-card="S0-ARC-001"]').first.click()
 assert page.locator('#familyFilter').input_value()=='','did not reset to All Types'
 assert page.locator('#availableCardsToggle').get_attribute('aria-checked')=='true','lost Available Cards'
 assert page.locator('#cardLibrary [data-library-card="S0-ARC-001"]').count()>0,'target not revealed'
 assert not err,err
 print('PASS Chromium Style 2 R2: visible card keeps filters; hidden card resets to All Types + Available and highlights')
 page.close();browser.close()
