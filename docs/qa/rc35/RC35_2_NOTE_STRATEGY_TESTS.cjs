'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'../../..');
const ctx={console,URL,Date,Math,Array,JSON,Map,Set,Promise,Uint8Array,TextDecoder,TextEncoder,performance:{now:()=>0},setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>0,clearInterval:()=>{},requestAnimationFrame:()=>0,cancelAnimationFrame:()=>{},crypto:require('crypto').webcrypto};
ctx.window=ctx;ctx.globalThis=ctx;ctx.location={href:'http://example.test/index.html',origin:'http://example.test'};ctx.navigator={userAgent:'RC35.2 Note QA'};ctx.document={readyState:'loading',addEventListener:()=>{},getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],body:null,documentElement:null};vm.createContext(ctx);
const expose=`\nwindow.__NOTE_QA={get state(){return appState;},setState:s=>{appState=s;},initCards,heroState,heroClass,card,firstHealAmountForSource,aiHealMeetsUtilization,aiChooseS0BardDrawIndexes,s0BardDrawOption,resolveS0BardDrawExchange,s0BardDrawDiscardPriority,aiIntermediateHandValue,aiIntermediateTributeScore,aiS5ActivePriest,aiS5ActiveArcher,aiS5CanPlayZol,aiS5NoteComboInHand,aiS5BardNoteDiscardScore,aiS5BardNoteDiscardLimit,chooseAIAction,getLegalActions,executeAIAction,sideHeroes,makeManaShard,drawManaCards};\n})();`;
for(const file of ['engine/js/static-data.js','engine/js/runtime-authority.js','engine/shared-app/active-starters.js','engine/shared-app/app.bundle.js']){
 let src=fs.readFileSync(path.join(root,file),'utf8');
 if(file.endsWith('app.bundle.js')){
  src=src.replace(/function aiTurnDirectorAvailable\(\)\{[^}]*\}/g,'function aiTurnDirectorAvailable(){return false;}');
  src=src.replace('function showResult(){','function showResult(){if(SUPPRESS_RENDER)return;');
  src=src.replace('function showInfo(title, body){','function showInfo(title, body){if(SUPPRESS_RENDER)return;');
  src=src.replace('function showInfoHtml(title, html){','function showInfoHtml(title, html){if(SUPPRESS_RENDER)return;');
  assert(/\n\}\)\(\);\s*$/.test(src));src=src.replace(/\n\}\)\(\);\s*$/,expose);
 }
 vm.runInContext(src,ctx,{timeout:60000,filename:file});
}
ctx.GL_LOCAL_AI_BRIDGE.setRenderSuppressed(true);
const E=ctx.GL_GAME_ENGINE,B=ctx.GL_LOCAL_AI_BRIDGE,Q=ctx.__NOTE_QA;
Q.initCards();
const keys=Object.keys(B.getStarterDeckOptions());
assert(B.setAIDifficulty('intermediate',true).ok);assert(E.selectDeck('AI',keys[4]).ok);
assert(E.startLocalMatch('AI').ok);
const matchTemplate=JSON.parse(JSON.stringify(Q.state));
function starter5(mode='intermediate'){
 const s=JSON.parse(JSON.stringify(matchTemplate));s.preGame=null;s.turn='AI';s.phase='Draw';s.round=4;s.pending=null;s.responseWindow=null;s.gameOver=false;s.aiDifficulty=mode;s.aiHand=[];s.aiDiscard=[];
 s.aiHeroes.LEFT=Q.heroState('S0-CLE-H002','AI','LEFT');s.aiHeroes.CENTER=Q.heroState('S0-CLE-H009','AI','CENTER');s.aiHeroes.RIGHT=Q.heroState('S0-ARC-H002','AI','RIGHT');
 return s;
}
function option(s){return{source_lane:'CENTER',max_count:2};}
function choice(s){return Q.aiChooseS0BardDrawIndexes(s,option(s)).map(i=>s.aiHand[i]);}
function mana(s,count){s.aiManaPoolCards=[];for(let i=0;i<count;i++)s.aiManaPoolCards.push(Q.makeManaShard('GENERIC','','AI','TEST_'+i));s.aiMana=count;}
const results=[];function t(title,fn){try{const details=fn()||{};results.push({title,ok:true,details});console.log('PASS',title);}catch(e){results.push({title,ok:false,error:String(e.stack||e)});console.log('FAIL',title,String(e.stack||e).slice(0,1200));}}

