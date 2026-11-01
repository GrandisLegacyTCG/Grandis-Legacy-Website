'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ctx={window:{GL_DECK_BUILDER_BASE:''}};
vm.createContext(ctx);
for(const p of ['js/season0-catalog.js','js/data-s0.js','js/s0-availability.js','js/season0-legality.browser.js'])
 vm.runInContext(fs.readFileSync(path.join(root,p),'utf8'),ctx,{filename:p});
const {mainCards,legacyPackages}=ctx.window.GL_DECK_BUILDER_DATA;
const cat=ctx.window.GL_S0_CATALOG,available=(id,chosen)=>ctx.window.GL_S0_AVAILABLE_CARDS.available(mainCards.find(x=>x.id===id),chosen,cat);
const progression=name=>legacyPackages.find(p=>p.lineage===name);
let passed=0;
function check(title,fn){fn();passed++;console.log('PASS',title)}
check('Available requires selected Hero; not every Skill is available',()=>{
 assert.equal(available('S0-ARC-001',[]),false);
 assert.equal(available('S0-EVT-001',[]),false);
 assert.equal(available('S0-ARC-001',[progression('Korvak Ironfang')]),true);
 assert.equal(available('S0-MAG-001',[progression('Korvak Ironfang')]),false);
});
check('Two selected classes combine eligible cards without granting off-class',()=>{
 const chosen=[progression('Korvak Ironfang'),progression('Vaelis Stormweave')];
 assert.equal(available('S0-ARC-001',chosen),true);
 assert.equal(available('S0-MAG-001',chosen),true);
 assert.equal(available('S0-THF-001',chosen),false);
});
check('Ultimate requires correct named owner, not only matching Class',()=>{
 assert.equal(available('S0-ARC-018',[progression('Korvak Ironfang')]),true);
 assert.equal(available('S0-ARC-018',[progression('Alden Sterling')]),false);
 assert.equal(available('S0-ARC-025',[progression('Korvak Ironfang')]),false);
 assert.equal(available('S0-ARC-025',[progression('Alden Sterling')]),true);
});
check('Hybrid Class lineages and rank-specific eligible rows are respected',()=>{
 assert.equal(available('S0-THF-001',[progression('Alden Sterling')]),true);
 assert.equal(available('S0-MAG-001',[progression('Lucien Voss')]),true);
 assert.equal(available('S0-CLE-001',[progression('Aurex Sunsworn')]),true);
 assert.equal(available('S0-ARC-010',[progression('Korvak Ironfang')]),true);
 assert.equal(available('S0-ARC-010',[progression('Alden Sterling')]),false);
});
check('Events and neutral Items remain visible for selected Heroes',()=>{
 const chosen=[progression('Garrick Beastfang')];
 assert.equal(available('S0-ITM-001',chosen),true);
 assert.equal(available('S0-EVT-001',chosen),true);
});
check('Style1 and Style2 apply availability to filtering and compatibility',()=>{
 const files=['js/app-s0.js','style-2/js/app-s0.js'];
 for(const f of files){const source=fs.readFileSync(path.join(root,f),'utf8');
  assert.match(source,/function cardAvailable\(/);
  assert.match(source,/state\.filters\.pool==='available'&&!cardAvailable\(card\)/);
  assert.match(source,/function cardCompatible\(card,slots=state.slots\)/); // now blocks off-class in All Cards
  assert.match(source,/if\(!object\.is_valid\|\|countDeck\(\)!==/);
  assert.doesNotMatch(source,/EXPORT ANYWAY/);
 }
});
check('Both style files keep 50-card export and 60-card workspace',()=>{
 const one=fs.readFileSync(path.join(root,'js/app-s0.js'),'utf8');
 const two=fs.readFileSync(path.join(root,'style-2/js/app-s0.js'),'utf8');
 assert.match(one,/countDeck\(\)>=60/);
 assert.match(two,/MAIN_DECK_WORKSPACE_LIMIT=60/);
 assert.match(one,/validationIssues\(\)\.length===0&&countDeck\(\)===50/);
 assert.match(two,/exportButton\.disabled=!valid/);
 assert.match(one,/\$\('mainTotal'\)\.textContent=`\$\{countDeck\(\)\}\/50`/);
 assert.match(two,/MAIN_DECK_LEGAL_LIMIT=50/);
});
check('Source 50-card legality remains independent of 60-card draft workspace',()=>{
 const draft={main_deck:[],legacy_packages:[],shard_deck:[{kind:'MANA',quantity:12}]};
 assert.ok(ctx.window.GL_S0_LEGALITY.validateDeck(draft,cat).errors.some(x=>/exactly 50/.test(x)));
});
if(process.exitCode)process.exit(1);console.log(`PASS ${passed}/${passed} v1.32.3 workspace/availability tests`);
