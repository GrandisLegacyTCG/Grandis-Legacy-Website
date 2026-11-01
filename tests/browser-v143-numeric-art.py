from pathlib import Path
from playwright.sync_api import sync_playwright
import re,json,base64
R=Path(__file__).resolve().parents[1]
STYLES={
 'Style1':{'html':'index.html','css':['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css','css/s0-review-v1.41.css','css/s0-review-v1.42.css'],'app':'js/app-s0.js','base':''},
 'Style2':{'html':'style-2/index.html','css':['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css','style-2/css/s0-style2-quantities-v1.36.css','css/s0-review-v1.41.css','css/s0-review-v1.42.css'],'app':'style-2/js/app-s0.js','base':'../'}
}
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','js/s1-to-s0-import.js','js/s0-availability.js','js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js']
def mount(page,style,updated):
 d=STYLES[style];html=(R/d['html']).read_text();html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I);html=re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>','',html,flags=re.I)
 css=d['css']+(['css/s0-review-v1.43.css'] if updated else [])
 html=html.replace('</head>',''.join('<style>'+ (R/c).read_text() +'</style>' for c in css)+'</head>')
 html=html.replace('</head>',"<script>window.__TEST_STORAGE=Object.create(null);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,removeItem:k=>delete window.__TEST_STORAGE[k]}});</script></head>")
 html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps(d['base'])+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in COMMON+[d['app']])+'</body>')
 page.set_content(html,wait_until='commit')

def stat(page,card):
 page.evaluate('(id)=>openCardReview(id)',card)
 return page.evaluate('''() => ({
   name:document.querySelector('#reviewTitle').textContent,
   ar:document.querySelector('.review-art').getBoundingClientRect().width,
   layout:document.querySelector('.review-layout').getBoundingClientRect().width,
   effect:[...document.querySelectorAll('.review-effect-info p')].map(e=>e.textContent),
   metric:[...document.querySelectorAll('.review-effect-metric')].map(e=>e.textContent.trim()),
   heroLineage:document.querySelectorAll('.review-progression-card').length,
   modalHeight:document.querySelector('.review-card').getBoundingClientRect().height
 })''')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 STYLES['Style1Alias']={**STYLES['Style1'],'html':'style-1/index.html'}
 for style in STYLES:
  for viewport in [(1440,900),(900,900),(390,844)]:
   page=b.new_page(viewport={'width':viewport[0],'height':viewport[1]});errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   mount(page,style,False);before=stat(page,'S0-CLE-031') # Grand Finale lookup check below
   page.close()
   page=b.new_page(viewport={'width':viewport[0],'height':viewport[1]});page.on('pageerror',lambda e:errs.append(str(e)))
   mount(page,style,True)
   new=stat(page,'S0-CLE-031');assert abs(new['ar']/before['ar'] - .75)<.02,(style,viewport,before,new)
   out=page.evaluate('''() => {let summary={fixed:0,issues:[],metricRows:0};
     for(const c of state.cards.filter(c=>c.family==='Skill')){openCardReview(c.id);
       const effects=[...document.querySelectorAll('.review-effect-info p')].map(n=>n.textContent.trim());
       const allMetrics=[...document.querySelectorAll('.review-effect-metric')].map(n=>n.textContent.trim());
       const rows=c.rows||[];
       rows.forEach((row,i)=>{const empty=(!row.effect_text||!row.effect_text.trim()) && /^\\d+$/.test(String(row.damage_text||''));
         if(empty && /^(Physical Attack|Magical Attack)$/.test(c.classification)){
           let expected=`Deal ${row.damage_text} ${c.classification.split(' ')[0]} damage.`;
           if(effects[i]!==expected) summary.issues.push(c.name+': '+JSON.stringify(effects[i])+' expected '+expected);
           else summary.fixed++;
         }
       }); summary.metricRows+=allMetrics.length;
     } return summary;
   }''')
   assert out['fixed']>=25 and not out['issues'],(style,viewport,out)
   # Preserve nonnumeric effects; check exact text for Hammer of Justice (Stun not replaced)
   cards=page.evaluate('''() => ({grand:state.cards.find(c=>c.name==='Grand Finale').id,hammer:state.cards.find(c=>c.name==='Hammer of Justice').id,straight:state.cards.find(c=>c.name==='Straight Shot').id,hero:state.legacyCards.find(c=>c.family==='Hero').id})''')
   grand=stat(page,cards['grand']);hammer=stat(page,cards['hammer']);straight=stat(page,cards['straight']);hero=stat(page,cards['hero']);
   assert grand['effect']==['Deal 80 Magical damage.','Deal 120 Magical damage.'],grand
   assert hammer['effect']==['Inflict Stun for 1 turn.','Inflict Stun for 1 turn.'],hammer
   assert straight['effect'][0].startswith('Deal '),straight
   assert hero['heroLineage']==3,hero
   assert not errs,(style,viewport,errs)
   print('PASS',style,viewport,'art resized',round(before['ar'],1),'→',round(new['ar'],1),'numeric fixes',out['fixed'],'original effects unchanged','hero OK','no page errors',flush=True)
   page.close()
 b.close()
