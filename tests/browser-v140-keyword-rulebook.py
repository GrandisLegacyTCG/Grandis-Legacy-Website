from pathlib import Path
import json,re
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
STYLES={
 'Style 1':{'html':'index.html','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css'],'app':'js/app-s0.js','base':''},
 'Style 2':{'html':'style-2/index.html','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css','style-2/css/s0-style2-quantities-v1.36.css'],'app':'style-2/js/app-s0.js','base':'../'}
}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
EXPECTED={
 'MELEE':'This Attack can only target an opposing active Hero in the directly opposite position.',
 'RANGE':'This Attack can target Heroes outside its normal Area of Attack. Attacking outside that area counts as a Range Attack.',
 'PIERCING':'This Attack cannot be Blocked.',
 'SURE HIT':'This Attack cannot be Dodged.',
 'BLOCK':'Reduces incoming Attack damage as stated on the card.',
 'DODGE':'The Hero avoids the Attack.',
 'BUFF':"Using this Skill or Event does not change the Hero's Ready or Exhausted state. It can be used while Exhausted only if the card allows it.",
 'CONDITION':'The card can only be used when the condition stated on the card is met.',
 'REACTION':'The card may be used during Response when the trigger stated on the card is met.',
 'HEAL':'Restores HP as stated on the card.',
 'REVIVE':'Revives a defeated Hero as stated on the card.',
 'INVINCIBLE':'The Hero cannot take damage from an opponent or receive new Status from an opponent. Existing Status remains active.',
 'ALL OPPONENTS':'Affects all opposing active Heroes, ignoring normal Area of Attack.',
 'REFLECT':'When this Hero is attacked, deal damage to the attacker as stated on the card.',
 'MANA BURN':"Remove the stated number of Mana cards from your opponent's Mana Pool.",
 'MANA STEAL':"Remove the stated number of Mana cards from your opponent's Mana Pool, then take the same number of Mana cards from your Mana Deck into your Mana Pool."
}
SPECIAL={'MANA COST +1':'The required Mana is 1 higher than the printed Mana Cost.', 'MANA COST +2':'The required Mana is 2 higher than the printed Mana Cost.'}
CARD={
 'MELEE':'S0-ARC-001','RANGE':'S0-ARC-020','PIERCING':'S0-WAR-007','SURE HIT':'S0-ARC-008',
 'BLOCK':'S0-ARC-012','DODGE':'S0-ARC-003','BUFF':'S0-ARC-013','CONDITION':'S0-ARC-003',
 'REACTION':'S0-CLE-012','HEAL':'S0-CLE-009','REVIVE':'S0-CLE-015','INVINCIBLE':'S0-CLE-025',
 'ALL OPPONENTS':'S0-MAG-013','REFLECT':'S0-THF-022','MANA BURN':'S0-MAG-020','MANA STEAL':'S0-MAG-021',
 'MANA COST +1':'S0-MAG-030','MANA COST +2':'S0-CLE-025'
}
def mount(page,style):
 d=STYLES[style]; html=(R/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
 html=html.replace('<base href="../">','')
 html=html.replace('</head>',''.join(f'<style>{(R/c).read_text()}</style>' for c in d['css'])+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
 for style in STYLES:
  page=b.new_page(viewport={'width':1440,'height':960})
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  mount(page,style)
  actual=page.evaluate('window.GL_S0_REVIEW_CLARITY.EXPLANATIONS')
  assert actual=={**EXPECTED,**SPECIAL},(style,actual)
  for keyword,cid in CARD.items():
   page.evaluate('(cid)=>openCardReview(cid)',cid)
   lines=page.locator('.review-keyword-line').evaluate_all("els=>els.map(el=>[el.querySelector('img').alt,el.querySelector('.review-keyword-description').textContent])")
   matching=dict(lines)
   assert keyword in matching,(style,cid,keyword,matching)
   assert matching[keyword]==actual[keyword],(style,cid,keyword,matching[keyword])
  page.evaluate("openCardReview('S0-ARC-020')")
  rangeText=page.locator('.review-keyword-explanation').inner_text()
  assert 'Attacking outside that area counts as a Range Attack.' in rangeText
  assert page.locator('.review-card').count()==1
  assert not errors,(style,errors)
  print('PASS',style,'16/16 Rulebook p12 keywords + 2 card-only Mana Cost labels rendered in Card Review, no JS errors')
  page.close()
 b.close()
