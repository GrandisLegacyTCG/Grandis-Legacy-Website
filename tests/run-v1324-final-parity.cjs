'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const r=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(r,f),'utf8');
const ctx={window:{GL_DECK_BUILDER_BASE:''}};vm.createContext(ctx);
for(const file of ['js/data-s0.js','js/season0-catalog.js','js/s0-availability.js','js/s0-effect-filter.js','js/season0-legality.browser.js'])vm.runInContext(read(file),ctx,{filename:file});
const data=ctx.window.GL_DECK_BUILDER_DATA,cat=ctx.window.GL_S0_CATALOG,available=ctx.window.GL_S0_AVAILABLE_CARDS.available,effects=ctx.window.GL_S0_EFFECT_FILTER;
const card=id=>data.mainCards.find(c=>c.id===id),p=name=>data.legacyPackages.find(x=>x.lineage===name);
let count=0;function test(name,fn){fn();count++;console.log('PASS',name)}
test('Effects are sourced from card effect text, not keyword field or card title',()=>{
 assert.ok(effects.choices(data.mainCards).includes('Poison'));
 for(const k of ['Poison','Bleed','Swap'])assert.ok(effects.choices(data.mainCards).includes(k));
 assert.ok(effects.tags(card('S0-ITM-011')).includes('Poison'));
 assert.ok(effects.tags(card('S0-ARC-002')).includes('Poison'));
 assert.ok(effects.tags(card('S0-WAR-002')).includes('Bleed'));
 assert.ok(effects.tags(card('S0-ITM-019')).includes('Swap'));
 assert.ok(effects.tags(card('S0-THF-023')).includes('Swap'));
 assert.ok(!effects.tags(card('S0-ARC-013')).includes('Poison'), 'quoted Poison Arrow name must not imply a Poison effect');
 assert.ok(!effects.choices(data.mainCards).some(x=>new Set(data.mainCards.flatMap(c=>c.keywords||[])).has(x)), 'Effect list must exclude all keyword labels');
});
test('Available Cards uses selected Hero lineup, including hybrid and owner-restricted Ultimates',()=>{
 assert.equal(available(card('S0-MAG-001'),[p('Korvak Ironfang')],cat),false);
 assert.equal(available(card('S0-ARC-001'),[p('Korvak Ironfang')],cat),true);
 assert.equal(available(card('S0-MAG-001'),[p('Lucien Voss')],cat),true);
 assert.equal(available(card('S0-ARC-025'),[p('Korvak Ironfang')],cat),false);
 assert.equal(available(card('S0-ARC-025'),[p('Alden Sterling')],cat),true);
});
for(const [style,file,html] of [['Style 1','js/app-s0.js','index.html'],['Style 2','style-2/js/app-s0.js','style-2/index.html']]){
 test(style+' keeps original CSS and has effect dropdown, matching handler',()=>{
  assert.ok(read(html).includes('id="effectFilter"'));
  assert.ok(read(html).includes('js/s0-effect-filter.js'));
  assert.match(read(file),/GL_S0_EFFECT_FILTER\.tags\(card\)/);
  assert.match(read(file),/state\.filters\.effect=event\.target\.value/);
  assert.match(read(file),/effectChoices=window\.GL_S0_EFFECT_FILTER\.choices/);
 });
 test(style+' Hero change confirmation and off-class add prevention now share one predicate',()=>{
  const source=read(file);
  assert.match(source,/function cardCompatible\(card,slots=state\.slots\)\s*\{\s*return cardAvailable\(card,slots\);/);
  assert.match(source,/function lostCompatibilityEntries\(proposedSlots\)/);
  assert.match(source,/remove incompatible cards\?/);
  assert.match(source,/activateAvailablePool/);
  assert.match(source,/!cardCompatible\(card\)/);
  assert.match(source,/policy:'starter_safe'/);
 });
 test(style+' default available when Heroes are selected, 60 draft / 50 export',()=>{
  const source=read(file);
  assert.match(source,/pool=.*'available'|'available':'all'/);
  assert.match(source,/countDeck\(\)[>=!]/);
  assert.match(source,/builder_version:'1\.32\.4'/);
  assert.match(source,/if\(!object\.is_valid\|\|countDeck\(\)!==/);
 });
}
test('Strict builder export rejects a 50-card draft with off-class Skill, while OSA Rulebook remains unchanged',()=>{
 const baseIds=['S0-ARC-H001','S0-CLE-H001','S0-WAR-H001'];
 const records=new Map(cat.cards.map(c=>[c.card_id,c]));
 const packages=baseIds.map(id=>{
   const hero=records.get(id);
   const heroes=cat.cards.filter(c=>c.family==='Hero'&&c.progression_id===hero.progression_id).sort((a,b)=>a.rank-b.rank);
   const legacy=cat.cards.find(c=>c.family==='Legacy'&&c.legacy_required_class===hero.base_class);
   return {hero_rank_ids:heroes.map(h=>h.card_id),legacy_card_id:legacy.card_id};
 });
 const items=cat.cards.filter(c=>c.family==='Item').slice(0,17);
 const main=items.map((c,i)=>({card_id:c.card_id,quantity:i===16?1:3})); // 49 items
 main.push({card_id:'S0-MAG-001',quantity:1});
 const deck={main_deck:main,legacy_packages:packages,shard_deck:[{kind:'MANA',quantity:12}]};
 const rulebook=ctx.window.GL_S0_LEGALITY.validateDeck(deck,cat);
 const starter=ctx.window.GL_S0_LEGALITY.validateDeck(deck,cat,{policy:'starter_safe'});
 assert.equal(rulebook.ok,true,rulebook.errors.join('; '));
 assert.equal(starter.ok,false,'starter-safe must reject inaccessible skill');
 assert.ok(starter.errors.some(x=>x.includes('S0-MAG-001')));
});
test('No changes to authoritative card payload or first-party v1.31 visual themes',()=>{
 const old=path.resolve(r,'../db_v1323_work');
 const crypto=require('node:crypto'),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
 for(const file of ['js/data-s0.js','js/season0-catalog.js','js/s0-availability.js','js/season0-legality.browser.js','css/app.css','style-2/css/app-v1.31.css'])assert.equal(hash(path.join(r,file)),hash(path.join(old,file)),file);
 assert.equal(data.mainCards.length,161);assert.equal(cat.cards.length,204);
});
console.log(`PASS ${count}/${count} v1.32.4 final parity tests`);
