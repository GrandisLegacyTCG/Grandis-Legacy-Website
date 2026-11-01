from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re,base64
R=Path(__file__).resolve().parents[1]
STYLES={
 'Style1':{'html':'index.html','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css','css/s0-review-v1.41.css','css/s0-review-v1.42.css'],'app':'js/app-s0.js','base':''},
 'Style2':{'html':'style-2/index.html','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css','style-2/css/s0-style2-quantities-v1.36.css','css/s0-review-v1.41.css','css/s0-review-v1.42.css'],'app':'style-2/js/app-s0.js','base':'../'}
}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
def mount(page,style):
 d=STYLES[style]; html=(R/d['html']).read_text()
 html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
 html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
 html=html.replace('</head>',''.join(f'<style>{(R/c).read_text()}</style>' for c in d['css'])+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')
def show_card(page,card_id):
 page.evaluate('(id)=>openCardReview(id)',card_id)
 imgpath=page.evaluate('''() => document.querySelector('#reviewArt').getAttribute('src')''')
 if imgpath.startswith('data:'):
  return 'embedded-image',True
 img=(R/imgpath).resolve() if not imgpath.startswith('../') else (R/'style-2'/imgpath).resolve()
 if not img.exists():
  # some image paths refer to both styles via assets/ etc
  img=(R/imgpath.replace('../','')).resolve()
 if img.exists():
  mime='image/webp' if img.suffix.lower()=='.webp' else 'image/png' if img.suffix.lower()=='.png' else 'image/jpeg'
  uri=f'data:{mime};base64,'+base64.b64encode(img.read_bytes()).decode('ascii')
  page.locator('#reviewArt').evaluate('(el,src)=>el.src=src',uri)
 return imgpath,img.exists()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 STYLES['Style1-alias']={**STYLES['Style1'],'html':'style-1/index.html'}
 for style in STYLES:
  for width,height in [(1440,900),(390,844)]:
   page=b.new_page(viewport={'width':width,'height':height})
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   mount(page,style)
   result=page.evaluate('''() => {
    let n=0,metric=0,withStatus=0,withKeyword=0,withCondition=0,ult=0;
    const cards=state.cards;
    const exceptions=[];
    for(const c of cards){
      openCardReview(c.id);n++;
      const summ=document.querySelector('#reviewStats');
      const labels=[...summ.querySelectorAll('.review-summary-item>span')].map(x=>x.textContent);
      const entry=[...summ.querySelectorAll('.review-summary-item>strong')].map(x=>x.textContent);
      const expected=c.family==='Skill'?['CARD TYPE','SUBTYPE','MANA COST','EXP TRIBUTE']:['CARD TYPE','SUBTYPE','MANA COST'];
      if(c.family==='Skill'&&labels.join('|')!==expected.join('|'))exceptions.push(c.name+': '+labels);
      if(c.family==='Skill'&&entry[0]==='ULTIMATE')ult++;
      metric+=document.querySelectorAll('.review-effect-metric').length;
      withStatus+=(document.querySelectorAll('.review-status-explanations').length>0);
      withKeyword+=(document.querySelectorAll('.review-keyword-explanation').length>0);
      withCondition+=(document.querySelectorAll('.review-condition-panel').length>0);
    }
    let heroes=0,heroIssue=[];
    for(const c of state.legacyCards.filter(c=>c.family==='Hero')){
     openCardReview(c.id);heroes++;
     const labels=[...document.querySelectorAll('#reviewStats .review-summary-item>span')].map(x=>x.textContent);
     if(labels.join('|')!=='CARD TYPE|HP|REQUIRED EXP')heroIssue.push(c.name+': '+labels);
     if(!document.querySelector('.hero-class-section .review-hero-class-summary'))heroIssue.push(c.name+': no class+rank');
     if(document.querySelectorAll('.review-progression-card').length!==3)heroIssue.push(c.name+': no lineage3');
    }
    openCardReview('S0-ARC-003');
    const kwHeight=getComputedStyle(document.querySelector('.review-keyword-line .review-keyword-image')).height;
    openCardReview('S0-CLE-024');
    const card=document.querySelector('#cardReviewDialog .review-card'),ar=document.querySelector('.review-art');
    const title=document.querySelector('.review-summary-item>span');
    const entry=document.querySelector('.review-summary-item>strong');
    const effect=document.querySelector('.review-effect-info p');
    const status=document.querySelector('.review-status-line');
    const keyword=document.querySelector('.review-keyword-image');
    const stats={gold:[getComputedStyle(title).fontSize,getComputedStyle(title).fontWeight],white:[getComputedStyle(entry).fontSize,getComputedStyle(entry).fontWeight],effect:[getComputedStyle(effect).fontSize,getComputedStyle(effect).fontWeight],status:[getComputedStyle(status).fontSize,getComputedStyle(status).fontWeight],keyword:keyword?getComputedStyle(keyword).height:null};
    const layout={modalHeight:card.getBoundingClientRect().height,artWidth:ar.getBoundingClientRect().width,windowHeight:innerHeight,scrollHeight:card.scrollHeight,clientHeight:card.clientHeight};
    return {n,metric,withStatus,withKeyword,withCondition,ult,heroes,exceptions,heroIssue,kwHeight,stats,layout};
   }''')
   assert result['kwHeight']=='18px',result
   assert result['n']==187,(style,result)
   assert result['heroes']==45,(style,result)
   assert not result['exceptions'] and not result['heroIssue'],(style,result)
   assert result['metric']>=203,result
   assert result['stats']['gold']==['12px','700'],result['stats']
   assert result['stats']['white']==['14px','700'],result['stats']
   assert result['stats']['effect']==['14px','500'],result['stats']
   assert result['stats']['status']==['14px','400'],result['stats']
   assert result['layout']['modalHeight']<=height-11,result['layout']
   assert not errors,(style,errors[:3])
   print('PASS',style,'viewport',width,'x',height,result,'pageerror',len(errors),flush=True)
   page.close()
 b.close()
