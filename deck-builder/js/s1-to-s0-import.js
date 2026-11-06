/* Grandis Legacy v1.32.2 — opt-in, loss-reporting Season 1 -> Season 0 name migration.
 * No S1 card ID is used as a canonical mapping. IDs only help disambiguate class/type/rank.
 * Never edits the imported object; never applies a partial migration before confirmation.
 */
(function(global){
 'use strict';
 const str=x=>String(x??'').trim();
 const clean=x=>str(x).normalize('NFKC').replace(/[‘’`´]/g,"'").replace(/\s+/g,' ').toLocaleLowerCase('en');
 const codeClass={ARC:'Archer',CLE:'Cleric',MAG:'Mage',THF:'Thief',WAR:'Warrior'};
 const expandedType=x=>/^(hero|legacy|skill|item|event)$/i.test(str(x))?str(x).toLowerCase():'';
 const typeForId=id=>{const s=str(id).split('-');return s[2]?.startsWith('H')?'hero':s[2]?.startsWith('L')?'legacy':s[1]==='ITM'?'item':s[1]==='EVT'?'event':codeClass[s[1]]?'skill':''};
 const quantity=x=>{const n=Number(x??1);return Number.isSafeInteger(n)&&n>0&&n<=10000?n:0};
 function isSeason1(data){
  const doc=data?.deck?.main_deck?data.deck:data;
  const entries=doc?.main_deck||doc?.mainDeck||[];
  return data?.season==='S1'||(typeof data?.format==='string'&&/season\s*1/i.test(data.format))||
   (Array.isArray(entries)&&entries.some(row=>/^S1-/i.test(str(row.card_id||row.cardId||row.id))))||
   (data?.schema_version==='GL-DECK-1.0'&&data?.season!=='S0');
 }
 function migrate(data,source){
  if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid deck JSON object');
  const mainCards=source?.mainCards||[],legacyCards=source?.legacyCards||[],progressions=source?.legacyPackages||[];
  if(!mainCards.length||!legacyCards.length)throw Error('Season 0 catalog unavailable');
  const doc=data.deck&&Array.isArray(data.deck.main_deck)?data.deck:data;
  const main=doc.main_deck||doc.mainDeck;
  if(!Array.isArray(main))throw Error('The source deck has no main_deck array');
  const oldExpanded=Array.isArray(data.legacy_deck_expanded)?data.legacy_deck_expanded:Array.isArray(data.side_deck_expanded)?data.side_deck_expanded:[];
  const sourceSlots=Array.isArray(data.legacy_deck_package_slots)?data.legacy_deck_package_slots:Array.isArray(data.side_deck_package_slots)?data.side_deck_package_slots:[];
  const issues=[],deck=new Map(),summaries={source:0,matched:0,skipped:0,heroMatched:0,legacyMatched:0};
  function failure(kind,name,count,why){issues.push({kind,name:name||'(unnamed)',quantity:count,reason:why});if(kind==='Main')summaries.skipped+=count}
  function lookup(pool,name,family,baseClass,rank){
   const matches=pool.filter(card=>clean(card.name)===clean(name))
    .filter(card=>!family||String(card.family).toLowerCase()===family)
    .filter(card=>!baseClass||clean(card.classGroup)===clean(baseClass))
    .filter(card=>rank==null||Number(card.rank||card.rankNumeric||0)===rank);
   return matches.length===1?{card:matches[0]}:{reason:matches.length===0?'NOT FOUND':'AMBIGUOUS'};
  }
  for(const row of main){
   const n=quantity(row?.quantity??row?.qty??1),name=str(row?.card_name||row?.cardName||row?.name),oldId=str(row?.card_id||row?.cardId||row?.id),family=expandedType(row?.card_type||row?.family)||typeForId(oldId);
   if(!n){failure('Main',name,0,'INVALID QUANTITY');continue}
   summaries.source+=n;
   if(!name){failure('Main',oldId,n,'NAME MISSING');continue}
   if(family&&!['skill','item','event'].includes(family)){failure('Main',name,n,'TYPE INVALID');continue}
   let candidates=mainCards.filter(card=>clean(card.name)===clean(name)&&(!family||card.family.toLowerCase()===family));
   // The class prefix disambiguates duplicate Skill names, not the old numeric card ID.
   if((family==='skill'||!family)&&codeClass[oldId.split('-')[1]])candidates=candidates.filter(card=>clean(card.classGroup)===clean(codeClass[oldId.split('-')[1]]));
   if(candidates.length!==1){failure('Main',name,n,candidates.length?'AMBIGUOUS':'NOT FOUND');continue}
   const card=candidates[0];deck.set(card.id,(deck.get(card.id)||0)+n);summaries.matched+=n;
  }
  const slots=[null,null,null].map(()=>({progression:'',legacy:''}));
  const usedP=new Set(),usedL=new Set();
  const positions=['LEFT','CENTER','RIGHT'];
  sourceSlots.slice(0,3).forEach((slot,index)=>{
   const pos=str(slot.slot||positions[index]).toUpperCase(),idx=positions.indexOf(pos),target=idx<0?index:idx;
   const sourceHeroId=str(slot.progression||slot.progressionId),sourceLegacyId=str(slot.legacy||slot.legacyId);
   const sourceHero=oldExpanded.find(c=>c.card_id===sourceHeroId&&expandedType(c.card_type)==='hero');
   const fallbackHero=oldExpanded.find(c=>expandedType(c.card_type)==='hero'&&(str(c.package_id).startsWith(pos+'-')||str(c.package_name)===str(slot.package_name)));
   const hero=sourceHero||fallbackHero;
   const sourceClass=codeClass[sourceHeroId.split('-')[1]]||'';
   const name=str(hero?.card_name||hero?.cardName||'');
   let heroMatch=[];
   if(name)heroMatch=progressions.filter(p=>clean(p.name||p.lineage)===clean(name)&&(!sourceClass||clean(p.baseClass)===clean(sourceClass)));
   if(heroMatch.length===1&&!usedP.has(heroMatch[0].baseCardId)){
    slots[target].progression=heroMatch[0].baseCardId;usedP.add(heroMatch[0].baseCardId);summaries.heroMatched++;
   }else if(sourceHeroId)failure('Hero',name||sourceHeroId,1,!name?'NAME MISSING':heroMatch.length>1?'AMBIGUOUS':heroMatch.length===1?'DUPLICATE':'NOT FOUND');
   if(sourceLegacyId){
    const oldLegacy=oldExpanded.find(c=>c.card_id===sourceLegacyId&&expandedType(c.card_type)==='legacy')||
      oldExpanded.find(c=>expandedType(c.card_type)==='legacy'&&str(c.package_id).startsWith(pos+'-'));
    const oldName=str(oldLegacy?.card_name||oldLegacy?.cardName);
    const matches=oldName?legacyCards.filter(c=>c.family==='LegacyModeDefinition'&&clean(c.name)===clean(oldName)&&(!sourceClass||clean(c.classGroup)===clean(sourceClass))):[];
    if(matches.length===1&&!usedL.has(matches[0].id)&&slots[target].progression){slots[target].legacy=matches[0].id;usedL.add(matches[0].id);summaries.legacyMatched++}
    else failure('Legacy',oldName||sourceLegacyId,1,!oldName?'NAME MISSING':matches.length>1?'AMBIGUOUS':matches.length===1?'INCOMPATIBLE OR DUPLICATE':'NOT FOUND');
   }
  });
  const rows=[...deck].map(([card_id,quantity])=>({card_id,quantity}));
  const migrated={season:'S0',deck_name:str(data.deck_name||data.deckName||data.name)||'Migrated Season 1 Deck',main_deck:rows,
   legacy_deck_package_slots:slots,default_formation:Object.fromEntries(positions.map((p,i)=>[p,slots[i].progression]))};
  const excess=rows.filter(r=>r.quantity>(mainCards.find(c=>c.id===r.card_id)?.maxCopies||3));
  return {deck:migrated,summary:summaries,issues,copyLimitWarnings:excess.map(r=>`${mainCards.find(c=>c.id===r.card_id)?.name}: ×${r.quantity}`)};
 }
 global.GL_S1_TO_S0_IMPORT={isSeason1,migrate};
})(typeof window==='object'?window:globalThis);
