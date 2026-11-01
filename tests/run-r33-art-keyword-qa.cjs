'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const src=file=>fs.readFileSync(path.join(root,file),'utf8');
const window={GL_DECK_BUILDER_BASE:''}, ctx=vm.createContext({window});
for(const f of ['js/season0-catalog.js','js/data-s0.js','js/season0-legality.browser.js','js/s0-availability.js','js/s0-effect-filter.js'])vm.runInContext(src(f),ctx,{filename:f});
const cat=window.GL_S0_CATALOG,dat=window.GL_DECK_BUILDER_DATA,snap=JSON.parse(src('data/source-snapshots/main-deck-r3.3-v5.86-print.json'));
const idx=new Map(cat.cards.map(c=>[c.card_id,c])), main=new Map(dat.mainCards.map(c=>[c.id,c])),sidx=new Map(snap.cards.map(c=>[c.cardId,c]));
let count=0;function test(name,fn){fn();count++;console.log('PASS',name)}
test('R3.4 art / R3.3 text: 187 unique Main / 242 total, 155 Skill, 12 Event, 20 Item, 45 Hero, 10 Legacy',()=>{
 assert.equal(idx.size,242);assert.equal(main.size,187);assert.equal(sidx.size,187);
 assert.deepEqual(JSON.parse(JSON.stringify(cat.counts)),{Skill:155,Hero:45,Legacy:10,Event:12,Item:20});
});
test('both artwork sources exactly match Catalog SHA256 and include latest Provoke',()=>{
 for(const c of cat.cards){const f=path.join(root,'assets/season0/cards',c.card_id+'.webp');assert(fs.existsSync(f),f);
  const b=fs.readFileSync(f);assert.equal(b.toString('hex',0,4),'52494646',c.card_id);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),c.artwork_sha256,c.card_id);
 }
 assert.match(idx.get('S0-MAG-028').artwork_ref,/R3\.4/i);
});
test('187 printed metadata records synced to source snapshot',()=>{
 for(const [id,srcCard] of sidx){const c=idx.get(id),d=main.get(id);assert(c&&d,id);assert.equal(d.name,srcCard.name,id);assert.equal(d.cost,srcCard.printedManaCost,id);assert.equal(d.text,srcCard.cardText,id);
  assert.equal(d.classification,srcCard.subtype,id);assert.equal(d.rows.length,srcCard.printedRows.length,id);
  if(srcCard.cardType==='Skill'){
   assert.deepEqual([...d.legalActiveClasses],srcCard.printedRows.map(x=>x.label.replace(/\s+\(Rank [IVX]+\)$/,'')).filter((x,i,arr)=>arr.indexOf(x)===i),id);
  }
 }
});
test('Provoke only Arcane Warrior Rank II is printed (not Warrior Rank I)',()=>{
 const p=idx.get('S0-MAG-028');assert.equal(p.eligible_rows.length,1);
 assert.equal(p.eligible_rows[0].class_name,'Arcane Warrior');assert.equal(p.eligible_rows[0].rank,2);
 assert(!dat.mainCards.find(c=>c.id==='S0-MAG-028').legalActiveClasses.includes('Warrior'));
 assert.match(main.get('S0-MAG-028').text,/MANA BURN 2/);
});
test('MANA BURN and MANA STEAL keyword filters refer to actual cards, including Steal',()=>{
 const burn=['S0-MAG-020','S0-MAG-022','S0-MAG-023','S0-MAG-024','S0-MAG-026','S0-MAG-028'];
 const steal=['S0-MAG-021','S0-THF-005'];
 assert.deepEqual([...main.values()].filter(c=>c.keywords.includes('MANA BURN')).map(c=>c.id),burn);
 assert.deepEqual([...main.values()].filter(c=>c.keywords.includes('MANA STEAL')).map(c=>c.id),steal);
 assert.equal(main.get('S0-THF-005').text,'MANA STEAL 1.');
});
test('Style 1 & Style 2 render dynamic keyword options + filter matches',()=>{
 for(const f of ['js/app-s0.js','style-2/js/app-s0.js']){
  const js=src(f);assert.match(js,/keywordChoices=\[/);assert.match(js,/card\.keywords\|\|\[\]/);assert.match(js,/state\.filters\.keyword/);
 }
 const choices=[...new Set(dat.mainCards.flatMap(c=>c.keywords||[]))];assert(choices.includes('MANA BURN'));assert(choices.includes('MANA STEAL'));
 for(const page of ['index.html','style-2/index.html']){
  assert(src(page).includes('id="keywordFilter"'),page);assert(src(page).includes('v=1.35.0'),page);
 }
});
test('Card effect tags, progressions, copy limits, and starters preserved',()=>{
 assert.equal(dat.starters.length,0);assert.equal(cat.starter_presets,'NONE');assert.equal(dat.legacyPackages.length,15);
 assert.equal(main.get('S0-MAG-031').maxCopies,1);assert.equal(idx.get('S0-MAG-031').is_ultimate,true);
 assert.equal(cat.rulebook,'v2.7.8');assert.equal(dat.builderVersion.startsWith('1.35.0'),true);
 const chosen=dat.legacyPackages.find(x=>x.name==='Bromir Oathforge');assert(chosen);
 assert(window.GL_S0_AVAILABLE_CARDS.available(main.get('S0-MAG-028'),[chosen],cat));
 const other=dat.legacyPackages.find(x=>x.name==='Vaelis Stormweave');assert(!window.GL_S0_AVAILABLE_CARDS.available(main.get('S0-MAG-028'),[other],cat));
});
console.log(`PASS ${count}/${count} R3.4 art + R3.3 printed metadata test suites`);
