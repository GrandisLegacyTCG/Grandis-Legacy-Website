/* Mirrors OSA season0-legality.cjs; deck-construction only. */
'use strict';
/* Player Rulebook v3.2 deck-construction validator for S0 draft decks.
   Separates explicitly codified deck rules from voluntary 'starter_safe' usability policy. */
const build=()=>window.GL_S0_CATALOG;
const classes={WAR:'Warrior',CLE:'Cleric',MAG:'Mage',THF:'Thief',ARC:'Archer'};
// UI labels only; the internal CLASS shard key remains unchanged for existing deck JSON.
const colorName=c=>({Warrior:'Red',Cleric:'White',Mage:'Blue',Thief:'Yellow',Archer:'Green'})[c]||c;
const rankExpected=['I','II','III'];
const norm=s=>String(s||'').trim().toLowerCase();
const getId=x=>typeof x==='string'?x:x?.card_id;
function validateDeck(deck,catalog=build(),options={}){
 const strict=options.policy==='starter_safe';const errors=[],warnings=[];
 const err=m=>errors.push(m), warn=m=>warnings.push(m);
 const all=new Map(catalog.cards.map(c=>[c.card_id,c]));
 const main=deck?.main_deck,packages=deck?.legacy_packages,shards=deck?.shard_deck;
 if(!Array.isArray(main))err('main_deck must be array');
 if(!Array.isArray(packages))err('legacy_packages must be array');
 if(!Array.isArray(shards))err('shard_deck must be array');
 const qmap=new Map();let sum=0;
 for(const entry of Array.isArray(main)?main:[]){const id=getId(entry),qty=typeof entry==='string'?1:Number(entry?.quantity);
  if(!id||!Number.isInteger(qty)||qty<=0){err('Main entry requires card_id and positive integer quantity');continue;}
  qmap.set(id,(qmap.get(id)||0)+qty);sum+=qty;
 }
 if(sum!==50)err(`Main Deck must have exactly 50 cards, got ${sum}`);

 for(const [id,qty] of qmap){const c=all.get(id);
  if(!c){err(`Unknown/unavailable Main Deck card: ${id}`);continue;}
  if(!['Skill','Event','Item'].includes(c.family)){err(`Non-Main card in Main Deck: ${id}`);continue;}
  const cap=c.is_ultimate||c.is_special_event?1:3;
  if(qty>cap)err(`${id} exceeds ${cap}-copy limit (${qty})`);

 }
 const goodPacks=[],usedHeroIds=new Set(),usedProgressions=new Set();
 const pk=Array.isArray(packages)?packages:[];
 if(pk.length!==3)err(`Legacy Deck requires exactly 3 Hero progression packages, got ${pk.length}`);
 for(let k=0;k<pk.length;k++){
  const p=pk[k],arr=p?.hero_rank_ids,legacy=p?.legacy_card_id;
  if(!Array.isArray(arr)||arr.length!==3||!legacy){err(`Legacy package ${k+1} requires three Hero ranks and one Legacy`);continue;}
  const heroes=arr.map(id=>all.get(id));
  if(heroes.some(c=>!c||c.family!=='Hero')){err(`Legacy package ${k+1}: missing/invalid Hero`);continue;}
  for(let i=0;i<3;i++){const h=heroes[i];if(h.rank!==i+1)err(`Package ${k+1}: ${h.card_id} must be Rank ${rankExpected[i]}`);
   if(usedHeroIds.has(h.card_id))err(`Hero used in multiple packages: ${h.card_id}`);usedHeroIds.add(h.card_id);
  }
  const line=heroes[0].progression_id,base=heroes[0].base_class;
  if(heroes.some(h=>h.progression_id!==line||h.base_class!==base))err(`Package ${k+1}: Hero ranks must be same progression/Base Class`);
  if(usedProgressions.has(line))err(`Duplicate progression package: ${line}`);usedProgressions.add(line);
  const lc=all.get(legacy);
  if(!lc||lc.family!=='Legacy')err(`Package ${k+1}: unknown Legacy ${legacy}`);
  else if(norm(lc.legacy_required_class)!==norm(base))err(`Package ${k+1}: Legacy ${legacy} requires ${lc.legacy_required_class}, selected Hero is ${base}`);
  goodPacks.push({line,base,heroes,legacy});
 }
 // Exactly 12 Legacy cards is implied by 3 well-formed 4-card packages; fail if not.
 if(goodPacks.length!==3)err(`Legacy Deck cannot form twelve valid cards from ${goodPacks.length} packages`);
 const shardMap=new Map();let shTotal=0,mana=0;
 for(const s of Array.isArray(shards)?shards:[]){const q=Number(s?.quantity);
  if(!Number.isInteger(q)||q<1){err('Shard quantity must be positive integer');continue;}shTotal+=q;
  const kind=String(s.kind||'').toUpperCase();
  if(kind==='MANA')mana+=q;
  else if(kind==='CLASS'){
   const cl=Object.values(classes).find(x=>norm(x)===norm(s.class_name));if(!cl){err(`Invalid Color Mana Shard Class ${s.class_name}`);continue;}
   shardMap.set(cl,(shardMap.get(cl)||0)+q);
  }else err(`Invalid Shard kind: ${kind}`);
 }
 if(shTotal!==12)err(`Mana Deck must have exactly 12 Mana Shards, got ${shTotal}`);
 // Rulebook v3.2, p.6: a Mana Deck can contain any color, at most
 // one Shard of each color, with Regular Mana Shards filling the other slots.
 // Do not force colors from selected Ultimate Skills or selected Heroes here.
 // Hero-derived colors are the Deck Builder's automatic composition policy.
 for(const [c,q] of shardMap){
  if(q>1)err(`${colorName(c)} Mana Shard exceeds 1`);
 }
 if(mana!==12-[...shardMap.values()].reduce((sum,q)=>sum+q,0))
  err(`Regular Mana Shards do not match the chosen Color Mana Shards`);
 // Usability advisories, not invented Rulebook deck restrictions.
 const chosenHeroes=goodPacks.flatMap(p=>p.heroes);
 const usableBy=h=>{return card=>card.eligible_rows.some(row=>h.rank>=row.rank&&h.accessible_class_path.some(cl=>norm(cl)===norm(row.class_name)));};
 for(const [id,qty] of qmap){const c=all.get(id);if(!c||c.family!=='Skill')continue;
  const candidates=chosenHeroes.filter(h=>usableBy(h)(c));
  if(!candidates.length){const message=`${id} has no eligible Hero user in selected progressions`;if(strict)err(message);else warn(message);}
  if(c.is_ultimate){const required=/^Only\s+([^ ]+)\s+can\s+use\b/i.exec(c.ultimate_restriction||'');
   if(!required){warn(`${id} owner text needs manual verification: ${c.ultimate_restriction}`);continue;}
   const matching=candidates.some(h=>norm(h.name).startsWith(norm(required[1])+' '));
   if(!matching){const message=`${id} requires Ultimate owner ${required[1]} among selected Hero progressions`;
    if(strict)err(message);else warn(message);}
  }
 }
 return {ok:errors.length===0,errors,warnings,summary:{main_deck:sum,legacy_deck:goodPacks.length*4,legacy_packages:pk.length,shard_deck:shTotal,color_classes:[...shardMap.keys()].sort(),hero_color_classes:heroColorClasses(pk,catalog),policy:strict?'starter_safe':'rulebook'}};
}
// Read Rank III lineages for the full Hero progression. Pure Heroes have
// one base lineage; hybrids have two different color lineages. Counting only
// Rank I would omit the hybrid's second Color Mana Shard.
function heroColorClasses(packages,catalog=build()){
 const index=new Map((catalog?.cards||[]).map(card=>[card.card_id,card]));
 const colors=new Set(),known=new Set(Object.values(classes));
 for(const pack of Array.isArray(packages)?packages:[]){
  const heroes=(pack?.hero_rank_ids||[]).map(id=>index.get(id)).filter(card=>card?.family==='Hero');
  const highest=heroes.sort((a,b)=>(b.rank||0)-(a.rank||0))[0];
  if(!highest)continue;
  for(const name of [highest.base_class,...(highest.active_lineages||[])]){
   if(known.has(name))colors.add(name);
  }
 }
 return [...colors].sort();
}
function deriveShardDeck(main,catalog=build(),legacy_packages=[]){
 const heroColors=heroColorClasses(legacy_packages,catalog);
 return [{kind:'MANA',quantity:12-heroColors.length},...heroColors.map(class_name=>({kind:'CLASS',class_name,quantity:1}))];
}
window.GL_S0_LEGALITY={validateDeck,deriveShardDeck,heroColorClasses};
