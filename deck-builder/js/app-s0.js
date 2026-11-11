'use strict';

const POSITIONS=['LEFT','CENTER','RIGHT'];
const TAB_FAMILY={skills:'Skill',events:'Event',items:'Item'};
const state={
  libraryTab:'heroes',rankView:1,sectionOpen:{legacy:true,main:false},
  cards:[],byId:new Map(),legacyCards:[],legacyById:new Map(),sourcePackages:[],
  progressions:[],progressionById:new Map(),progressionByHeroId:new Map(),starters:[],
  deck:{},slots:[emptySlot(),emptySlot(),emptySlot()],selectedCardId:'',
  // The lower filter row (Mana Cost / Card Pool) is shared across all card types.
  sharedFilters:{pool:'available',manaMin:0,manaMax:9},
  filtersByTab:{
    heroes:{search:'',pool:'all',className:'',skillType:'',attackStyle:'',keyword:'',effect:'',manaMin:0,manaMax:9},
    legacies:{search:'',pool:'all',className:'',skillType:'',attackStyle:'',keyword:'',effect:'',manaMin:0,manaMax:9},
    skills:{search:'',pool:'available',className:'',skillType:'',attackStyle:'',keyword:'',effect:'',manaMin:0,manaMax:9},
    events:{search:'',pool:'available',className:'',skillType:'',attackStyle:'',keyword:'',effect:'',manaMin:0,manaMax:9},
    items:{search:'',pool:'available',className:'',skillType:'',attackStyle:'',keyword:'',effect:'',manaMin:0,manaMax:9}
  },
  dragging:null,initialChoicePending:true
};
Object.defineProperty(state,'filters',{
  get(){return state.filtersByTab[state.libraryTab]},
  set(value){state.filtersByTab[state.libraryTab]=value}
});

const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clone=value=>JSON.parse(JSON.stringify(value));
function emptySlot(){return {progressionId:'',legacyId:''}}
function countDeck(deck=state.deck){return Object.values(deck).reduce((sum,qty)=>sum+Number(qty||0),0)}
function copyLimit(card){return card?.ultimate?.isUltimate||card?.maxCopies===1?1:Number(card?.maxCopies||3)}
function selectedProgressions(slots=state.slots){return slots.map(slot=>state.progressionById.get(slot.progressionId)).filter(Boolean)}
function heroFormationComplete(slots=state.slots){return selectedProgressions(slots).length===3}
function hasSelectedHeroes(slots=state.slots){return selectedProgressions(slots).length>0}
// Count each Hero's Rank I Class only (hybrid progression has one Base Class).
// A team may use three distinct Base Classes, but never three Heroes from one Base Class.
const MAX_HEROES_PER_BASE_CLASS=2;
const BASE_CLASS_LIMIT_MESSAGE='Only 2 Heroes with the same Base Class can be selected.';
function baseClassCounts(slots=state.slots,excludingSlot=-1){
  const counts=new Map();
  slots.forEach((slot,index)=>{
    if(index===excludingSlot)return;
    const baseClass=state.progressionById.get(slot.progressionId)?.baseClass;
    if(baseClass)counts.set(baseClass,(counts.get(baseClass)||0)+1);
  });
  return counts;
}
function baseClassLimitIssue(slots=state.slots){
  const counts=baseClassCounts(slots);
  if([...counts.values()].some(count=>count>MAX_HEROES_PER_BASE_CLASS))return BASE_CLASS_LIMIT_MESSAGE;
  return '';
}
function exceedsBaseClassLimit(slots=state.slots){return Boolean(baseClassLimitIssue(slots));}
function legacyUniqueComplete(slots=state.slots){const ids=slots.map(slot=>slot.legacyId).filter(Boolean);return ids.length===3&&new Set(ids).size===3}
function legacyCardCount(slots=state.slots){return slots.reduce((sum,slot)=>sum+(slot.progressionId?3:0)+(slot.legacyId?1:0),0)}
function isDeckDirty(){return countDeck()>0||state.slots.some(slot=>slot.progressionId||slot.legacyId)||$('deckName').value.trim()!=='New Deck'}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1900)}
function cardById(id){return state.byId.get(id)||state.legacyById.get(id)}
function idSort(a,b){return String(a?.id||'').localeCompare(String(b?.id||''),undefined,{numeric:true})}
// Match Style 2 Deck View order: Skills first, then Events, then Items.
const MAIN_DECK_FAMILY_ORDER={Skill:0,Event:1,Item:2};
function mainDeckSort(a,b){
  const aCard=a?.card||a,bCard=b?.card||b;
  const familyDiff=(MAIN_DECK_FAMILY_ORDER[aCard?.family]??99)-(MAIN_DECK_FAMILY_ORDER[bCard?.family]??99);
  return familyDiff||idSort(aCard,bCard);
}
function defaultLegacyForProgression(progressionId,slots=state.slots){
  const progression=state.progressionById.get(progressionId);if(!progression)return '';
  const used=new Set(slots.map(slot=>slot.legacyId).filter(Boolean));
  const matches=state.legacyCards.filter(card=>card.family==='LegacyModeDefinition'&&card.classGroup===progression.baseClass&&!used.has(card.id)).sort(idSort);
  return matches[0]?.id||'';
}
function manaNumber(card){
  const cost=String(card?.cost||'');
  if(/no mana cost/i.test(cost))return 0;
  const values=[...cost.matchAll(/(\d+)\s*Mana/gi)].map(match=>Number(match[1]));
  return values.length?Math.min(...values):0;
}
function skillType(card){
  const classification=String(card?.classification||'');
  if(/Attack/i.test(classification))return 'Attack';
  if(/Defense/i.test(classification))return 'Defense';
  if(/Tactical/i.test(classification))return 'Tactical';
  if(/Support/i.test(classification))return 'Support';
  return '';
}
function attackStyle(card){
  const classification=String(card?.classification||'');
  for(const value of ['Physical','Magical','Area','Range','Casting'])if(classification.startsWith(value))return value;
  return '';
}
function cardAvailable(card,slots=state.slots){
  return window.GL_S0_AVAILABLE_CARDS.available(card,selectedProgressions(slots),window.GL_S0_CATALOG);
}
// Deck Builder usability policy restores v1.31 behavior; OSA Rulebook authority stays separate.
function cardCompatible(card,slots=state.slots){
  return cardAvailable(card,slots);
}
function incompatibleDeckEntries(slots=state.slots,deck=state.deck){
  return Object.entries(deck).filter(([,qty])=>qty>0).map(([id,quantity])=>({card:state.byId.get(id),quantity})).filter(entry=>!cardCompatible(entry.card,slots)).sort((a,b)=>idSort(a.card,b.card));
}
function lostCompatibilityEntries(proposedSlots){
  return Object.entries(state.deck).filter(([,qty])=>qty>0).map(([id,quantity])=>({card:state.byId.get(id),quantity})).filter(entry=>cardCompatible(entry.card,state.slots)&&!cardCompatible(entry.card,proposedSlots)).sort((a,b)=>idSort(a.card,b.card));
}
function familyCount(family){return Object.entries(state.deck).reduce((sum,[id,qty])=>sum+(state.byId.get(id)?.family===family?Number(qty):0),0)}

function progressionLineageRows(progression){
  const lineage=(progression?.classLineage||[]).filter(Boolean);
  if(lineage.length===4){
    return [`${lineage[0]} • ${lineage[1]}`,lineage[2],lineage[3]];
  }
  return lineage;
}

function buildProgressions(){
  const byBase=new Map();
  for(const source of state.sourcePackages){
    if(byBase.has(source.baseCardId))continue;
    byBase.set(source.baseCardId,{
      id:source.baseCardId,name:state.legacyById.get(source.baseCardId)?.name||source.lineage,
      baseClass:source.baseClass,race:source.race,lineage:source.lineage,
      cardIds:(source.heroIds||source.cardIds.slice(0,3)).slice(0,3),classLineage:(source.classLineage||[]).slice(),coverImage:source.coverImage
    });
  }
  // Melody & Bromir are now available via user-supplied Ultimates; class abilities remain draft.
  // Hide incomplete progressions from BOTH hero selectors, while keeping the source records.
  const owners=new Set(state.cards.filter(card=>card.family==='Skill'&&card.ultimate?.isUltimate)
    .map(card=>/^Only\s+([^ ]+)\s+can\s+use\b/i.exec(String(card.ultimate.owner||''))?.[1]?.toLowerCase())
    .filter(Boolean));
  state.progressions=Array.from(byBase.values()).filter(progression=>
    owners.has(String(progression.name||'').split(/\s+/)[0].toLowerCase())
  ).sort((a,b)=>idSort({id:a.id},{id:b.id}));
  state.progressionById=new Map(state.progressions.map(progression=>[progression.id,progression]));
  state.progressionByHeroId=new Map();
  state.progressions.forEach(progression=>progression.cardIds.forEach(id=>state.progressionByHeroId.set(id,progression)));
}

