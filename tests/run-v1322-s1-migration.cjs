'use strict';
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const context={window:{GL_DECK_BUILDER_BASE:''}};vm.createContext(context);
for(const filename of ['js/season0-catalog.js','js/data-s0.js','js/s1-to-s0-import.js'])vm.runInContext(read(filename),context,{filename});
const migrate=context.window.GL_S1_TO_S0_IMPORT.migrate,detect=context.window.GL_S1_TO_S0_IMPORT.isSeason1,data=context.window.GL_DECK_BUILDER_DATA;
let checks=0;function check(label,fn){fn();console.log('PASS',label);checks++}
const old=JSON.parse(read('release/history/starter_deck_examples_v1.5_retired/starter_01_elemental_lord_conqueror_saint_GL_DECK_1_0.json'));
check('Detect legacy S1 and never classify S0',()=>{assert.equal(detect(old),true);assert.equal(detect({season:'S0',main_deck:[]}),false)});
check('Real archived 60-card S1 starter migrates by names and preserves unrecognized copies',()=>{
 const original=JSON.stringify(old),r=migrate(old,data);
 assert.equal(r.summary.source,60);assert.equal(r.summary.matched,58);assert.equal(r.summary.skipped,2);
 assert.equal(JSON.stringify(old),original);assert.equal(r.deck.main_deck.reduce((x,c)=>x+c.quantity,0),58);
 assert.deepEqual(Array.from(r.deck.legacy_deck_package_slots.map(s=>s.progression)),['S0-MAG-H001','S0-WAR-H001','S0-CLE-H001']);
 assert.equal(r.summary.legacyMatched,3);
});
check('60-card source with eight total missing copies loads 52, not truncated to 50',()=>{
 const draft=JSON.parse(JSON.stringify(old));
 const pairs=draft.main_deck.filter(c=>c.quantity>=2).slice(0,3);assert.equal(pairs.length,3);
 for(const row of pairs)row.card_name='NO MATCH '+row.card_name;
 const r=migrate(draft,data);assert.equal(r.summary.matched,52); // baseline has 2 original unknown + 6 changed = 52
 assert.equal(r.summary.skipped,8);assert.equal(r.deck.main_deck.reduce((s,x)=>s+x.quantity,0),52);
});
check('Explicit example 60 -> 52 and missing entries are reported',()=>{
 const first=data.mainCards.find(c=>c.family==='Item');
 const rows=Array.from({length:17},(_,i)=>({card_name:'NOT A CARD '+i,card_type:'Item',quantity:i<8?1:0}));
 const draft={season:'S1',main_deck:[{card_name:first.name,card_type:'Item',quantity:52},...rows]};
 const r=migrate(draft,data);assert.equal(r.summary.source,60);assert.equal(r.summary.matched,52);assert.equal(r.summary.skipped,8);
 assert.equal(r.deck.main_deck[0].quantity,52);assert.ok(r.copyLimitWarnings.length>0);
});
check('Name-only main entry is accepted if unambiguous; old names never guessed',()=>{
 const card=data.mainCards.find(c=>c.family==='Item'&&data.mainCards.filter(d=>d.name===c.name).length===1);
 const r=migrate({main_deck:[{card_name:card.name,quantity:2},{card_name:'Shadow Switch Old Name',quantity:1}]},data);
 assert.equal(r.summary.matched,2);assert.equal(r.summary.skipped,1);assert.equal(r.deck.main_deck[0].card_id,card.id);
});
check('Hybrid hero IDs migrate by printed identity/name, not old number',()=>{
 const matching=fs.readdirSync(path.join(root,'release/history/starter_deck_examples_v1.5_retired')).filter(x=>x.includes('arcane_duelist'));
 const deck=JSON.parse(fs.readFileSync(path.join(root,'release/history/starter_deck_examples_v1.5_retired',matching[0]),'utf8'));
 const r=migrate(deck,data);const src=deck.legacy_deck_expanded.filter(x=>x.card_type==='Hero');
 if(src.some(x=>x.card_name==='Lucien Voss'))assert.ok(r.deck.legacy_deck_package_slots.some(x=>x.progression==='S0-THF-H007'));
});
console.log(`PASS ${checks}/${checks} legacy migration checks`);