t('Vae x1 Priest alive retained even when Grand Finale in Hand',()=>{const s=starter5();s.aiHand=['S0-CLE-027','S0-CLE-031'];assert(Q.aiS5ActivePriest(s));assert(Q.aiS5NoteComboInHand(s,'S0-CLE-027'));assert(!choice(s).includes('S0-CLE-027'));return{chosen:choice(s)};});
t('Vae x2 Priest alive kept, even when combo needs Vae',()=>{const s=starter5();s.aiHand=['S0-CLE-027','S0-CLE-027','S0-ARC-031'];assert(!choice(s).includes('S0-CLE-027'));return{chosen:choice(s)};});
t('Vae x3 Priest alive may exchange ONLY 1 copy (Maestro 2 slots)',()=>{const s=starter5();s.aiHand=['S0-CLE-027','S0-CLE-027','S0-CLE-027','S0-CLE-031'];assert.equal(choice(s).filter(x=>x==='S0-CLE-027').length,1);return{chosen:choice(s)};});
t('Priest defeated: Vae can be discarded if combo exists',()=>{const s=starter5();s.aiHeroes.LEFT.hp=0;s.aiHand=['S0-CLE-027','S0-CLE-030'];assert(!Q.aiS5ActivePriest(s));assert(choice(s).includes('S0-CLE-027'));return{chosen:choice(s)};});
t('Zol x1 Archer alive and Mana sufficient: keep despite combo',()=>{const s=starter5();mana(s,3);s.aiHand=['S0-ARC-026','S0-ARC-030'];assert(Q.aiS5CanPlayZol(s));assert(!choice(s).includes('S0-ARC-026'));return{chosen:choice(s)};});
t('Zol duplicate: one can be discarded, protect remaining copy',()=>{const s=starter5();mana(s,3);s.aiHand=['S0-ARC-026','S0-ARC-026','S0-ARC-030'];assert.equal(choice(s).filter(x=>x==='S0-ARC-026').length,1);return{chosen:choice(s)};});
t('Zol x1 with 0 Mana + active combo can be discarded',()=>{const s=starter5();mana(s,0);s.aiHand=['S0-ARC-026','S0-ARC-030'];assert(!Q.aiS5CanPlayZol(s));assert(choice(s).includes('S0-ARC-026'));return{chosen:choice(s)};});
t('Zol x1 with 0 Mana but no combo stays in Hand',()=>{const s=starter5();mana(s,0);s.aiHand=['S0-ARC-026'];assert(!choice(s).includes('S0-ARC-026'));return{chosen:choice(s)};});
t('Archer defeated: Zol can become discard combo material',()=>{const s=starter5();mana(s,3);s.aiHeroes.RIGHT.hp=0;s.aiHand=['S0-ARC-026','S0-ARC-030'];assert(!Q.aiS5ActiveArcher(s));assert(choice(s).includes('S0-ARC-026'));return{chosen:choice(s)};});
t('Lun x1 without combo is saved as BLOCK',()=>{const s=starter5();s.aiHand=['S0-CLE-026'];assert(!choice(s).includes('S0-CLE-026'));return{chosen:choice(s)};});
t('Lun x1 with combo in Hand can go to Discard',()=>{const s=starter5();s.aiHand=['S0-CLE-026','S0-CLE-031'];assert(choice(s).includes('S0-CLE-026'));return{chosen:choice(s)};});
t('Lun duplicate can discard one copy, not both',()=>{const s=starter5();s.aiHand=['S0-CLE-026','S0-CLE-026'];assert.equal(choice(s).filter(x=>x==='S0-CLE-026').length,1);return{chosen:choice(s)};});
t('Optional Bard exchange does not dump protected Vae on real resolution',()=>{const s=starter5();s.aiHand=['S0-CLE-027','S0-CLE-027','S0-CLE-026'];const idx=Q.aiChooseS0BardDrawIndexes(s,option(s));assert(!idx.some(i=>s.aiHand[i]==='S0-CLE-027'));return{indices:idx};});
t('Hand Limit: keep 1-2 Vae when Priest alive, discard third preferentially',()=>{const s=starter5();let other='S0-CLE-026';s.aiHand=['S0-CLE-027','S0-CLE-027',other];assert(Q.aiIntermediateHandValue(s,'S0-CLE-027',s.aiHand)>Q.aiIntermediateHandValue(s,other,s.aiHand));s.aiHand.unshift('S0-CLE-027');assert(Q.aiIntermediateHandValue(s,'S0-CLE-027',s.aiHand)<Q.aiIntermediateHandValue(s,other,s.aiHand));return{two:true,third:true};});
t('Tribute: protect the only Vae while Priest alive',()=>{const s=starter5();s.aiHeroes.CENTER.exp_total=300;s.aiHand=['S0-CLE-027'];const score=Q.aiIntermediateTributeScore(s,{type:'TRIBUTE_CARD',card_id:'S0-CLE-027',target_lane:'CENTER',cost:0});assert(score<-9000);return{score};});
t('Intermediate Vae through Priest: printed 20, heal legal at missing 20 even if actual Heal = 40',()=>{const s=starter5();s.aiHeroes.RIGHT.hp=80;s.aiHeroes.RIGHT.maxHp=100;const action={card_id:'S0-CLE-027',source_lane:'LEFT',target_side:'AI',target_lane:'RIGHT'};let printed=Q.firstHealAmountForSource(Q.card('S0-CLE-027'),s.aiHeroes.LEFT);assert.equal(printed,20);assert(Q.aiHealMeetsUtilization(s,action));s.aiHeroes.RIGHT.hp=90;assert(!Q.aiHealMeetsUtilization(s,action),'only 10 missing should preserve Vae');return{printed,missingThreshold:20};});
t('Beginner healing threshold remains old 60% with passive included',()=>{const s=starter5();s.aiDifficulty='beginner';s.aiHeroes.RIGHT.hp=80;s.aiHeroes.RIGHT.maxHp=100;const action={card_id:'S0-CLE-027',source_lane:'LEFT',target_side:'AI',target_lane:'RIGHT'};assert(!Q.aiHealMeetsUtilization(s,action));return{unchanged:true};});
t('A Priest in Intermediate can legally use Vae with 20 missing HP',()=>{const s=starter5();mana(s,5);s.phase='Deploy';s.aiHeroes.RIGHT.hp=s.aiHeroes.RIGHT.maxHp-20;s.aiHand=['S0-CLE-027'];const acts=Q.getLegalActions('AI',s).filter(a=>a.card_id==='S0-CLE-027');assert(acts.length,JSON.stringify({phase:s.phase,legal:Q.getLegalActions('AI',s).slice(0,10)}));assert(acts.some(a=>a.source_lane==='LEFT'&&Q.aiHealMeetsUtilization(s,a)),JSON.stringify(acts));return{legal:acts.length};});
t('Maestro REAL exchange sends Lun to Discard but preserves Vae x2',()=>{
 const s=starter5();s.aiDeck=['S0-WAR-001','S0-ARC-003','S0-CLE-011'];s.aiHand=['S0-CLE-027','S0-CLE-027','S0-CLE-026','S0-CLE-031'];
 const opt=Q.s0BardDrawOption(s,'AI');assert(opt&&opt.max_count===2,'Maestro ability should be available');
 const selected=Q.aiChooseS0BardDrawIndexes(s,opt);assert(selected.some(i=>s.aiHand[i]==='S0-CLE-026'),'Combo should discard Lun');assert(!selected.some(i=>s.aiHand[i]==='S0-CLE-027'),'Vae cannot be discarded with Priest live');
 Q.setState(s);assert(Q.resolveS0BardDrawExchange(s,'AI',opt,selected));
 assert.equal(s.aiHand.filter(id=>id==='S0-CLE-027').length,2);assert(s.aiDiscard.includes('S0-CLE-026'));
 return {discard:s.aiDiscard,vaeKept:s.aiHand.filter(id=>id==='S0-CLE-027').length};
});
t('Priest REAL Vae use from 20 HP missing heals 20 and enters Discard',()=>{
 const s=starter5();mana(s,5);s.phase='Deploy';s.aiHeroes.RIGHT.maxHp=100;s.aiHeroes.RIGHT.hp=80;s.aiHand=['S0-CLE-027'];
 const acts=Q.getLegalActions('AI',s).filter(a=>a.card_id==='S0-CLE-027'&&a.source_lane==='LEFT'&&a.target_lane==='RIGHT');
 assert(acts.length, 'Priest Vae not legal');const chosen=acts[0];assert(Q.aiHealMeetsUtilization(s,chosen));
 Q.setState(s);assert(Q.executeAIAction(s,chosen));assert.equal(s.aiHeroes.RIGHT.hp,100);assert(s.aiDiscard.includes('S0-CLE-027'));assert(!s.aiHand.includes('S0-CLE-027'));return {hp:s.aiHeroes.RIGHT.hp,discard:s.aiDiscard};
});
t('Intermediate selects Priest Vae at 20 missing HP in Deploy with no competing actions',()=>{
 const s=starter5();mana(s,5);s.phase='Deploy';s.aiHeroes.RIGHT.hp=80;s.aiHeroes.RIGHT.maxHp=100;s.aiHand=['S0-CLE-027'];const chosen=Q.chooseAIAction(s,'Deploy');
 assert.equal(chosen.card_id,'S0-CLE-027',JSON.stringify(chosen));assert.equal(chosen.source_lane,'LEFT');return {chosen};
});
t('Beginner Bard discard algorithm code path does not use Intermediate Note gate',()=>{const s=starter5();s.aiDifficulty='beginner';s.aiHand=['S0-CLE-027','S0-CLE-031'];let original=Q.s0BardDrawDiscardPriority(s,'AI','S0-CLE-027',s.aiHand);assert(original>=45);assert(choice(s).includes('S0-CLE-027'));return{beginnerScore:original,chosen:choice(s)};});
const passed=results.filter(x=>x.ok).length;console.log('RESULT',passed+'/'+results.length);const out=path.join(__dirname,'RC35_2_NOTE_STRATEGY_RESULTS.json');fs.writeFileSync(out,JSON.stringify({version:'RC35.2',scope:'Intermediate Starter5 Notes',total:results.length,passed,results},null,2)+'\n');if(passed!==results.length)process.exitCode=1;
