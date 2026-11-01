const fs=require('fs');const vm=require('vm');const path=require('path');
let root=path.resolve(__dirname,'..');
let global={window:{GL_DECK_BUILDER_BASE:'../'},console}; vm.createContext(global);
for (const file of ['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js','style-2/js/s0-starters-v1.46.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),global,{filename:file});
}
const d=global.window.GL_DECK_BUILDER_DATA;
const cards=new Map(d.mainCards.map(c=>[c.id,c]));
const leg=new Map(d.legacyCards.map(c=>[c.id,c]));
const progress=new Map(d.legacyPackages.map(p=>[p.baseCardId,p]));
const results=[];
d.starters.forEach((s,i)=>{
  let errors=[]; let ccount=0;
  for(const row of s.main_deck){ccount+=row.quantity;if(!cards.has(row.card_id)) errors.push('Missing card '+row.card_id)}
  let packs=s.legacy_deck_package_slots.map(slot=>{
   let prog=progress.get(slot.progression);
   if(!prog)errors.push('Missing progression '+slot.progression);
   if(!leg.has(slot.legacy))errors.push('Missing legacy '+slot.legacy);
   return {hero_rank_ids:prog?.cardIds||[],legacy_card_id:slot.legacy};
  });
  const derived=global.window.GL_S0_LEGALITY.deriveShardDeck(s.main_deck,global.window.GL_S0_CATALOG);
  const out=global.window.GL_S0_LEGALITY.validateDeck({main_deck:s.main_deck,legacy_packages:packs,shard_deck:derived},global.window.GL_S0_CATALOG,{policy:'starter_safe'});
  let center=leg.get(s.default_formation.CENTER)?.image||d.legacyCards.find(c=>c.id===s.default_formation.CENTER)?.image;
  if(!center)errors.push('Missing CENTER Hero artwork');
  if(packs[1].hero_rank_ids[0]!==s.default_formation.CENTER) errors.push('CENTER mismatch');
  if(!out.ok)errors.push(...out.errors);
  results.push({i:i+1,name:s.deck_name,center:s.default_formation.CENTER,main:ccount,shards:derived,valid:out.ok,issues:errors});
});
console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.issues.length))process.exitCode=1;