function resetAllFilterStates(){
  // RESET is the only action that clears saved upper-row filters and shared lower-row choices.
  state.sharedFilters={pool:'available',manaMin:0,manaMax:9};
  for(const tab of ['heroes','legacies','skills','events','items']){
    state.filtersByTab[tab]={search:'',className:'',skillType:'',attackStyle:'',keyword:'',effect:''};
  }
}
function syncPoolChoiceButtons(){
  const select=$('cardPoolSelect');if(!select)return;
  document.querySelectorAll('[data-pool-value]').forEach(button=>{
    const active=button.dataset.poolValue===select.value;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
    button.disabled=select.disabled;
    button.title=select.disabled?'Not available for this card category':'';
  });
}
function bindPoolChoiceButtons(){
  document.querySelectorAll('[data-pool-value]').forEach(button=>button.addEventListener('click',()=>{
    if(button.disabled)return;
    const select=$('cardPoolSelect');select.value=button.dataset.poolValue;
    select.dispatchEvent(new Event('change',{bubbles:true}));
    syncPoolChoiceButtons();
  }));
}
function syncFilterControlsFromState(){
  const filters=state.filters;
  $('searchInput').value=filters.search;
  $('classFilter').value=filters.className;
  filters.skillType=window.GL_S0_SUBTYPE_FILTER.fill($('skillTypeFilter'),TAB_FAMILY[state.libraryTab],filters.skillType);
  $('keywordFilter').value=filters.keyword||'';
  $('effectFilter').value=filters.effect||'';
  $('manaMin').value=String(state.sharedFilters.manaMin);
  $('manaMax').value=String(state.sharedFilters.manaMax);
  $('cardPoolSelect').value=state.sharedFilters.pool;
  updateManaRangeLabel();
  syncPoolChoiceButtons();
}
function syncPoolGate(){
  // Card Pool remains exactly as selected, including with zero Heroes.
  // AVAILABLE lists no playable cards until at least one Hero is selected.
  const select=$('cardPoolSelect');
  select.value=state.sharedFilters.pool;
  select.disabled=false;
  for(const option of select.options)option.disabled=false;
  syncPoolChoiceButtons();
}
function setLibraryTab(tab){
  if(!['heroes','legacies','skills','events','items'].includes(tab))return;
  state.libraryTab=tab;
  syncFilterControlsFromState();
  document.querySelectorAll('.library-tab').forEach(button=>button.classList.toggle('active',button.dataset.libraryTab===tab));
  const legacyContext=tab==='heroes'||tab==='legacies';
  state.sectionOpen.legacy=legacyContext;state.sectionOpen.main=!legacyContext;
  updateSectionState();updateFilterVisibility();$('libraryContent').scrollTop=0;renderLibrary();
}
function updateSectionState(){
  for(const section of ['legacy','main']){
    const root=$(section==='legacy'?'legacyDeckSection':'mainDeckSection');
    const body=root.querySelector('.deck-section-body');
    const button=root.querySelector('.deck-section-head');
    const open=state.sectionOpen[section];
    root.classList.toggle('expanded',open);root.classList.toggle('collapsed',!open);body.hidden=!open;button.setAttribute('aria-expanded',String(open));
    const chevron=root.querySelector('.chevron');if(chevron)chevron.src=open?'assets/ui/chevron-up.png':'assets/ui/chevron-down.png';
  }
}
function toggleSection(section){state.sectionOpen[section]=!state.sectionOpen[section];updateSectionState()}

function updateFilterVisibility(){
  const tab=state.libraryTab,family=TAB_FAMILY[tab]||'';
  state.filters.skillType=window.GL_S0_SUBTYPE_FILTER.fill($('skillTypeFilter'),family,state.filters.skillType);
  $('filterPanel').dataset.category=tab;
  // All four upper and all three lower controls remain in a fixed grid.
  for(const id of ['classField','skillTypeField','keywordField','effectField','manaField','cardPoolField'])$(id).hidden=false;
  $('classField').querySelector('span').textContent='Class';
  $('filterToggle').hidden=false;
  syncPoolGate();
  window.GL_S0_FILTER_RELEVANCE.apply({family,mode:tab,cards:state.cards});
  syncPoolChoiceButtons();
}
function resetFilters(){
  resetAllFilterStates();
  syncFilterControlsFromState();
  syncPoolGate();renderLibrary();
}
function updateManaRangeLabel(){
  let min=Number($('manaMin').value),max=Number($('manaMax').value);
  if(min>max){if(document.activeElement===$('manaMin'))max=min;else min=max;$('manaMin').value=String(min);$('manaMax').value=String(max)}
  state.sharedFilters.manaMin=min;state.sharedFilters.manaMax=max;$('manaRangeValue').textContent=`${min}–${max}`;const track=$('manaRangeTrack');if(track){const minPct=(min/9)*100,maxPct=(max/9)*100;track.style.background=`linear-gradient(to right,#30323d 0 ${minPct}%,#0aa8f6 ${minPct}% ${maxPct}%,#30323d ${maxPct}% 100%)`}
}

function filteredProgressions(){
  const query=state.filters.search.trim().toLowerCase(),className=state.filters.className;
  return state.progressions.filter(progression=>{
    const haystack=[progression.id,progression.name,progression.race,progression.baseClass,progression.lineage,...progression.classLineage].join(' ').toLowerCase();
    return (!query||haystack.includes(query))&&(!className||progression.baseClass===className);
  });
}
function filteredLegacies(){
  const query=state.filters.search.trim().toLowerCase(),className=state.filters.className;
  return state.legacyCards.filter(card=>card.family==='LegacyModeDefinition').filter(card=>{
    const haystack=[card.id,card.name,card.classGroup,card.text].join(' ').toLowerCase();
    return (!query||haystack.includes(query))&&(!className||card.classGroup===className);
  }).sort(idSort);
}
function filteredMainCards(){
  const family=TAB_FAMILY[state.libraryTab];if(!family)return [];
  const query=state.filters.search.trim().toLowerCase(),hasHeroes=hasSelectedHeroes();
  return state.cards.filter(card=>card.family===family).filter(card=>{
    const haystack=[card.id,card.name,card.classification,card.classGroup,card.cost,card.text].join(' ').toLowerCase();
    if(query&&!haystack.includes(query))return false;
    if(state.filters.keyword&&!(card.keywords||[]).includes(state.filters.keyword))return false;
    if(state.filters.effect&&!window.GL_S0_EFFECT_FILTER.tags(card).includes(state.filters.effect))return false;
    if(family==='Skill'&&state.filters.className&&card.classGroup!==state.filters.className)return false;
    if(state.filters.skillType&&!window.GL_S0_SUBTYPE_FILTER.matches(card,state.filters.skillType))return false;
    if(family!=='Item'){const mana=manaNumber(card);if(mana<state.sharedFilters.manaMin||mana>state.sharedFilters.manaMax)return false}
    if(state.sharedFilters.pool==='available'&&!cardAvailable(card))return false;
    return true;
  }).sort(idSort);
}
function renderLibrary(){
  const tab=state.libraryTab;
  $('heroLibrary').hidden=tab!=='heroes';$('cardLibrary').hidden=tab==='heroes';
  if(tab==='heroes')renderHeroLibrary();
  else if(tab==='legacies')renderLegacyLibrary();
  else renderMainLibrary();
}
function renderHeroLibrary(){
  const progressions=filteredProgressions(),selectedIds=new Set(state.slots.map(slot=>slot.progressionId).filter(Boolean)),full=selectedIds.size>=3;
  $('libraryResultCount').textContent=`${progressions.length} of ${state.progressions.length} Hero packages`;
  $('heroLibrary').innerHTML=progressions.map(progression=>{
    const selected=selectedIds.has(progression.id),cards=progression.cardIds.map(cardById);
    const nextSlots=clone(state.slots);
    const blankIndex=nextSlots.findIndex(slot=>!slot.progressionId);
    if(blankIndex>=0)nextSlots[blankIndex].progressionId=progression.id;
    const classIssue=!selected&&blankIndex>=0?baseClassLimitIssue(nextSlots):'';
    const baseBlocked=Boolean(classIssue);
    return `<article class="hero-package ${selected?'selected':baseBlocked?'base-class-blocked':''}" data-hero-package-id="${progression.id}">
      <div class="hero-rank-cards" draggable="true" data-hero-library-drag="${progression.id}" aria-label="Drag ${esc(progression.name)} to a formation slot">${cards.map(card=>`<span class="hero-rank-card"><img src="${card.image}" alt="${esc(card.name)}"></span>`).join('')}</div>
      <div class="hero-package-info"><span class="info-label">HERO NAME</span><h3>${esc(progression.name)}</h3><dl><div><dt>RACIAL</dt><dd>${esc(progression.race)}</dd></div><div><dt>LINEAGES</dt><dd>${progressionLineageRows(progression).map(esc).join('<br>')}</dd></div></dl>
      <button class="hero-select ${selected?'remove':''}" type="button" data-hero-action="${progression.id}" ${!selected&&(full||baseBlocked)?'disabled':''}>${selected?'REMOVE HERO':'SELECT HERO'}</button>${baseBlocked?`<small class="hero-base-class-limit">${esc(classIssue)} Replace an existing Hero to choose this progression.</small>`:''}</div>
    </article>`;
  }).join('');
  document.querySelectorAll('[data-hero-action]').forEach(button=>button.addEventListener('click',()=>toggleHero(button.dataset.heroAction)));
  bindHeroLibraryDragSources();
}
function legacyDraggable(card){
  if(state.slots.some(slot=>slot.legacyId===card.id))return false;
  return state.slots.some(slot=>state.progressionById.get(slot.progressionId)?.baseClass===card.classGroup);
}
function renderLegacyLibrary(){
  const cards=filteredLegacies();$('libraryResultCount').textContent=`${cards.length} of ${state.legacyCards.filter(card=>card.family==='LegacyModeDefinition').length} Legacy cards`;
  $('cardLibrary').innerHTML=cards.map(card=>{
    const draggable=legacyDraggable(card),used=state.slots.some(slot=>slot.legacyId===card.id),unavailable=!draggable&&!used;
    return `<article class="library-card ${draggable?'available':''} ${unavailable?'unavailable':''}" data-legacy-library-id="${card.id}" aria-label="${esc(card.name)}${draggable?' — drag to a matching slot or double-click when only one matching Base Class is selected':''}" ${draggable?`draggable="true" data-drag-type="legacy" data-card-id="${card.id}"`:''}>
      <span class="card-frame"><img src="${card.image}" alt="${esc(card.name)}">${used?'<span class="owned-badge">×1</span>':''}${unavailable?'<span class="lock-dot">●</span>':''}<button class="library-review-button" type="button" draggable="false" data-open-review-id="${card.id}" aria-label="Review ${esc(card.name)}"><img src="assets/ui/expand.png" alt=""></button></span><span class="library-card-name">${esc(card.name)}</span>
    </article>`;
  }).join('');
  bindLibraryDragSources($('cardLibrary'));bindLibraryReviewButtons($('cardLibrary'));
  document.querySelectorAll('[data-legacy-library-id]').forEach(element=>element.addEventListener('dblclick',event=>{
    if(event.target.closest('.library-review-button'))return;
    event.preventDefault();
    const card=state.legacyById.get(element.dataset.legacyLibraryId);
    if(!card||state.slots.some(slot=>slot.legacyId===card.id))return;
    const eligible=state.slots.map((slot,index)=>({slot,index,progression:state.progressionById.get(slot.progressionId)})).filter(entry=>entry.progression?.baseClass===card.classGroup);
    if(eligible.length===1)assignLegacyToSlot(card.id,eligible[0].index);
  }));
}
function renderMainLibrary(){
  const cards=filteredMainCards(),family=TAB_FAMILY[state.libraryTab],total=state.cards.filter(card=>card.family===family).length,hasHeroes=hasSelectedHeroes();
  $('libraryResultCount').textContent=`${cards.length} of ${total} cards`;
  $('cardLibrary').innerHTML=cards.map(card=>{
    const compatible=cardCompatible(card),available=hasHeroes&&compatible,qty=state.deck[card.id]||0;
    return `<article class="library-card ${available?'available':'unavailable'}" data-main-library-id="${card.id}" ${available?`draggable="true" data-drag-type="main-add" data-card-id="${card.id}"`:''} aria-label="${esc(card.name)}${available?' — left click or drag to add, right click to remove':' — unavailable'}">
      <span class="card-frame"><img src="${card.image}" alt="${esc(card.name)}">${qty?`<span class="owned-badge">×${qty}</span>`:''}${!available?'<span class="lock-dot">●</span>':''}<button class="library-review-button" type="button" draggable="false" data-open-review-id="${card.id}" aria-label="Review ${esc(card.name)}"><img src="assets/ui/expand.png" alt=""></button></span><span class="library-card-name">${esc(card.name)}</span>
    </article>`;
  }).join('');
  if(!cards.length&&!hasHeroes&&state.sharedFilters.pool==='available')$('cardLibrary').innerHTML='<p class="s0-available-empty">Select a Hero in the Legacy Deck to view available cards. Or choose ALL CARDS to browse the full library.</p>';
  bindMainLibraryClicks();bindLibraryReviewButtons($('cardLibrary'));
}
function bindMainLibraryClicks(){
  document.querySelectorAll('[data-main-library-id]').forEach(element=>{
    const id=element.dataset.mainLibraryId;
    element.addEventListener('click',event=>{if(event.target.closest('.library-review-button'))return;event.preventDefault();if(element.classList.contains('available'))addMainCard(id)});
    element.addEventListener('contextmenu',event=>{if(event.target.closest('.library-review-button'))return;event.preventDefault();removeMainCard(id)});
    if(element.draggable){
      element.addEventListener('dragstart',event=>{
        if(event.target.closest('.library-review-button')){event.preventDefault();return}
        state.dragging={type:'main-add',id};element.classList.add('dragging');event.dataTransfer.effectAllowed='copy';event.dataTransfer.setData('text/plain',JSON.stringify(state.dragging));hideHover();
      });
      element.addEventListener('dragend',()=>{element.classList.remove('dragging');clearDragState()});
    }
  });
}

