
'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const eq=(a,b,message)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(message+': '+JSON.stringify(a)+' ≠ '+JSON.stringify(b))};
let passed=0;
function check(name,fn){try{fn();console.log('PASS',name);passed++}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
const context={window:{GL_DECK_BUILDER_BASE:''}};
vm.createContext(context);
for(const src of ['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js'])vm.runInContext(read(src),context,{filename:src});
const catalog=context.window.GL_S0_CATALOG, data=context.window.GL_DECK_BUILDER_DATA, leg=context.window.GL_S0_LEGALITY;
check('Source card count and Season 0 IDs',()=>{
  eq(catalog.cards.length,218,'Count');eq(data.mainCards.length,163,'Main');eq(data.legacyCards.length,55,'Legacy+Hero');
  if([...data.mainCards,...data.legacyCards].some(c=>!c.id.startsWith('S0-')))throw Error('Non-S0 card included');
  eq(data.starters.length,0,'Retired starter presets');
});
check('15 complete Hero progressions and 24 excluded slots',()=>{
  eq(data.legacyPackages.length,15,'Progressions');eq(catalog.excluded_empty_slots.length,24,'Empty slots');
  for(const p of data.legacyPackages)eq(p.cardIds.length,3,'Rank count');
});
check('Authoritative source corrections',()=>{
  const x=new Map(data.mainCards.map(c=>[c.id,c]));
  eq(x.get('S0-THF-023').name,'Shadow Switch','THF-023 name');eq(x.get('S0-THF-023').cost,'3 Mana','THF-023 cost');
  eq(x.get('S0-ARC-006').name,'Straight Shot','ARC-006 name');eq(x.get('S0-EVT-001').maxCopies,1,'Special Event copy cap');
});
check('Original style assets unchanged by SHA-256',()=>{
  const expected={"css/app.css": "cd684e6bbec46a184b4ab7b6db021cc79843ab56700f566fd3fff54c5512aedd", "style-2/css/app-v1.31.css": "7155ef84df2ff5b951b8a23278ab08e305991be46121d31e1f642f062d77900f"};
  for(const [file,h] of Object.entries(expected))eq(hash(fs.readFileSync(path.join(root,file))),h,'Original CSS '+file);
});
check('Original visual shells and two-way Style switch preserved',()=>{
  const a=read('index.html'),b=read('style-2/index.html');
  if(!a.includes('CHANGE TO STYLE 2')||!b.includes('CHANGE TO STYLE 1'))throw Error('Original two-way link missing');
  for(const html of [a,b]){
   if(!html.includes('app-s0.js')||!html.includes('data-s0.js')||!html.includes('season0-legality.browser.js'))throw Error('S0 runtime assets missing');
   if(html.includes('0/60')||html.includes('/ 60'))throw Error('Old 60-card UI count');
  }
});
check('218 artwork hashes match OSA source catalog',()=>{
  for(const c of catalog.cards){const f=path.join(root,'assets/season0/cards',c.card_id+'.webp');
    if(!fs.existsSync(f)||hash(fs.readFileSync(f))!==c.artwork_sha256)throw Error('Mismatch: '+c.card_id);
  }
});
check('Fall back count 0, current count 218',()=>{
  eq(catalog.cards.filter(c=>c.artwork_origin==='S1_FALLBACK').length,0,'Fallback');
  eq(catalog.cards.filter(c=>c.artwork_origin==='S0_CURRENT').length,218,'Current');
});
check('50/12/12 construction sample and invalid 49-card control',()=>{
  const selected=['S0-ARC-H001','S0-CLE-H001','S0-WAR-H001'];
  const cards=new Map(catalog.cards.map(c=>[c.card_id,c]));
  const pk=selected.map(id=>{const hero=cards.get(id);const heroes=catalog.cards.filter(c=>c.family==='Hero'&&c.progression_id===hero.progression_id).sort((a,b)=>a.rank-b.rank);
    const lc=catalog.cards.find(c=>c.family==='Legacy'&&c.legacy_required_class===hero.base_class);return {hero_rank_ids:heroes.map(h=>h.card_id),legacy_card_id:lc.card_id};});
  const pool=catalog.cards.filter(c=>c.family==='Item').slice(0,17);
  const main=pool.map((c,i)=>({card_id:c.card_id,quantity:i===16?2:3}));
  const draft={main_deck:main,legacy_packages:pk,shard_deck:leg.deriveShardDeck(main,catalog)};
  const v=leg.validateDeck(draft,catalog);
  if(!v.ok)throw Error(v.errors.join('; '));eq(v.summary.main_deck,50,'50 Main');eq(v.summary.legacy_deck,12,'12 Legacy');eq(v.summary.shard_deck,12,'12 Shards');
  main[0].quantity=2;if(leg.validateDeck({...draft,main_deck:main},catalog).ok)throw Error('49 cards incorrectly marked valid');
});
check('Ultimate Class Shard deriving',()=>{
  const x=catalog.cards.find(c=>c.is_ultimate);if(!x)throw Error('No Ultimate source');
  const shards=leg.deriveShardDeck([{card_id:x.card_id,quantity:1}],catalog);
  eq(shards.reduce((s,x)=>s+x.quantity,0),12,'Shard total');
  eq(shards.filter(s=>s.kind==='CLASS').length,1,'Class Shard count');
});
if(process.exitCode)process.exit(1);console.log(`PASS ${passed}/${passed} S0 static/source/legality checks`);
