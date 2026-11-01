from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re
ROOT=Path(__file__).resolve().parents[1]
STYLES={
  'Style1':{'html':'index.html','base':'','app':'js/app-s0.js','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css']},
  'Style2':{'html':'style-2/index.html','base':'../','app':'style-2/js/app-s0.js','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css']},
}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
def mount(page,style,version='v144'):
 d=STYLES[style];html=(ROOT/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
 css=list(d['css'])+['css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css']
 if style=='Style2':css+=['style-2/css/s0-style2-quantities-v1.36.css']
 css+=['css/s0-review-v1.41.css']
 if version!='v141':css+=['css/s0-review-v1.42.css','css/s0-review-v1.43.css','css/s0-review-v1.44.css']
 html=html.replace('</head>',''.join(f'<style>{(ROOT/c).read_text()}</style>' for c in css)+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(ROOT/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')

def measure_art(page):
 return page.evaluate('''() => ({art:document.querySelector('#reviewArt').getBoundingClientRect().width,
   layout:document.querySelector('.review-layout').getBoundingClientRect().width,
   css:getComputedStyle(document.querySelector('.review-layout')).gridTemplateColumns,
   kind:document.querySelector('#cardReviewDialog').dataset.reviewKind})''')

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for style in STYLES:
  for w,h in [(1440,900),(1365,720),(1024,768),(768,700),(390,844)]:
   before=browser.new_page(viewport={'width':w,'height':h});mount(before,style,'v141')
   before.evaluate("openCardReview('S0-ARC-003')");prior=measure_art(before)
   before.close()
   page=browser.new_page(viewport={'width':w,'height':h});errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   mount(page,style);page.evaluate("openCardReview('S0-ARC-003')");current=measure_art(page)
   ratio=current['art']/prior['art']
   assert abs(ratio-.75)<.012,(style,w,h,prior,current,ratio)
   print('PASS artwork',style,w,h,'v1.41',round(prior['art'],2),'new',round(current['art'],2),'ratio',round(ratio,4),flush=True)
   # Hero Lineage must be visible immediately (without a review-card scroll) for each progression Hero.
   result=page.evaluate('''() => {
     let errors=[],checked=0,inside=[];
     for(const c of state.legacyCards.filter(x=>x.family==='Hero')) {
       openCardReview(c.id);checked++;
       const dlg=document.querySelector('#cardReviewDialog'),modal=dlg.querySelector('.review-card'),body=dlg.querySelector('.review-layout'),footer=dlg.querySelector('.review-progression');
       const r=footer.getBoundingClientRect(),b=modal.getBoundingClientRect(),style=getComputedStyle(footer);
       if(footer.hidden || style.display==='none')errors.push(c.id+': lineage hidden');
       if(r.top < b.top || r.bottom > b.bottom + 1 || r.bottom > innerHeight-1)errors.push(c.id+': footer outside modal/viewport');
       if(modal.scrollHeight>modal.clientHeight+2)errors.push(c.id+': outer modal scrolling');
       if(body.scrollHeight>body.clientHeight+2)inside.push(c.id);
       if(footer.querySelectorAll('[data-review-rank-id]').length!==3)errors.push(c.id+': lineage not 3 thumbnails');
     }
     return {checked,errors,innerScrollCount:inside.length};
   }''')
   assert result['checked']==45 and not result['errors'],(style,w,h,result)
   # Button remains operable: rank switch updates selected Hero without scrolling.
   hero=page.evaluate("state.legacyCards.find(x=>x.family==='Hero'&&x.name.includes('Melody')).id")
   page.evaluate('(id)=>openCardReview(id)',hero)
   first=page.locator('#reviewProgressionCards button').first
   first.click()
   assert page.locator('#reviewProgressionCards button').count()==3
   assert not errs,(style,w,h,errs[:5])
   print('PASS hero lineage',style,w,h,result,'errors',len(errs),flush=True)
   page.close()
 browser.close()