function bindLibraryReviewButtons(root){
  root.querySelectorAll('[data-open-review-id]').forEach(button=>{
    button.addEventListener('pointerdown',event=>event.stopPropagation());
    button.addEventListener('dblclick',event=>event.stopPropagation());
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openCardReview(button.dataset.openReviewId)});
  });
}

function bindHeroLibraryDragSources(){
  document.querySelectorAll('[data-hero-library-drag]').forEach(element=>{
    element.addEventListener('dragstart',event=>{
      state.dragging={type:'hero-library',progressionId:element.dataset.heroLibraryDrag};
      element.closest('.hero-package')?.classList.add('dragging');
      event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',JSON.stringify(state.dragging));hideHover();
    });
    element.addEventListener('dragend',()=>{element.closest('.hero-package')?.classList.remove('dragging');clearDragState()});
  });
}
async function placeHeroAtSlot(progressionId,targetIndex){
  const progression=state.progressionById.get(progressionId);if(!progression||targetIndex<0||targetIndex>2)return;
  const previousComplete=hasSelectedHeroes(),existingIndex=state.slots.findIndex(slot=>slot.progressionId===progressionId);
  const proposed=clone(state.slots);
  if(existingIndex>=0){
    if(existingIndex===targetIndex)return;
    [proposed[existingIndex],proposed[targetIndex]]=[proposed[targetIndex],proposed[existingIndex]];
  }else{
    proposed[targetIndex]={progressionId,legacyId:''};
    proposed[targetIndex].legacyId=defaultLegacyForProgression(progressionId,proposed);
  }
  const classIssue=baseClassLimitIssue(proposed);if(classIssue){toast(classIssue);return}
  const removed=lostCompatibilityEntries(proposed);
  if(removed.length){
    const total=removed.reduce((sum,entry)=>sum+entry.quantity,0);
    const ok=await askConfirm({eyebrow:'CHANGE HERO',title:'Change Hero and remove incompatible cards?',message:`This formation change will remove <b>${total}</b> Main Deck card${total===1?'':'s'} that the new Hero lineages cannot use.`,list:removed.map(entry=>({label:entry.card?.name||entry.card?.id||'Unknown card',value:`×${entry.quantity}`})),okLabel:'CHANGE HERO',danger:true});
    if(!ok)return;
    removed.forEach(entry=>{if(entry.card)delete state.deck[entry.card.id]});
  }
  state.slots=proposed;syncPoolGate();renderAll();
}
function bindHeroDropZones(){
  document.querySelectorAll('[data-hero-drop-slot]').forEach(zone=>{
    const targetIndex=Number(zone.dataset.heroDropSlot);
    zone.addEventListener('dragover',event=>{
      const drag=parseDrag(event);if(drag?.type==='hero-library'||drag?.type==='hero-slot'){event.preventDefault();zone.classList.add('drop-ready');event.dataTransfer.dropEffect='move'}
    });
    zone.addEventListener('dragleave',event=>{if(!zone.contains(event.relatedTarget))zone.classList.remove('drop-ready')});
    zone.addEventListener('drop',event=>{
      const drag=parseDrag(event);if(drag?.type==='hero-library'||drag?.type==='hero-slot'){event.preventDefault();placeHeroAtSlot(drag.progressionId,targetIndex)}clearDragState();
    });
  });
  document.querySelectorAll('[data-hero-slot-drag]').forEach(element=>{
    element.addEventListener('dragstart',event=>{
      state.dragging={type:'hero-slot',progressionId:element.dataset.heroSlotDrag,fromIndex:Number(element.dataset.heroSlotIndex)};
      element.closest('.formation-slot')?.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',JSON.stringify(state.dragging));hideHover();
    });
    element.addEventListener('dragend',()=>{element.closest('.formation-slot')?.classList.remove('dragging');clearDragState()});
  });
}

async function toggleHero(progressionId){
  const previousComplete=hasSelectedHeroes();
  const index=state.slots.findIndex(slot=>slot.progressionId===progressionId);
  if(index>=0){
    const proposed=clone(state.slots);proposed.splice(index,1);proposed.push(emptySlot());
    const removed=lostCompatibilityEntries(proposed);
    if(removed.length){
      const total=removed.reduce((sum,entry)=>sum+entry.quantity,0);
      const ok=await askConfirm({eyebrow:'REMOVE HERO',title:'Remove Hero and incompatible cards?',message:`Removing this Hero will also remove <b>${total}</b> Main Deck card${total===1?'':'s'} that the remaining Hero lineages cannot use.`,list:removed.map(entry=>({label:entry.card?.name||entry.card?.id||'Unknown card',value:`×${entry.quantity}`})),okLabel:'REMOVE HERO',danger:true});
      if(!ok)return;
      removed.forEach(entry=>{if(entry.card)delete state.deck[entry.card.id]});
    }
    state.slots=proposed;
  }else{
    const emptyIndex=state.slots.findIndex(slot=>!slot.progressionId);if(emptyIndex<0)return;
    const proposed=clone(state.slots);proposed[emptyIndex].progressionId=progressionId;proposed[emptyIndex].legacyId=defaultLegacyForProgression(progressionId,proposed);
    const classIssue=baseClassLimitIssue(proposed);if(classIssue){toast(classIssue);return}
    state.slots=proposed;
  }
  syncPoolGate();renderAll();
}
function swapSlots(leftIndex,rightIndex){
  if(!state.slots[leftIndex]?.progressionId||!state.slots[rightIndex]?.progressionId)return;
  [state.slots[leftIndex],state.slots[rightIndex]]=[state.slots[rightIndex],state.slots[leftIndex]];renderDeckPanels();renderLibrary();
}
function cycleRank(delta){state.rankView=Math.max(1,Math.min(3,state.rankView+delta));renderLegacyDeck()}
function assignLegacyToSlot(cardId,slotIndex){
  const card=state.legacyById.get(cardId),slot=state.slots[slotIndex],progression=state.progressionById.get(slot?.progressionId);if(!card||!progression)return;
  if(card.classGroup!==progression.baseClass)return;
  if(state.slots.some((candidate,index)=>index!==slotIndex&&candidate.legacyId===cardId))return;
  state.slots[slotIndex].legacyId=cardId;renderDeckPanels();renderLibrary();
}

function positionSwapIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3-3m-3 3 3 3"/></svg>'}
function renderDeckPanels(){renderLegacyDeck();renderMainDeck();updateExportButton()}
function renderLegacyDeck(){
  const selected=selectedProgressions();$('legacyTotal').textContent=`${legacyCardCount()}/12`;$('heroTotalBadge').textContent=String(selected.length*3);$('legacyCountBadge').textContent=String(state.slots.filter(slot=>slot.legacyId).length);$('rankLabel').textContent=`RANK ${['I','II','III'][state.rankView-1]}`;
  const chunks=[];
  state.slots.forEach((slot,index)=>{
    const progression=state.progressionById.get(slot.progressionId),card=progression?cardById(progression.cardIds[state.rankView-1]):null;
    if(index>0)chunks.push(`<button class="position-swap" type="button" data-swap-left="${index-1}" data-swap-right="${index}" ${state.slots[index-1].progressionId&&slot.progressionId?'':'disabled'} title="Swap Position" aria-label="Swap ${POSITIONS[index-1]} and ${POSITIONS[index]}">${positionSwapIcon()}</button>`);
    chunks.push(card?`<article class="formation-slot" data-hero-drop-slot="${index}"><div class="deck-card-visual"><button class="formation-card-button" type="button" draggable="true" data-hero-slot-drag="${progression.id}" data-hero-slot-index="${index}"><img src="${card.image}" alt="${esc(card.name)}"></button><button class="deck-review-button" type="button" data-review-id="${card.id}" aria-label="Review ${esc(card.name)}"><img src="assets/ui/expand.png" alt=""></button></div><div class="formation-position">${POSITIONS[index]}</div></article>`:`<article class="formation-slot empty" data-hero-drop-slot="${index}"><div class="formation-card-placeholder">Drag or select Hero</div><div class="formation-position">${POSITIONS[index]}</div></article>`);
  });
  $('formationGrid').innerHTML=chunks.join('');
  document.querySelectorAll('[data-swap-left]').forEach(button=>button.addEventListener('click',()=>swapSlots(Number(button.dataset.swapLeft),Number(button.dataset.swapRight))));
  bindCardReviewAndHover($('formationGrid'));bindHeroDropZones();
  $('legacySlotsGrid').innerHTML=state.slots.map((slot,index)=>{
    const progression=state.progressionById.get(slot.progressionId),card=state.legacyById.get(slot.legacyId);
    if(!progression)return `<article class="legacy-slot empty" data-legacy-drop-slot="${index}"><div class="legacy-empty-card">Select a Hero first</div><div class="legacy-position-label">${POSITIONS[index]}</div></article>`;
    const choices=state.legacyCards.filter(candidate=>candidate.family==='LegacyModeDefinition'&&candidate.classGroup===progression.baseClass).sort(idSort);
    const options=[`<option value="" disabled ${card?'':'selected'}>Choose Legacy</option>`,...choices.map(candidate=>{const usedElsewhere=state.slots.some((other,otherIndex)=>otherIndex!==index&&other.legacyId===candidate.id);return `<option value="${candidate.id}" ${candidate.id===slot.legacyId?'selected':''} ${usedElsewhere?'disabled':''}>${esc(candidate.name)}</option>`})].join('');
    const visual=card?`<div class="deck-card-visual"><div class="legacy-card-button"><img src="${card.image}" alt="${esc(card.name)}"></div><button class="deck-review-button" type="button" data-review-id="${card.id}" aria-label="Review ${esc(card.name)}"><img src="assets/ui/expand.png" alt=""></button></div>`:`<div class="legacy-card-placeholder">Drag a ${esc(progression.baseClass)} Legacy here</div>`;
    return `<article class="legacy-slot ${card?'':'empty-choice'}" data-legacy-drop-slot="${index}">${visual}<label class="legacy-select-wrap"><select class="legacy-slot-select" data-legacy-select-slot="${index}" aria-label="Choose ${esc(progression.baseClass)} Legacy">${options}</select></label><div class="legacy-position-label">${POSITIONS[index]}</div></article>`;
  }).join('');
  document.querySelectorAll('[data-legacy-select-slot]').forEach(select=>select.addEventListener('change',()=>{const id=select.value;if(id)assignLegacyToSlot(id,Number(select.dataset.legacySelectSlot))}));
  bindCardReviewAndHover($('legacySlotsGrid'));bindLegacyDropZones();
}

