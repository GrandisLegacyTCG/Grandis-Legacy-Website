
/* Season 0 OSA construction-only bridge — same for original Style 1 / Style 2. */
function s0Draft(){
 const main_deck=Object.entries(state.deck).filter(([,quantity])=>quantity>0).map(([card_id,quantity])=>({card_id,quantity}));
 const legacy_packages=state.slots.map(slot=>{
   const p=state.progressionById.get(slot.progressionId);
   return p?{hero_rank_ids:p.cardIds.slice(),legacy_card_id:slot.legacyId||''}:null;
 }).filter(Boolean);
 let shard_deck;
 try{shard_deck=window.GL_S0_LEGALITY.deriveShardDeck(main_deck,window.GL_S0_CATALOG)}
 catch(e){shard_deck=[{kind:'MANA',quantity:12}];}
 return {main_deck,legacy_packages,shard_deck};
}
function s0Validation(){
 const draft=s0Draft(),v=window.GL_S0_LEGALITY.validateDeck(draft,window.GL_S0_CATALOG);
 const ultClasses=new Set(draft.main_deck.filter(row=>window.GL_S0_CATALOG.cards.some(c=>c.card_id===row.card_id&&c.is_ultimate)).map(row=>row.card_id.split('-')[1]));
 if(ultClasses.size>3){v.errors.push('More than 3 Ultimate Class Shards are required');v.ok=false;}
 return v;
}
function s0Export(style){
 const deck=s0Draft(),validation=s0Validation(),name=$('deckName').value.trim()||'New Deck';
 return {schema:'GL-SEASON0-DECK-DRAFT-1',schema_version:'GL-SEASON0-DECK-DRAFT-1',
  source_authority:'R3.3+Provoke-Rank-II',rulebook:'v2.7.8',season:'S0',builder_version:'1.34.0',style,
  exported_at:new Date().toISOString(),name,deck_name:name,
  deck,validation,is_valid:validation.ok,validation_issues:validation.errors,validation_warnings:validation.warnings,
  main_deck:deck.main_deck,shard_deck:deck.shard_deck,
  legacy_packages:deck.legacy_packages,
  legacy_deck_package_slots:state.slots.map(slot=>({progression:slot.progressionId,legacy:slot.legacyId})),
  default_formation:Object.fromEntries(POSITIONS.map((pos,index)=>[pos,state.progressionById.get(state.slots[index].progressionId)?.cardIds[0]||'']))};
}
function s0ImportPayload(data){
 if(!data||typeof data!=='object')throw Error('Invalid deck JSON');
 if(data.season&&data.season!=='S0')throw Error('Only Season 0 deck files are supported');
 const doc=data.deck&&Array.isArray(data.deck.main_deck)?data.deck:data;
 if(!Array.isArray(doc.main_deck))throw Error('Missing main_deck');
 const invalid=doc.main_deck.find(item=>!state.byId.has(item.card_id||item.cardId||item.id));
 if(invalid)throw Error('Unrecognized Season 0 card ID: '+(invalid.card_id||invalid.cardId||invalid.id));
 if(Array.isArray(doc.legacy_packages)){
   const slots=doc.legacy_packages.map(p=>{
     const hero=p.hero_rank_ids?.[0];
     return {progression:hero||'',legacy:p.legacy_card_id||''};
   });
   const ids=slots.map(s=>s.progression);
   if(ids.some(x=>!state.progressionById.has(x)))throw Error('Unknown Season 0 Hero progression in imported deck');
   return {...data,main_deck:doc.main_deck,
     legacy_deck_package_slots:slots,
     deck_name:data.deck_name||data.name||'Imported Season 0 Deck'};
 }
 return data;
}
function s0ValidateImportedPackages(parsed){
 if(parsed.season&&parsed.season!=='S0')throw Error('Cannot import Season 1 deck into the Season 0 builder');
}