function mainDeckViewCardHtml(card,quantity){return `<article class="legacy-reference-card-tile" title="${esc(card.name)}"><img src="${card.image}" alt="${esc(card.name)}"><span class="quantity-badge main-deck-view-quantity">×${quantity}</span><button class="review-button" type="button" data-review-id="${esc(card.id)}" aria-label="Preview ${esc(card.name)}"><img src="assets/ui/expand.png" alt=""></button></article>`}
function renderMainDeckView(){
  const grid=$('mainDeckViewGrid');if(!grid)return;
  const entries=Object.entries(state.deck).filter(([,qty])=>Number(qty)>0).map(([id,quantity])=>({card:state.byId.get(id),quantity:Number(quantity)})).filter(x=>x.card).sort(mainDeckSort);
  const report=s0Validation(),valid=report.ok;
  $('mainDeckViewCount').textContent=String(countDeck());
  $('mainDeckViewValidation').textContent=valid?'Deck Valid':'Deck Invalid';
  $('mainDeckViewValidation').classList.toggle('valid',valid);$('mainDeckViewValidation').classList.toggle('invalid',!valid);
  window.GL_S0_VALIDATION_TIP?.setBadge($('mainDeckViewValidation'),report);
  grid.innerHTML=entries.map(({card,quantity})=>mainDeckViewCardHtml(card,quantity)).join('');
  $('mainDeckViewEmpty').hidden=entries.length>0;
  grid.querySelectorAll('[data-review-id]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();openCardReview(button.dataset.reviewId)}));
}
function openMainDeckView(){renderMainDeckView();if(!$('mainDeckViewDialog').open)$('mainDeckViewDialog').showModal()}

function renderMainDeck(){
  const entries=Object.entries(state.deck).filter(([,qty])=>qty>0).map(([id,quantity])=>({card:state.byId.get(id),quantity})).filter(entry=>entry.card).sort((a,b)=>idSort(a.card,b.card));
  $('mainTotal').textContent=`${countDeck()}/50`;$('skillCount').textContent=familyCount('Skill');$('eventCount').textContent=familyCount('Event');$('itemCount').textContent=familyCount('Item');
  $('skillGroupCount').textContent=String(familyCount('Skill'));$('eventGroupCount').textContent=String(familyCount('Event'));$('itemGroupCount').textContent=String(familyCount('Item'));
  const report=s0Validation(),issues=report.errors,status=$('deckStatus');
  status.textContent=report.ok?'Deck Valid':(countDeck()<50?'Incomplete':'Deck Invalid');
  status.classList.toggle('valid',report.ok);status.classList.toggle('invalid',!report.ok);
  window.GL_S0_VALIDATION_TIP?.setBadge(status,report);
  if(report.ok)status.title='Season 0 - Mana Deck: '+s0Draft().shard_deck.map(x=>x.quantity+' x '+(x.kind==='MANA'?'Regular Mana Shard':(({Archer:'Green',Cleric:'White',Mage:'Blue',Thief:'Yellow',Warrior:'Red'})[x.class_name]||x.class_name)+' Mana Shard')).join(', ');
  const rowHtml=({card,quantity})=>{const ultimate=Boolean(card.ultimate?.isUltimate),meta=ultimate?`<span class="main-ultimate-label">Ultimate Skill Card</span>${compactManaCost(card)?` • ${esc(compactManaCost(card))}`:''}`:`${esc(card.classification)}${card.cost&&card.cost!=='No Mana cost'?` • ${esc(card.cost)}`:''}`;return `<article class="main-deck-row ${ultimate?'ultimate-card-row':''}" draggable="true" data-main-deck-id="${card.id}" data-drag-type="deck-remove" data-review-id="${card.id}" data-hover-card-id="${card.id}">
    <img src="${card.image}" alt="${esc(card.name)}">
    <div class="main-card-info"><strong>${esc(card.name)}</strong><small>${meta}</small></div>
    <button class="qty-control" type="button" data-remove-main="${card.id}" aria-label="Remove one ${esc(card.name)}">−</button><span class="main-qty">${quantity}</span><button class="qty-control" type="button" data-add-main="${card.id}" ${quantity>=copyLimit(card)||countDeck()>=60?'disabled':''} aria-label="Add one ${esc(card.name)}">+</button>
  </article>`};
  for(const family of ['Skill','Event','Item']){
    const familyEntries=entries.filter(entry=>entry.card.family===family),prefix=family.toLowerCase();
    $(`${prefix}DeckList`).innerHTML=familyEntries.map(rowHtml).join('');
    $(`${prefix}EmptyState`).hidden=familyEntries.length>0;
  }
  $('mainEmptyState').hidden=entries.length>0;
  bindCardReviewAndHover($('mainDeckDropZone'));
  document.querySelectorAll('[data-add-main]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();addMainCard(button.dataset.addMain)}));
  document.querySelectorAll('[data-remove-main]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();removeMainCard(button.dataset.removeMain)}));
  bindDeckRemoveDragSources();
  s0Persist();
}
function renderAll(){renderDeckPanels();renderLibrary()}

function addMainCard(id){
  const card=state.byId.get(id);if(!card||!hasSelectedHeroes()||!cardCompatible(card))return;
  const quantity=state.deck[id]||0;if(quantity>=copyLimit(card)||countDeck()>=60)return;
  state.deck[id]=quantity+1;renderMainDeck();renderLibrary();updateExportButton();
}
function removeMainCard(id){
  const quantity=state.deck[id]||0;if(!quantity)return;
  if(quantity===1)delete state.deck[id];else state.deck[id]=quantity-1;
  renderMainDeck();renderLibrary();updateExportButton();
}

function bindLibraryDragSources(root){
  root.querySelectorAll('[draggable="true"][data-drag-type="legacy"]').forEach(element=>{
    element.addEventListener('dragstart',event=>{
      state.dragging={type:'legacy',id:element.dataset.cardId};element.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',JSON.stringify(state.dragging));hideHover();
    });
    element.addEventListener('dragend',()=>{element.classList.remove('dragging');clearDragState()});
  });
}
function bindDeckRemoveDragSources(){
  document.querySelectorAll('[data-main-deck-id]').forEach(row=>{
    row.addEventListener('dragstart',event=>{
      if(event.target.closest('button')){event.preventDefault();return}
      state.dragging={type:'deck-remove',id:row.dataset.mainDeckId};row.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',JSON.stringify(state.dragging));$('removeDropOverlay').hidden=false;$('libraryContent').classList.add('drag-remove-active');hideHover();
    });
    row.addEventListener('dragend',()=>{row.classList.remove('dragging');clearDragState()});
  });
}
function clearDragState(){
  state.dragging=null;$('removeDropOverlay').hidden=true;$('libraryContent').classList.remove('drag-remove-active');
  document.querySelectorAll('.legacy-slot,.formation-slot,.main-deck-row,.hero-package,.library-card,.main-deck-groups').forEach(element=>element.classList.remove('drop-ready','dragging'));
}
function parseDrag(event){
  if(state.dragging)return state.dragging;
  try{return JSON.parse(event.dataTransfer.getData('text/plain'))}catch{return null}
}
function bindGlobalDropZones(){
  const removeZone=$('libraryContent'),mainDropZone=$('mainDeckDropZone');
  removeZone.addEventListener('dragover',event=>{const drag=parseDrag(event);if(drag?.type==='deck-remove'){event.preventDefault();event.dataTransfer.dropEffect='move'}});
  removeZone.addEventListener('drop',event=>{const drag=parseDrag(event);if(drag?.type==='deck-remove'){event.preventDefault();removeMainCard(drag.id)}clearDragState()});
  mainDropZone.addEventListener('dragover',event=>{const drag=parseDrag(event);if(drag?.type==='main-add'){event.preventDefault();mainDropZone.classList.add('drop-ready');event.dataTransfer.dropEffect='copy'}});
  mainDropZone.addEventListener('dragleave',event=>{if(!mainDropZone.contains(event.relatedTarget))mainDropZone.classList.remove('drop-ready')});
  mainDropZone.addEventListener('drop',event=>{const drag=parseDrag(event);if(drag?.type==='main-add'){event.preventDefault();addMainCard(drag.id)}clearDragState()});
}
function bindLegacyDropZones(){
  document.querySelectorAll('[data-legacy-drop-slot]').forEach(zone=>{
    zone.addEventListener('dragover',event=>{
      const drag=parseDrag(event),card=state.legacyById.get(drag?.id),slotIndex=Number(zone.dataset.legacyDropSlot),progression=state.progressionById.get(state.slots[slotIndex]?.progressionId);
      if(drag?.type==='legacy'&&card&&progression&&card.classGroup===progression.baseClass&&!state.slots.some((slot,index)=>index!==slotIndex&&slot.legacyId===card.id)){event.preventDefault();zone.classList.add('drop-ready');event.dataTransfer.dropEffect='move'}
    });
    zone.addEventListener('dragleave',()=>zone.classList.remove('drop-ready'));
    zone.addEventListener('drop',event=>{const drag=parseDrag(event);if(drag?.type==='legacy'){event.preventDefault();assignLegacyToSlot(drag.id,Number(zone.dataset.legacyDropSlot))}clearDragState()});
  });
}

function bindCardReviewAndHover(root){
  root.querySelectorAll('[data-review-id]').forEach(element=>{
    element.addEventListener('click',event=>{if(event.target.closest('[data-hero-action],.qty-control'))return;event.stopPropagation();openCardReview(element.dataset.reviewId)});
  });
  root.querySelectorAll('[data-hover-card-id]').forEach(element=>{
    element.addEventListener('mouseenter',()=>showHover(element.dataset.hoverCardId,element));
    element.addEventListener('mouseleave',hideHover);
  });
}
function showHover(cardId,anchor){
  if(window.innerWidth<=760||state.dragging||document.querySelector('dialog[open]'))return;
  const card=cardById(cardId),box=$('hoverCardZoom'),image=$('hoverCardZoomImage');if(!card||!anchor)return;
  image.src=card.image;image.alt=`${card.name} preview`;box.hidden=false;box.classList.add('is-visible');box.setAttribute('aria-hidden','false');
  const rect=anchor.getBoundingClientRect(),previewRect=box.getBoundingClientRect(),width=previewRect.width||250,height=previewRect.height||350;
  // Preserve the original per-row vertical placement; only shift the horizontal anchor.
  // The preview's center X aligns to the hovered row's left edge.
  let x=rect.left-(width/2),y=rect.top-height-10;
  x=Math.max(8,Math.min(x,window.innerWidth-width-8));y=Math.max(8,Math.min(y,window.innerHeight-height-8));
  box.style.transform=`translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
}
function hideHover(){const box=$('hoverCardZoom');box.classList.remove('is-visible');box.hidden=true;box.style.transform='translate3d(-9999px,-9999px,0)';box.setAttribute('aria-hidden','true')}

function reviewEyebrow(card){
  if(card.family==='Hero')return 'HERO NAME';
  if(card.family==='Skill')return 'SKILL NAME';
  if(card.family==='Event')return 'EVENT NAME';
  if(card.family==='Item')return 'ITEM NAME';
  if(card.family==='LegacyModeDefinition')return 'LEGACY NAME';
  return 'CARD NAME';
}
function reviewType(card){return card.family==='LegacyModeDefinition'?'Legacy Card':card.family==='Skill'?card.classification:card.family}
function reviewCost(card){return card.cost&&card.cost!=='No Mana cost'?card.cost:'—'}
function reviewManaValue(card){
  const cost=String(card?.cost||'').trim();
  if(!cost||cost==='No Mana cost')return '-';
  if(cost.includes(':'))return cost.replace(/\s*[·•]\s*/g,' • ');
  const simple=cost.match(/^(\d+)\s*Mana$/i);
  return simple?simple[1]:cost;
}
function compactManaCost(card){
  const matches=String(card?.cost||'').match(/(\d+)\s*Mana/gi)||[];
  const values=matches.map(value=>Number(value.match(/\d+/)?.[0])).filter(Number.isFinite);
  return values.length?`${Math.min(...values)} Mana Cost`:'';
}
function labeledRowName(label='',prefix=''){
  const clean=String(label).replace(new RegExp(`^${prefix}\\s*[—-]?\\s*`,'i'),'').trim();
  return clean||prefix;
}
function romanRank(value){return ({1:'I',2:'II',3:'III'})[Number(value||1)]||String(value||'-')}
function rankUpBonusText(rank){
  const value=Number(rank||1);
  if(value===2)return 'After Rank Up, return 2 EXP cards to your hand and gain +1 Mana Regen.';
  if(value===3)return 'After Rank Up, return 3 EXP cards to your hand and gain +1 Mana Regen.';
  return '';
}
function heroExpValue(rank){return ({1:'—',2:'300',3:'700'})[Number(rank||1)]||'—'}
function rowClassRank(label=''){
  const match=String(label).match(/^(.+?)\s*\((Rank\s+[IVX]+)\)\s*$/i);
  return match?{className:match[1].trim(),rank:match[2].replace(/^rank/i,'Rank')}:{className:String(label).replace(/\s*[—-].*$/,'').trim(),rank:'-'};
}
function metricDamageType(card,row={},label=''){
  if(!['DAMAGE','BLOCK'].includes(label))return '';
  const primary=label==='DAMAGE'
    ? String(row.damage_text||row.text||card.classification||'')
    : String(row.effect_text||row.text||row.damage_text||'');
  const hasPhysical=/\bPhysical\b/i.test(primary);
  const hasMagical=/\bMagical\b/i.test(primary);
  if(hasPhysical&&hasMagical)return 'Physical / Magical';
  if(hasPhysical)return 'Physical';
  if(hasMagical)return 'Magical';
  return '';
}
function effectMetric(card,row={}){
  // The R3.4 artwork's right-hand numeric field is represented by damage_text.
  // A bare numeric field is NOT interchangeable with numbers embedded inside effect prose.
  const number=String(row.damage_text||'').trim();
  if(!/^[+\-]?\d+$/.test(number))return null;
  const value=String(Math.abs(Number(number)));
  const kind=String(card.classification||'');
  const source=[row.effect_text,row.text,card.text].filter(Boolean).join(' ');
  let label='';
  if(/^(?:Physical Attack|Magical Attack|Area Attack|Casting Attack)$/i.test(kind)){
   if(/^Physical Attack$/i.test(kind))label='PHYSICAL DAMAGE';
   else if(/^Magical Attack$/i.test(kind))label='MAGICAL DAMAGE';
   else if(/\bPhysical\s+damage\b/i.test(source))label='PHYSICAL DAMAGE';
   else if(/\bMagical\s+damage\b/i.test(source))label='MAGICAL DAMAGE';
   else if(/\bPhysical\b/i.test(source)&&!/\bMagical\b/i.test(source))label='PHYSICAL DAMAGE';
   else if(/\bMagical\b/i.test(source)&&!/\bPhysical\b/i.test(source))label='MAGICAL DAMAGE';
   // Do not invent a damage type for ambiguous Area/Casting cards.
  }else if(/^Defense$/i.test(kind)&&/\bBLOCK\b/i.test(source))label='DAMAGE REDUCTION';
  else if(/^Support$/i.test(kind)&&/\bHEAL\b/i.test(source))label='HEALING DONE';
  if(!label)return null;
  return {label,value};
}
function skillEffectText(row={},metric=null){
  let effect=String(row.effect_text||row.text||'').trim();
  if(!metric)return effect||String(row.damage_text||'—').trim()||'-';
  // Numeric-only Attack rows have no printed effect text beyond the damage number.
  // Expand their REVIEW ONLY into a readable action while preserving the numeric metric.
  // Do not infer damage type for Area/Casting or rewrite any nonnumeric card effects.
  if(/^\s*[+-]?\d+\s*$/.test(effect) && /^(?:PHYSICAL|MAGICAL) DAMAGE$/.test(metric.label)){
    return `Deal ${metric.value} ${metric.label==='PHYSICAL DAMAGE'?'Physical':'Magical'} damage.`;
  }
  if(/DAMAGE$/.test(metric.label)&&metric.label!=='DAMAGE REDUCTION')effect=effect.replace(/^(?:Deal|Inflict)\s+[+-]?\d+[^.]*?damage\.\s*/i,'').trim();
  else if(metric.label==='DAMAGE REDUCTION')effect=effect.replace(/^Block\s+[+-]?\d+[^.]*?damage[^.]*\.\s*/i,'').trim();
  else if(metric.label==='HEALING DONE')effect=effect.replace(/^(?:Heal|Restore)[^.]*?[+-]?\d+[^.]*\.\s*/i,'').trim();
  return effect||'—';
}
function itemClassText(card){if(card.printedClassRequirement)return card.printedClassRequirement;
  const classes=Array.isArray(card.requiredBaseClasses)?card.requiredBaseClasses.filter(Boolean):[];
  return classes.length?classes.join(' • '):'All Classes';
}
function heroReviewHtml(card){
  const rows=card.rows||[];
  const racialRow=rows.find(row=>/^Racial Trait/i.test(row.label||''));
  const dualRow=rows.find(row=>/^Dual Class/i.test(row.label||''));
  const abilityRow=rows.find(row=>/^Class Ability/i.test(row.label||''));
  const racialName=labeledRowName(racialRow?.label||'Racial Trait','Racial Trait');
  const abilityName=abilityRow?labeledRowName(abilityRow.label,'Class Ability'):'';
  const rank=Number(card.rank||card.rankNumeric||1);
  $('reviewStats').innerHTML=`<div class="review-summary hero-summary">
    <div class="review-summary-item"><span>CARD TYPE</span><strong>HERO</strong></div>
    <div class="review-summary-item"><span>HP</span><strong>${esc(card.hp??'—')}</strong></div>
    <div class="review-summary-item"><span>REQUIRED EXP</span><strong>${esc(heroExpValue(rank))}</strong></div>
  </div>`;
  const detailBlocks=[];
  // Render the Dual Class note above Racial Traits, independently of Class.
  // Other Hero Review sections keep their existing layout and typography.
  if(dualRow)detailBlocks.push(`<div class="review-hero-dual-section"><span>DUAL CLASS</span><p>${esc(dualRow.text||'—')}</p></div>`);
  detailBlocks.push(`<div class="review-hero-block hero-racial-section">
    <div class="review-hero-group"><span>RACE</span><strong>${esc(card.race||'—')}</strong></div>
    <div class="review-hero-group"><span>RACIAL TRAITS</span><strong>${esc(racialName)}</strong><p>${esc(racialRow?.text||card.text||'—')}</p></div>
  </div>`);
  detailBlocks.push(`<div class="review-hero-block hero-class-section">
    <div class="review-hero-class-summary">
      <div class="review-hero-group"><span>CLASS</span><strong>${esc(card.classGroup||'—')}</strong></div>
      <div class="review-hero-group"><span>RANK</span><strong>Rank ${esc(romanRank(rank))}</strong></div>
    </div>
    ${abilityRow?`<div class="review-hero-group"><span>CLASS ABILITY</span><strong>${esc(abilityName)}</strong><p>${esc(abilityRow.text||'—')}</p></div>`:''}
  </div>`);
  const bonus=rankUpBonusText(rank);
  if(bonus)detailBlocks.push(`<div class="review-generic-row rank-up-review"><span>BONUS</span><p>${esc(bonus)}</p></div>`);
  $('reviewRows').innerHTML=detailBlocks.join('');
}
function standardReviewHtml(card){
  // Presentation-only metadata; preserve printed card type/subtype and all gameplay data.
  const stats=[];
  if(card.family==='Skill')stats.push(
    ['CARD TYPE',card.ultimate?.isUltimate?'ULTIMATE':'SKILL'],
    ['SUBTYPE',reviewType(card)],
    ['MANA COST',reviewManaValue(card)],
    ['EXP TRIBUTE',card.ultimate?.isUltimate?'200 EXP':'100 EXP']
  );
  else if(card.family==='LegacyModeDefinition')stats.push(['CARD TYPE','LEGACY'],['CLASS',card.classGroup||'—']);
  else stats.push(['CARD TYPE',String(card.family||'CARD').toUpperCase()],['SUBTYPE',card.classification||reviewType(card)],['MANA COST',reviewCost(card)]);
  $('reviewStats').innerHTML=`<div class="review-summary ${stats.length===4?'four-column-summary':''}">
    ${stats.map(([label,value])=>`<div class="review-summary-item"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}
  </div>`;
  const rows=card.rows?.length?card.rows:[{label:'Effect',text:card.text}];
  if(card.family==='Skill'){
    const isUltimate=Boolean(card.ultimate?.isUltimate);
    const effectRows=rows.map((row,index)=>{
      const parsed=rowClassRank(row.label);
      const metric=effectMetric(card,row);
      const rankText=isUltimate&&/Rank\s+III/i.test(parsed.rank)&&index===rows.length-1?`Ultimate ${parsed.rank}`:parsed.rank;
      const effectText=skillEffectText(row,metric);
      const rankClass=isUltimate&&/^Ultimate\s+Rank\s+III$/i.test(rankText)?' class="ultimate-rank"':'';
      if(metric){
        return `<div class="review-effect-row has-metric"><div class="review-effect-class"><span>CLASS</span><strong>${esc(parsed.className||card.classGroup||'—')}</strong></div><div class="review-effect-rank"><span>RANK</span><strong${rankClass}>${esc(rankText)}</strong></div><div class="review-effect-metric"><span>${esc(metric.label)}</span><strong>${esc(metric.value)}</strong>${metric.damageType?`<small class="review-metric-type">${esc(metric.damageType)}</small>`:''}</div><div class="review-effect-info"><span>SKILL EFFECT</span><p>${esc(effectText)}</p></div></div>`;
      }
      return `<div class="review-effect-row no-metric"><div class="review-effect-class"><span>CLASS</span><strong>${esc(parsed.className||card.classGroup||'—')}</strong></div><div class="review-effect-rank"><span>RANK</span><strong${rankClass}>${esc(rankText)}</strong></div><div class="review-effect-info full-span"><span>SKILL EFFECT</span><p>${esc(effectText)}</p></div></div>`;
    }).join('');
    const rules=isUltimate&&card.ultimate?.owner?`<div class="review-ultimate-rules"><span>ULTIMATE RULES</span><p>${esc(/\bcan use this card\b/i.test(String(card.ultimate.owner))?card.ultimate.owner:`Only ${card.ultimate.owner} can use this card or Tribute it for EXP.`)}</p></div>`:'';
    $('reviewRows').innerHTML=effectRows+rules;
  }else if(card.family==='Item'){
    const effect=rows.map(row=>row.effect_text||row.text||row.damage_text||'').filter(Boolean).join(' ');
    $('reviewRows').innerHTML=`<div class="review-effect-row item-effect-row no-metric"><div><span>CLASS</span><strong>${esc(itemClassText(card))}</strong></div><div><span>RANK</span><strong>All Ranks</strong></div><div class="review-effect-info full-span"><span>ITEM EFFECT</span><p>${esc(effect||'—')}</p></div></div>`;
  }else if(card.family==='Event'){
    const effect=rows.map(row=>row.effect_text||row.text||row.damage_text||'').filter(Boolean).join(' ');
    $('reviewRows').innerHTML=`<div class="review-generic-row review-large-effect"><span>EVENT EFFECT</span><p>${esc(effect||'—')}</p></div>`;
  }else if(card.family==='LegacyModeDefinition'){
    const effect=rows.map(row=>row.effect_text||row.text||row.damage_text||'').filter(Boolean).join(' ');
    $('reviewRows').innerHTML=`<div class="review-generic-row"><span>LEGACY ABILITY</span><p>${esc(effect||'—')}</p></div>${card.rules?`<div class="review-generic-row legacy-rules-row"><span>RULES</span><p>${esc(card.rules)}</p></div>`:''}`;
  }else{
    $('reviewRows').innerHTML=rows.map(row=>`<div class="review-generic-row"><span>${esc(String(row.label||'CARD EFFECT').toUpperCase())}</span><p>${esc(row.text||row.effect_text||row.damage_text||'—')}</p></div>`).join('');
  }
}
function openCardReview(cardId){
  const card=cardById(cardId);if(!card)return;state.selectedCardId=cardId;hideHover();
  const dialog=$('cardReviewDialog');dialog.dataset.reviewKind=card.family==='Hero'?'hero':card.family==='Skill'?'skill':card.family==='Item'?'item':card.family==='Event'?'event':card.family==='LegacyModeDefinition'?'legacy':'standard';
  $('reviewTitle').textContent=card.name;$('reviewEyebrow').textContent=reviewEyebrow(card);$('reviewArt').src=card.image;$('reviewArt').alt=card.name;
  if(card.family==='Hero'){heroReviewHtml(card);window.GL_S0_REVIEW_CLARITY?.enhanceHero(card,$('reviewRows'));}else {standardReviewHtml(card);window.GL_S0_REVIEW_CLARITY?.enhance(card,$('reviewRows'));}
  const progression=state.progressionByHeroId.get(card.id),progressionBox=$('reviewProgression');
  if(progression){
    progressionBox.hidden=false;$('reviewProgressionCards').innerHTML=progression.cardIds.map(id=>{const hero=cardById(id);return `<button class="review-progression-card ${id===card.id?'active':''}" type="button" data-review-rank-id="${id}"><img src="${hero.image}" alt="${esc(hero.name)}"></button>`}).join('');
    document.querySelectorAll('[data-review-rank-id]').forEach(button=>button.addEventListener('click',()=>openCardReview(button.dataset.reviewRankId)));
  }else{progressionBox.hidden=true;$('reviewProgressionCards').innerHTML=''}
  if(!dialog.open)dialog.showModal();
  dialog.querySelector('.review-card')?.scrollTo(0,0);
}

function validationIssues(){return s0Validation().errors;}
function oldValidationIssues(){
  const issues=[];
  if(!heroFormationComplete())issues.push('Select three Hero progression packages.');
  if(!legacyUniqueComplete())issues.push('Choose three unique Legacy Cards.');
  if(legacyCardCount()!==12)issues.push(`Legacy Deck must contain 12 cards (currently ${legacyCardCount()}).`);
  const incompatible=incompatibleDeckEntries();if(incompatible.length)issues.push(`${incompatible.reduce((sum,entry)=>sum+entry.quantity,0)} Main Deck card(s) are incompatible with the selected Heroes.`);
  for(const [id,quantity] of Object.entries(state.deck)){const card=state.byId.get(id);if(!card)issues.push(`Unknown card ID: ${id}.`);else if(quantity>copyLimit(card))issues.push(`${card.name} exceeds its copy limit (${quantity}/${copyLimit(card)}).`)}
  return issues;
}
function updateExportButton(){const valid=validationIssues().length===0&&countDeck()===50;$('exportDeckButton').disabled=!valid;$('exportDeckButton').title=valid?'Export valid 50-card Season 0 deck':'Export requires exactly 50 cards and a valid deck';}

function askConfirm(options){return window.GL_S0_MODAL.askConfirm(options,esc)}

function blankDeck(){
  state.deck={};state.slots=[emptySlot(),emptySlot(),emptySlot()];state.rankView=1;$('deckName').value='New Deck';syncPoolGate();setLibraryTab('heroes');renderAll();
}
function normalizeImportedDeck(data){
  data=s0ImportPayload(data);
  const deck={};
  const entries=Array.isArray(data.main_deck)?data.main_deck:Array.isArray(data.mainDeck)?data.mainDeck:[];
  for(const entry of entries){const id=entry.card_id||entry.cardId||entry.id,card=state.byId.get(id),quantity=Number(entry.quantity??entry.qty??1);if(card&&Number.isFinite(quantity)&&quantity>0)deck[id]=Math.floor(quantity)}
  const rawSlots=(data.legacy_deck_package_slots||data.side_deck_package_slots||data.legacySlots||[]).slice(0,3).map(slot=>({progressionId:slot.progression||slot.progressionId||'',legacyId:slot.legacy||slot.legacyId||''}));
  while(rawSlots.length<3)rawSlots.push(emptySlot());
  const formation=data.default_formation||data.formation||{},ordered=[];
  for(const position of POSITIONS){const heroId=formation[position]||formation[position.toLowerCase()]||'';const match=rawSlots.find(slot=>state.progressionById.get(slot.progressionId)?.cardIds[0]===heroId&&!ordered.includes(slot));if(match)ordered.push(match)}
  rawSlots.forEach(slot=>{if(!ordered.includes(slot))ordered.push(slot)});
  const slots=ordered.slice(0,3);
  slots.forEach((slot,index)=>{if(!state.progressionById.has(slot.progressionId))slots[index]=emptySlot()});
  const usedLegacy=new Set();slots.forEach(slot=>{if(slot.legacyId&&usedLegacy.has(slot.legacyId))slot.legacyId='';else if(slot.legacyId)usedLegacy.add(slot.legacyId)});
  return {name:data.deck_name||data.deckName||'Imported Deck',deck,slots};
}
function compactDeckName(name=''){
  const value=String(name||'New Deck').trim();
  const starter=value.match(/^Starter\s*(\d+)/i);
  return starter?`Starter ${starter[1]}`:value;
}
function applyDeck(normalized){
  const classIssue=baseClassLimitIssue(normalized.slots);if(classIssue)throw new Error(classIssue);
  const previousComplete=hasSelectedHeroes();state.deck={...normalized.deck};state.slots=clone(normalized.slots);while(state.slots.length<3)state.slots.push(emptySlot());$('deckName').value=compactDeckName(normalized.name||'New Deck');state.rankView=1;syncPoolGate();setLibraryTab('heroes');renderAll();
}
function starterCover(starter,index){
  const slots=starter.legacy_deck_package_slots||starter.side_deck_package_slots||[];
  const center=starter.default_formation?.CENTER||starter.default_formation?.center;
  const progressionId=center||slots[1]?.progression||slots[0]?.progression;
  return state.progressionById.get(progressionId)?.coverImage||'';
}
function renderStarterDialog(){
  // Style 1: all five Starter Decks are selectable directly in the first New Deck dialog.
  // Keep the shared card markup and data used by Style 2, without a second popup.
  const root=$('starterDeckGrid');
  root.innerHTML=window.GL_S0_MODAL.starterMarkup(state.starters,state.progressionById,starterCover,esc);
  root.querySelectorAll('[data-starter-index]').forEach(button=>button.addEventListener('click',()=>chooseStarter(Number(button.dataset.starterIndex))));
}

function showNewDeckDialog(initial=false){state.initialChoicePending=initial;$('newDeckClose').hidden=initial;const dialog=$('newDeckDialog');if(!dialog.open)dialog.showModal()}
function closeNewDeckDialog(){if(state.initialChoicePending)return;const dialog=$('newDeckDialog');if(dialog.open)dialog.close()}
function chooseBlank(){blankDeck();state.initialChoicePending=false;$('newDeckDialog').close();toast('Blank deck created')}
function chooseStarter(index){const starter=state.starters[index];if(!starter)return;applyDeck(normalizeImportedDeck(starter));state.initialChoicePending=false;$('newDeckDialog').close();toast('Starter Deck loaded')}
async function openNewDeckFlow(){
  if(isDeckDirty()){const ok=await askConfirm({eyebrow:'NEW DECK',title:'Replace the current deck?',message:'Starting another deck will replace the current Legacy Deck, Main Deck, Formation, and deck name.',okLabel:'CONTINUE',danger:true});if(!ok)return}
  showNewDeckDialog(false);
}
async function importDeckFile(file){
  try{
    const original=JSON.parse(await file.text());let data=original;
    const converter=window.GL_S1_TO_S0_IMPORT;
    if(converter?.isSeason1(original)){
      const migration=converter.migrate(original,window.GL_DECK_BUILDER_DATA);
      const report=migration.summary;
      const details=migration.issues.slice(0,100).map(item=>({label:`${item.kind}: ${item.name}`,value:`×${item.quantity} — ${item.reason}`}));
      if(migration.issues.length>100)details.push({label:'More skipped entries',value:String(migration.issues.length-100)});
      migration.copyLimitWarnings.forEach(label=>details.push({label:'Over copy limit',value:label}));
      const accepted=await askConfirm({eyebrow:'SEASON 1 → SEASON 0',title:'Review migrated cards before loading',
        message:`<b>${report.matched}</b> of <b>${report.source}</b> Main Deck copies matched by name; <b>${report.skipped}</b> skipped. ${report.heroMatched} Hero progressions and ${report.legacyMatched} Legacies matched. Cards beyond 50 remain in the draft and the 50-card legality rule is unchanged. Skipped cards are listed below. This replaces the current draft only if you confirm. The original JSON is never modified.`,
        list:details,okLabel:'IMPORT MATCHED CARDS'});
      if(!accepted)return;
      data=migration.deck;
    }
    applyDeck(normalizeImportedDeck(data));
    if(state.initialChoicePending){state.initialChoicePending=false;const dialog=$('newDeckDialog');if(dialog&&dialog.open)dialog.close()}
    toast('Deck imported');
  }catch(error){await askConfirm({eyebrow:'IMPORT ERROR',title:'Could not import this deck',message:esc(error.message||String(error)),okLabel:'CLOSE'})}
  finally{$('deckFileInput').value=''}
}

function expandedLegacy(){
  const output=[];state.slots.forEach((slot,index)=>{const progression=state.progressionById.get(slot.progressionId),legacy=state.legacyById.get(slot.legacyId);if(!progression)return;const packageId=`CUSTOM-SLOT-${index+1}`,packageName=`${progression.name}${legacy?` + ${legacy.name}`:''}`;progression.cardIds.forEach(id=>{const card=state.legacyById.get(id);if(card)output.push({card_id:id,card_name:card.name,card_type:'Hero',package_id:packageId,package_name:packageName})});if(legacy)output.push({card_id:legacy.id,card_name:legacy.name,card_type:'Legacy',package_id:packageId,package_name:packageName})});return output;
}
function exportObject(){return s0Export('style1');}
function downloadJson(object){const safe=(object.deck_name||'Grandis_Legacy_Deck').replace(/[^a-z0-9_-]+/gi,'_').replace(/^_+|_+$/g,'')||'Grandis_Legacy_Deck';const blob=new Blob([JSON.stringify(object,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`${safe}.json`;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function exportDeck(){const object=exportObject();if(!object.is_valid||countDeck()!==50){toast('Export requires a valid deck with exactly 50 cards');return}downloadJson(object);toast('Deck exported')}

function bindStaticEvents(){
  document.querySelectorAll('.library-tab').forEach(button=>button.addEventListener('click',()=>setLibraryTab(button.dataset.libraryTab)));
  document.querySelectorAll('[data-section-toggle]').forEach(button=>button.addEventListener('click',()=>toggleSection(button.dataset.sectionToggle)));
  $('filterToggle').addEventListener('click',()=>{const panel=$('filterPanel'),open=panel.hidden;panel.hidden=!open;$('filterToggle').setAttribute('aria-expanded',String(open))});
  $('searchInput').addEventListener('input',event=>{state.filters.search=event.target.value;renderLibrary()});
  $('cardPoolSelect').addEventListener('change',event=>{state.sharedFilters.pool=event.target.value;syncPoolChoiceButtons();renderLibrary()});bindPoolChoiceButtons();
  $('classFilter').addEventListener('change',event=>{state.filters.className=event.target.value;renderLibrary()});
  $('skillTypeFilter').addEventListener('change',event=>{state.filters.skillType=event.target.value;renderLibrary()});
  $('keywordFilter').addEventListener('change',event=>{state.filters.keyword=event.target.value;renderLibrary()});
  $('effectFilter').addEventListener('change',event=>{state.filters.effect=event.target.value;renderLibrary()});
  ['manaMin','manaMax'].forEach(id=>$(id).addEventListener('input',()=>{updateManaRangeLabel();renderLibrary()}));
  $('resetFilters').addEventListener('click',resetFilters);$('rankPrev').addEventListener('click',()=>cycleRank(-1));$('rankNext').addEventListener('click',()=>cycleRank(1));
  $('newDeckButton').addEventListener('click',openNewDeckFlow);$('createBlankDeck').addEventListener('click',chooseBlank);$('importDeckStart').addEventListener('click',()=>$('deckFileInput').click());$('newDeckClose').addEventListener('click',closeNewDeckDialog);
  $('importDeckButton').addEventListener('click',()=>$('deckFileInput').click());$('deckFileInput').addEventListener('change',event=>{const file=event.target.files?.[0];if(file)importDeckFile(file)});$('exportDeckButton').addEventListener('click',exportDeck);
  $('mainDeckViewOpen').addEventListener('click',openMainDeckView);
  $('mainDeckViewClose').addEventListener('click',()=>$('mainDeckViewDialog').close());
  $('mainDeckViewDialog').addEventListener('click',event=>{if(event.target===$('mainDeckViewDialog'))$('mainDeckViewDialog').close()});
  $('reviewClose').addEventListener('click',()=>$('cardReviewDialog').close());$('cardReviewDialog').addEventListener('click',event=>{if(event.target===$('cardReviewDialog'))$('cardReviewDialog').close()});
  $('newDeckDialog').addEventListener('cancel',event=>{if(state.initialChoicePending)event.preventDefault()});$('newDeckDialog').addEventListener('click',event=>{if(event.target===$('newDeckDialog')&&!state.initialChoicePending)$('newDeckDialog').close()});
  $('deckName').addEventListener('input',()=>{updateExportButton();s0Persist()});bindGlobalDropZones();
}



/* DB-11: one logical deck shared across Style 1 and Style 2, including file:// navigation. */
let s0LastWorkspaceJson='';
function s0Persist(){
 if(!window.GL_S0_CAN_PERSIST)return;
 try{
  const value=JSON.stringify(s0Export('shared'));
  sessionStorage.setItem(window.GL_S0_SHARED_WORKSPACE?.STORAGE_KEY||'grandis-season0-deck-session-v1',value);
  s0LastWorkspaceJson=value;
 }catch(e){/* file:// privacy restrictions must not block cross-style handoff */}
}
function s0Restore(serialized){
 let restored=false,fromHandoff=false;
 try{
  const incoming=serialized===undefined?window.GL_S0_SHARED_WORKSPACE?.takeIncoming():null;
  fromHandoff=Boolean(incoming);
  const saved=serialized!==undefined?serialized:(!fromHandoff?sessionStorage.getItem(window.GL_S0_SHARED_WORKSPACE?.STORAGE_KEY||'grandis-season0-deck-session-v1'):null);
  const parsed=incoming||(saved?JSON.parse(saved):null);
  if(parsed){
   const normalized=normalizeImportedDeck(parsed);
   // A shared workspace keeps exact Left / Center / Right including empty slots.
   if(parsed.schema==='GL-SEASON0-DECK-DRAFT-1'&&parsed.style==='shared'&&Array.isArray(parsed.legacy_deck_package_slots)){
    normalized.slots=parsed.legacy_deck_package_slots.slice(0,3).map(slot=>{
     const progressionId=String(slot?.progression||slot?.progressionId||'');
     const legacyId=String(slot?.legacy||slot?.legacyId||'');
     if(!state.progressionById.has(progressionId))return emptySlot();
     return {progressionId,legacyId:state.legacyById.has(legacyId)?legacyId:''};
    });
    while(normalized.slots.length<3)normalized.slots.push(emptySlot());
   }
   // Restoring a shared snapshot must never echo a stale blank back into storage.
   window.GL_S0_CAN_PERSIST=false;
   applyDeck(normalized);
   restored=true;
   s0LastWorkspaceJson=saved||'';
  }
 }catch(e){console.warn('Could not restore Season 0 draft:',e.message);}
 finally{window.GL_S0_CAN_PERSIST=true;}
 // Keep the incoming draft for this tab only (not after closing the Deck Builder).
 if(restored&&fromHandoff)s0Persist();
 return restored;
}

/* Season 0 OSA construction-only bridge — same for original Style 1 / Style 2. */
function s0Draft(){
 const main_deck=Object.entries(state.deck).filter(([,quantity])=>quantity>0).map(([card_id,quantity])=>({card_id,quantity}));
 const legacy_packages=state.slots.map(slot=>{
   const p=state.progressionById.get(slot.progressionId);
   return p?{hero_rank_ids:p.cardIds.slice(),legacy_card_id:slot.legacyId||''}:null;
 }).filter(Boolean);
 let shard_deck;
 try{shard_deck=window.GL_S0_LEGALITY.deriveShardDeck(main_deck,window.GL_S0_CATALOG,legacy_packages)}
 catch(e){shard_deck=[{kind:'MANA',quantity:12}];}
 return {main_deck,legacy_packages,shard_deck};
}
function s0Validation(){
 const draft=s0Draft(),v=window.GL_S0_LEGALITY.validateDeck(draft,window.GL_S0_CATALOG,{policy:'rulebook'});
 const classIssue=baseClassLimitIssue();if(classIssue){v.errors.push(classIssue);v.ok=false;}
 return v;
}
function s0Export(style){
 const deck=s0Draft(),validation=s0Validation(),name=$('deckName').value.trim()||'New Deck';
 return {schema:'GL-SEASON0-DECK-DRAFT-1',schema_version:'GL-SEASON0-DECK-DRAFT-1',
  source_authority:'R3.6-MainDeck-LegacyDeck-PlayerRulebook-v3.2',rulebook:'v3.2',season:'S0',builder_version:'1.64',style,
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
 const importedCount=doc.main_deck.reduce((sum,item)=>sum+Number(item.quantity??item.qty??1),0);
 if(!Number.isFinite(importedCount)||importedCount>60)throw Error('Imported Main Deck exceeds 60-card draft workspace capacity');
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

(function init(){
  const data=window.GL_DECK_BUILDER_DATA;if(!data)throw new Error('Deck Builder data failed to load.');
  const keywordChoices=[...new Set((data.mainCards||[]).flatMap(card=>card.keywords||[]))].filter(Boolean).sort((a,b)=>a.localeCompare(b));
  $('keywordFilter').innerHTML='<option value="">All Keywords</option>'+keywordChoices.map(keyword=>`<option value="${esc(keyword)}">${esc(keyword)}</option>`).join('');
  const effectChoices=window.GL_S0_EFFECT_FILTER.choices(data.mainCards||[]);
  $('effectFilter').innerHTML='<option value="">All Effects</option>'+effectChoices.map(tag=>`<option value="${esc(tag)}">${esc(tag)}</option>`).join('');
  if(window.GL_S0_SHARED_WORKSPACE){
    window.GL_S0_SHARED_WORKSPACE.bindNavigation(()=>s0Export('shared'),s0Persist);
    window.GL_S0_SHARED_WORKSPACE.bindLiveSync(s0Restore,()=>s0LastWorkspaceJson);
  }else document.querySelectorAll('.style-switch-link').forEach(link=>link.addEventListener('click',s0Persist));
  state.cards=data.mainCards||[];state.byId=new Map(state.cards.map(card=>[card.id,card]));state.legacyCards=data.legacyCards||[];state.legacyById=new Map(state.legacyCards.map(card=>[card.id,card]));state.sourcePackages=data.legacyPackages||[];state.starters=data.starters||[];buildProgressions();bindStaticEvents();renderStarterDialog();blankDeck();updateManaRangeLabel();s0Restore();
})();
