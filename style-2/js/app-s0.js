'use strict';

const POSITIONS=['LEFT','CENTER','RIGHT'];
const MAIN_DECK_LEGAL_LIMIT=50;
const MAIN_DECK_WORKSPACE_LIMIT=60; // Draft workspace only; Rulebook export remains exactly 50.
const DECK_BUILDER_RELEASE='1.32.6-S0';
function defaultFilterSet(family=''){return {search:'',family,className:'',skillType:'',attackStyle:'',keyword:'',effect:'',pool:'all',manaMin:0,manaMax:9}}
function resetAllFilterSets(){
  const hasHeroes=selectedProgressions().length>0;
  state.filterSets={all:defaultFilterSet(''),Skill:defaultFilterSet('Skill'),Event:defaultFilterSet('Event'),Item:defaultFilterSet('Item')};
  Object.values(state.filterSets).forEach(filters=>{filters.pool=hasHeroes?'available':'all'});
  state.filters=state.filterSets.all;
}
function activateAvailablePool(){
  const pool=selectedProgressions().length?'available':'all';
  Object.values(state.filterSets).forEach(filters=>{filters.pool=pool});
  state.filters.pool=pool;
}
const state={
  tab:'legacy',rankView:1,heroPickerSlot:0,
  cards:[],byId:new Map(),legacyCards:[],legacyById:new Map(),sourcePackages:[],
  progressions:[],progressionById:new Map(),progressionByHeroId:new Map(),starters:[],
  deck:{},slots:[emptySlot(),emptySlot(),emptySlot()],
  filters:defaultFilterSet(''),
  filterSets:{all:defaultFilterSet(''),Skill:defaultFilterSet('Skill'),Event:defaultFilterSet('Event'),Item:defaultFilterSet('Item')},
  mobileMainDeck:window.innerWidth<=760
};

const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clone=value=>JSON.parse(JSON.stringify(value));
function emptySlot(){return {progressionId:'',legacyId:''}}
function idSort(a,b){return String(a?.id||'').localeCompare(String(b?.id||''),undefined,{numeric:true})}
const MAIN_DECK_FAMILY_ORDER={Skill:0,Event:1,Item:2};
function mainDeckSort(a,b){const aCard=a?.card||a,bCard=b?.card||b;const familyDiff=(MAIN_DECK_FAMILY_ORDER[aCard?.family]??99)-(MAIN_DECK_FAMILY_ORDER[bCard?.family]??99);return familyDiff||idSort(aCard,bCard)}
function countDeck(deck=state.deck){return Object.values(deck).reduce((sum,qty)=>sum+Number(qty||0),0)}
function copyLimit(card){return card?.ultimate?.isUltimate||card?.maxCopies===1?1:Number(card?.maxCopies||3)}
function isMobileMainDeck(){return window.innerWidth<=760}
function selectedProgressions(slots=state.slots){return slots.map(slot=>state.progressionById.get(slot.progressionId)).filter(Boolean)}
function heroFormationComplete(slots=state.slots){return selectedProgressions(slots).length===3}
function legacyUniqueComplete(slots=state.slots){const ids=slots.map(slot=>slot.legacyId).filter(Boolean);return ids.length===3&&new Set(ids).size===3}
function legacyCardCount(slots=state.slots){return slots.reduce((sum,slot)=>sum+(slot.progressionId?3:0)+(slot.legacyId?1:0),0)}
function legacyReady(slots=state.slots){return heroFormationComplete(slots)&&legacyUniqueComplete(slots)&&legacyCardCount(slots)===12}
function cardById(id){return state.byId.get(id)||state.legacyById.get(id)}
function isDeckDirty(){return countDeck()>0||state.slots.some(slot=>slot.progressionId||slot.legacyId)||$('deckName').value.trim()!=='New Deck'}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1900)}

function buildProgressions(){
  const byBase=new Map();
  for(const source of state.sourcePackages){
    if(byBase.has(source.baseCardId))continue;
    const cardIds=(source.heroIds||source.cardIds?.slice(0,3)||[]).slice(0,3);
    byBase.set(source.baseCardId,{id:source.baseCardId,name:state.legacyById.get(source.baseCardId)?.name||source.lineage,baseClass:source.baseClass,race:source.race,lineage:source.lineage,cardIds,classLineage:(source.classLineage||[]).slice(),coverImage:source.coverImage});
  }
  // Melody & Bromir are now available via user-supplied Ultimates; class abilities remain draft.
  // Hide incomplete progressions from BOTH hero selectors, while keeping the source records.
  const owners=new Set(state.cards.filter(card=>card.family==='Skill'&&card.ultimate?.isUltimate)
    .map(card=>/^Only\s+([^ ]+)\s+can\s+use\b/i.exec(String(card.ultimate.owner||''))?.[1]?.toLowerCase())
    .filter(Boolean));
  state.progressions=Array.from(byBase.values()).filter(progression=>
    owners.has(String(progression.name||'').split(/\s+/)[0].toLowerCase())
  ).sort((a,b)=>idSort({id:a.id},{id:b.id}));
  state.progressionById=new Map(state.progressions.map(item=>[item.id,item]));
  state.progressionByHeroId=new Map();
  state.progressions.forEach(progression=>progression.cardIds.forEach(id=>state.progressionByHeroId.set(id,progression)));
}

function manaNumber(card){
  const cost=String(card?.cost||'');if(/no mana cost/i.test(cost))return 0;
  const values=[...cost.matchAll(/(\d+)\s*Mana/gi)].map(match=>Number(match[1]));return values.length?Math.min(...values):0;
}
function skillType(card){const text=String(card?.classification||'');if(/Attack/i.test(text))return 'Attack';if(/Defense/i.test(text))return 'Defense';if(/Tactical/i.test(text))return 'Tactical';if(/Support/i.test(text))return 'Support';return ''}
function attackStyle(card){const text=String(card?.classification||'');for(const value of ['Physical','Magical','Area','Range','Casting'])if(text.startsWith(value))return value;return ''}
function cardAvailable(card,slots=state.slots){
  return window.GL_S0_AVAILABLE_CARDS.available(card,selectedProgressions(slots),window.GL_S0_CATALOG);
}
// Deck Builder usability policy restores v1.31 behavior; OSA Rulebook authority stays separate.
function cardCompatible(card,slots=state.slots){
  return cardAvailable(card,slots);
}
function incompatibleDeckEntries(slots=state.slots,deck=state.deck){return Object.entries(deck).filter(([,qty])=>qty>0).map(([id,quantity])=>({card:state.byId.get(id),quantity})).filter(entry=>!cardCompatible(entry.card,slots)).sort((a,b)=>idSort(a.card,b.card))}
function lostCompatibilityEntries(proposedSlots){return Object.entries(state.deck).filter(([,qty])=>qty>0).map(([id,quantity])=>({card:state.byId.get(id),quantity})).filter(entry=>cardCompatible(entry.card,state.slots)&&!cardCompatible(entry.card,proposedSlots)).sort((a,b)=>idSort(a.card,b.card))}
function familyCount(family){return Object.entries(state.deck).reduce((sum,[id,qty])=>sum+(state.byId.get(id)?.family===family?Number(qty):0),0)}
function skillClassBreakdown(){
  const counts=new Map();
  for(const [id,qtyRaw] of Object.entries(state.deck)){
    const card=state.byId.get(id),qty=Number(qtyRaw||0);
    if(!card||card.family!=='Skill'||qty<=0)continue;
    const className=String(card.classGroup||'Unknown').trim()||'Unknown';
    counts.set(className,(counts.get(className)||0)+qty);
  }
  return Array.from(counts.entries())
    .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
}
function renderSkillClassTooltip(){
  const tip=$('skillClassTooltip');if(!tip)return;
  const rows=skillClassBreakdown();
  if(!rows.length){tip.hidden=true;tip.innerHTML='';return}
  tip.innerHTML=`<span class="skill-tooltip-title">Skill Classes</span>${rows.map(([name,count])=>`<span class="skill-tooltip-row"><span>${esc(name)}</span><strong>${count}</strong></span>`).join('')}`;
  tip.hidden=false;
}


function compatibleLegacies(progressionId,slotIndex,slots=state.slots){
  const progression=state.progressionById.get(progressionId);if(!progression)return [];
  const used=new Set(slots.map((slot,index)=>index===slotIndex?'':slot.legacyId).filter(Boolean));
  return state.legacyCards.filter(card=>card.family==='LegacyModeDefinition'&&card.classGroup===progression.baseClass&&!used.has(card.id)).sort(idSort);
}
function defaultLegacyForProgression(progressionId,slotIndex,slots=state.slots){return compatibleLegacies(progressionId,slotIndex,slots)[0]?.id||''}

function updateTabs(){
  const total=legacyCardCount();
  $('legacyTabCount').textContent=`${total} / 12`;$('legacyDeckTotal').textContent=total;
  $('heroCountBadge').textContent=selectedProgressions().length*3;$('legacyCountBadge').textContent=state.slots.filter(slot=>slot.legacyId).length;
  $('mainTabButton').disabled=false;$('mainTabButton').classList.remove('locked');$('mainTabButton').removeAttribute('title');$('mainTabCount').textContent=`${countDeck()} / ${MAIN_DECK_LEGAL_LIMIT}`;
}
function setTab(tab){
  state.tab=tab;
  document.querySelectorAll('.tab-button').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));
  $('legacyView').hidden=tab!=='legacy';$('mainView').hidden=tab!=='main';
  if(tab==='legacy')renderLegacy();else renderMain();
}
function cycleRank(delta){state.rankView=Math.max(1,Math.min(3,state.rankView+delta));renderLegacy()}
function swapSlots(a,b){[state.slots[a],state.slots[b]]=[state.slots[b],state.slots[a]];renderLegacy();renderMain();toast(`${POSITIONS[a]} and ${POSITIONS[b]} swapped`)}

function swapIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-3-3M17 17H7l3 3M17 7l3 3-3 3M7 17l-3-3 3-3"/></svg>'}
function positionSwapIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3-3m-3 3 3 3"/></svg>'}
function reviewButton(cardId){return `<button class="review-button" type="button" data-review-id="${esc(cardId)}" aria-label="Preview card"><img src="../assets/ui/expand.png" alt=""></button>`}
function heroStageHtml(slot,index){
  const progression=state.progressionById.get(slot.progressionId),card=progression?state.legacyById.get(progression.cardIds[state.rankView-1]):null;
  if(!card)return `<button class="card-stage empty" type="button" data-choose-hero="${index}"><span>CLICK TO SELECT<br><b>${POSITIONS[index]} HERO</b></span></button>`;
  return `<div class="card-stage"><img src="${card.image}" alt="${esc(card.name)}"><div class="card-actions"><button class="icon-action" type="button" data-choose-hero="${index}" title="Change Hero Progression" aria-label="Change Hero Progression">${swapIcon()}</button>${reviewButton(card.id)}</div></div>`;
}
function renderLegacy(){
  const grid=[];
  state.slots.forEach((slot,index)=>{
    grid.push(`<article class="hero-slot">${heroStageHtml(slot,index)}<div class="position-label">${POSITIONS[index]}</div></article>`);
    if(index<2)grid.push(`<button class="position-swap" type="button" data-swap-left="${index}" title="Swap Position" aria-label="Swap ${POSITIONS[index]} and ${POSITIONS[index+1]}">${positionSwapIcon()}</button>`);
  });
  $('heroSlotsGrid').innerHTML=grid.join('');$('rankLabel').textContent=`RANK ${['I','II','III'][state.rankView-1]}`;
  $('legacySlotsGrid').innerHTML=state.slots.map((slot,index)=>{
    const card=state.legacyById.get(slot.legacyId),options=compatibleLegacies(slot.progressionId,index).concat(card&&!compatibleLegacies(slot.progressionId,index).some(item=>item.id===card.id)?[card]:[]).sort(idSort);
    const selectOptions=slot.progressionId?options.map(item=>`<option value="${item.id}" ${item.id===slot.legacyId?'selected':''}>${esc(item.name)}</option>`).join(''):'<option value="">Choose a Hero first</option>';
    return `<article class="legacy-slot"><div class="legacy-card-stage">${card?`<img src="${card.image}" alt="${esc(card.name)}">${reviewButton(card.id)}`:`<div class="legacy-placeholder">Legacy appears automatically after choosing a Hero.</div>`}</div><select class="legacy-select" data-legacy-slot="${index}" ${slot.progressionId?'':'disabled'}>${selectOptions}</select></article>`;
  }).join('');
  document.querySelectorAll('[data-choose-hero]').forEach(button=>button.addEventListener('click',()=>openHeroPicker(Number(button.dataset.chooseHero))));
  document.querySelectorAll('[data-swap-left]').forEach(button=>button.addEventListener('click',()=>swapSlots(Number(button.dataset.swapLeft),Number(button.dataset.swapLeft)+1)));
  document.querySelectorAll('[data-legacy-slot]').forEach(select=>select.addEventListener('change',()=>{state.slots[Number(select.dataset.legacySlot)].legacyId=select.value;renderLegacy();renderMain()}));
  bindReviewButtons(document);updateTabs();
}

function openHeroPicker(slotIndex){state.heroPickerSlot=slotIndex;$('heroPickerTitle').textContent=`Select ${POSITIONS[slotIndex]} Hero Progression`;renderHeroPicker();$('heroPickerDialog').showModal()}
function renderHeroPicker(){
  const used=new Set(state.slots.map((slot,index)=>index===state.heroPickerSlot?'':slot.progressionId).filter(Boolean));
  $('heroPickerGrid').innerHTML=state.progressions.map(progression=>{
    const cards=progression.cardIds.map(id=>state.legacyById.get(id)).filter(Boolean);
    const classes=(progression.classLineage||[]).join(' → ')||progression.lineage||progression.baseClass||'';
    return `<button class="hero-choice ${used.has(progression.id)?'used':''}" type="button" data-progression-choice="${progression.id}" ${used.has(progression.id)?'disabled':''}><div class="hero-choice-cards">${cards.map(card=>`<img src="${card.image}" alt="${esc(card.name)}">`).join('')}</div><div class="hero-choice-info"><strong>${esc(progression.name)}</strong><span>${esc(classes)}</span></div></button>`;
  }).join('');
  document.querySelectorAll('[data-progression-choice]').forEach(button=>button.addEventListener('click',()=>selectProgression(state.heroPickerSlot,button.dataset.progressionChoice)));
}
async function selectProgression(slotIndex,progressionId){
  if(state.slots[slotIndex].progressionId===progressionId){$('heroPickerDialog').close();return}
  const proposed=clone(state.slots);proposed[slotIndex].progressionId=progressionId;proposed[slotIndex].legacyId=defaultLegacyForProgression(progressionId,slotIndex,proposed);
  const removed=lostCompatibilityEntries(proposed);
  if(removed.length){
    const total=removed.reduce((sum,item)=>sum+item.quantity,0),ok=await askConfirm({eyebrow:'CHANGE HERO',title:'Change Hero and remove incompatible cards?',message:`This formation change will remove <b>${total}</b> Main Deck card${total===1?'':'s'} that the new Hero lineages cannot use.`,list:removed.map(item=>({label:item.card?.name||item.card?.id||'Unknown card',value:`×${item.quantity}`})),okLabel:'CHANGE HERO',danger:true});
    if(!ok)return;
  }
  state.slots=proposed;removed.forEach(item=>{if(item.card)delete state.deck[item.card.id]});activateAvailablePool();$('heroPickerDialog').close();renderLegacy();renderMain();toast('Hero progression selected');
}

function syncFilterControls(){
  $('searchInput').value=state.filters.search;$('familyFilter').value=state.filters.family;$('classFilter').value=state.filters.className;state.filters.skillType=window.GL_S0_SUBTYPE_FILTER.fill($('skillTypeFilter'),state.filters.family,state.filters.skillType);$('keywordFilter').value=state.filters.keyword||'';$('effectFilter').value=state.filters.effect||'';$('manaMin').value=String(state.filters.manaMin);$('manaMax').value=String(state.filters.manaMax);updateManaRange();updateFilterStates();
}
function switchFilterFamily(family){
  const oldKey=state.filters.family||'all';state.filterSets[oldKey]={...state.filters};const key=family||'all';state.filters={...(state.filterSets[key]||defaultFilterSet(family)),family};state.filterSets[key]=state.filters;syncFilterControls();renderLibrary();
}
function updateFilterStates(){
  const family=state.filters.family,skill=family==='Skill',hasHeroes=selectedProgressions().length>0;
  $('classField').classList.toggle('disabled',!skill);$('classFilter').disabled=!skill;
  $('skillTypeField').classList.toggle('disabled',!family);$('skillTypeFilter').disabled=!family;
  state.filters.skillType=window.GL_S0_SUBTYPE_FILTER.fill($('skillTypeFilter'),family,state.filters.skillType);
  if(!hasHeroes&&state.filters.pool==='available')state.filters.pool='all';
  const pool=$('cardPoolSelect');pool.value=state.filters.pool;
  for(const opt of pool.options){if(opt.value==='available')opt.disabled=!hasHeroes}
  pool.title=hasHeroes?'Card availability for the selected Heroes':'Select a Hero to enable Available Cards';
}
function updateManaRange(){
  let min=Number($('manaMin').value),max=Number($('manaMax').value);if(min>max){if(document.activeElement===$('manaMin'))max=min;else min=max;$('manaMin').value=String(min);$('manaMax').value=String(max)}
  state.filters.manaMin=min;state.filters.manaMax=max;$('manaRangeValue').textContent=`${min}–${max}`;const minPct=min/9*100,maxPct=max/9*100;$('manaRangeTrack').style.background=`linear-gradient(to right,#30323d 0 ${minPct}%,#0aa8f6 ${minPct}% ${maxPct}%,#30323d ${maxPct}% 100%)`;
}
function filteredCards(){
  const query=state.filters.search.trim().toLowerCase();
  return state.cards.filter(card=>{
    const compatible=cardCompatible(card),mana=manaNumber(card),haystack=String(card.name||'').toLowerCase();
    if(state.filters.pool==='available'&&!cardAvailable(card))return false;
    if(query&&!haystack.includes(query))return false;
    if(state.filters.family&&card.family!==state.filters.family)return false;
    if(state.filters.family==='Skill'){
      if(state.filters.className&&card.classGroup!==state.filters.className&&!card.legalActiveClasses?.includes(state.filters.className))return false;
      if(state.filters.skillType&&!window.GL_S0_SUBTYPE_FILTER.matches(card,state.filters.skillType))return false;
    }
    if(state.filters.family!=='Skill'&&state.filters.skillType&&!window.GL_S0_SUBTYPE_FILTER.matches(card,state.filters.skillType))return false;
    if(state.filters.keyword&&!(card.keywords||[]).includes(state.filters.keyword))return false;
    if(state.filters.effect&&!window.GL_S0_EFFECT_FILTER.tags(card).includes(state.filters.effect))return false;
    if(mana<state.filters.manaMin||mana>state.filters.manaMax)return false;
    return true;
  }).sort(mainDeckSort);
}
function libraryCardHtml(card){const compatible=cardCompatible(card),quantity=Number(state.deck[card.id]||0),canDrag=compatible&&!isMobileMainDeck()&&quantity<copyLimit(card)&&countDeck()<MAIN_DECK_WORKSPACE_LIMIT;return `<article class="library-card ${compatible?'':'incompatible'}" data-library-card="${card.id}" data-hover-card-id="${card.id}" data-hover-side="right" draggable="${canDrag?'true':'false'}" title="${esc(card.name)}${compatible?'':' — Not compatible'}"><img src="${card.image}" alt="${esc(card.name)}">${quantity>0?`<span class="quantity-badge library-quantity-badge">×${quantity}</span>`:''}${reviewButton(card.id)}</article>`}
function renderLibrary(){
  const root=$('cardLibrary'),scrollTop=root.scrollTop,cards=filteredCards();$('resultCount').textContent=cards.length;root.innerHTML=cards.map(libraryCardHtml).join('');root.scrollTop=scrollTop;
  root.querySelectorAll('[data-library-card]').forEach(tile=>{
    const id=tile.dataset.libraryCard;
    tile.addEventListener('click',event=>{if(event.target.closest('.review-button'))return;addMainCard(id)});
    tile.addEventListener('contextmenu',event=>{event.preventDefault();removeMainCard(id)});
    tile.addEventListener('dragstart',event=>{const card=state.byId.get(id),quantity=Number(state.deck[id]||0);if(isMobileMainDeck()||!cardCompatible(card)||quantity>=copyLimit(card)||countDeck()>=MAIN_DECK_WORKSPACE_LIMIT){event.preventDefault();return}hideHover();event.dataTransfer.setData('text/grandis-card-id',id);event.dataTransfer.effectAllowed='copy'});
  });
  bindReviewButtons(root);bindHoverPreviews(root);
}
function addMainCard(id){
  const card=state.byId.get(id);if(!card)return;if(!cardCompatible(card)){toast('This card is not compatible with the selected Heroes');return}
  const current=Number(state.deck[id]||0),limit=copyLimit(card);if(countDeck()>=MAIN_DECK_WORKSPACE_LIMIT){toast(`Main Deck workspace already contains ${MAIN_DECK_WORKSPACE_LIMIT} cards`);return}if(current>=limit){toast(`Maximum ${limit} cop${limit===1?'y':'ies'} reached`);return}
  state.deck[id]=current+1;renderLibrary();renderMainDeck();updateTabs();
}
function removeMainCard(id){const current=Number(state.deck[id]||0);if(current<=0)return;if(current===1)delete state.deck[id];else state.deck[id]=current-1;renderLibrary();renderMainDeck();updateTabs()}
function locateCardInLibrary(id){
  const root=$('cardLibrary');
  const findTile=()=>Array.from(root.querySelectorAll('[data-library-card]')).find(tile=>tile.dataset.libraryCard===id);
  let tile=findTile();
  if(!tile){
    const fresh=defaultFilterSet(''),key='all';fresh.pool=selectedProgressions().length>0?'available':'all';state.filters=fresh;state.filterSets[key]=fresh;syncFilterControls();renderLibrary();
    tile=findTile();
    toast('Filters reset to locate this card');
  }
  if(!tile)return;
  tile.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
  tile.classList.remove('located-card');void tile.offsetWidth;tile.classList.add('located-card');
  clearTimeout(locateCardInLibrary.timer);locateCardInLibrary.timer=setTimeout(()=>tile.classList.remove('located-card'),1400);
}
function bindHoverPreviews(root){
  root.querySelectorAll('[data-hover-card-id]').forEach(element=>{
    element.addEventListener('mouseenter',()=>showHover(element.dataset.hoverCardId,element,element.dataset.hoverSide||'right'));
    element.addEventListener('mouseleave',hideHover);
  });
}
function showHover(cardId,anchor,preferredSide='right'){
  if(window.innerWidth<=760||document.querySelector('dialog[open]'))return;
  const card=cardById(cardId),box=$('hoverCardZoom'),image=$('hoverCardZoomImage');if(!card||!anchor||!box||!image)return;
  image.src=card.image;image.alt=`${card.name} preview`;box.hidden=false;box.classList.add('is-visible');box.setAttribute('aria-hidden','false');
  const rect=anchor.getBoundingClientRect(),previewRect=box.getBoundingClientRect(),width=previewRect.width||250,height=previewRect.height||350;
  // Fixed horizontal placement is based on PANEL boundaries, never on the hovered tile.
  // The entire hovered column remains unobstructed. Vertical placement follows that tile.
  const library=document.querySelector('.main-view .library-panel')?.getBoundingClientRect();
  const deck=document.querySelector('.main-view .main-deck-panel')?.getBoundingClientRect();
  if(!library||!deck)return;
  const x=preferredSide==='left'?library.right-width:deck.left;
  let y=rect.top+(rect.height-height)/2;
  y=Math.max(8,Math.min(y,Math.max(8,window.innerHeight-height-8)));
  box.dataset.side=preferredSide;box.style.transform=`translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
}
function hideHover(){const box=$('hoverCardZoom');if(!box)return;box.classList.remove('is-visible');box.hidden=true;box.style.transform='translate3d(-9999px,-9999px,0)';box.setAttribute('aria-hidden','true')}
function mobileDeckMeta(card){const type=card.family==='Skill'?`${card.classGroup} • ${card.classification}`:card.classification||card.family,mana=card.cost&&card.cost!=='No Mana cost'?` • ${card.cost}`:'';return `${type}${mana}`}
function mobileDeckGroupHtml(family,entries){const label=family==='Skill'?'Skills':family==='Event'?'Events':'Items',cards=entries.filter(entry=>entry.card.family===family);if(!cards.length)return '';return `<section class="mobile-main-group" data-mobile-family="${family}"><h3>${label}<span>${cards.reduce((sum,entry)=>sum+entry.quantity,0)}</span></h3><div class="mobile-main-list">${cards.map(({card,quantity})=>`<article class="mobile-deck-row" data-mobile-deck-card="${card.id}"><button class="mobile-deck-thumb" type="button" data-review-id="${card.id}" aria-label="Preview ${esc(card.name)}"><img src="${card.image}" alt=""></button><div class="mobile-card-info"><strong>${esc(card.name)}</strong><small>${esc(mobileDeckMeta(card))}</small></div><button class="mobile-qty-control" type="button" data-mobile-remove="${card.id}" aria-label="Remove one ${esc(card.name)}">−</button><span class="mobile-main-qty">${quantity}</span><button class="mobile-qty-control" type="button" data-mobile-add="${card.id}" ${quantity>=copyLimit(card)||countDeck()>=MAIN_DECK_WORKSPACE_LIMIT?'disabled':''} aria-label="Add one ${esc(card.name)}">+</button></article>`).join('')}</div></section>`}
function renderMainDeck(){hideHover();
  const root=$('deckGrid'),scrollTop=root.scrollTop,entries=Object.entries(state.deck).filter(([,qty])=>qty>0).map(([id,quantity])=>({card:state.byId.get(id),quantity})).filter(item=>item.card).sort(mainDeckSort),mobile=isMobileMainDeck();
  root.classList.toggle('mobile-deck-list',mobile);
  if(mobile){
    root.innerHTML=['Skill','Event','Item'].map(family=>mobileDeckGroupHtml(family,entries)).join('');
    root.querySelectorAll('[data-mobile-remove]').forEach(button=>button.addEventListener('click',()=>removeMainCard(button.dataset.mobileRemove)));
    root.querySelectorAll('[data-mobile-add]').forEach(button=>button.addEventListener('click',()=>addMainCard(button.dataset.mobileAdd)));
  }else{
    root.innerHTML=entries.map(({card,quantity})=>`<article class="deck-card" data-deck-card="${card.id}" data-hover-card-id="${card.id}" data-hover-side="left" draggable="true" title="${esc(card.name)}"><img src="${card.image}" alt="${esc(card.name)}"><div class="deck-qty-bar"><button type="button" class="deck-qty-step" data-deck-remove="${card.id}" aria-label="Remove one ${esc(card.name)}">−</button><span class="deck-qty-value" aria-label="${quantity} copies">×${quantity}</span><button type="button" class="deck-qty-step" data-deck-add="${card.id}" ${quantity>=copyLimit(card)||countDeck()>=MAIN_DECK_WORKSPACE_LIMIT?'disabled':''} aria-label="Add one ${esc(card.name)}">+</button></div></article>`).join('');
    root.querySelectorAll('[data-deck-card]').forEach(tile=>{const id=tile.dataset.deckCard;tile.addEventListener('click',event=>{if(event.target.closest('.deck-qty-step'))return;openCardReview(id)});tile.addEventListener('contextmenu',event=>event.preventDefault());tile.addEventListener('dragstart',event=>{if(event.target.closest('.deck-qty-step')){event.preventDefault();return}hideHover();event.dataTransfer.setData('text/grandis-remove-card-id',id);event.dataTransfer.effectAllowed='move';tile.classList.add('dragging')});tile.addEventListener('dragend',()=>{tile.classList.remove('dragging');document.querySelector('.library-panel')?.classList.remove('drag-remove-ready')})});
  }
  root.querySelectorAll('[data-deck-add]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();addMainCard(button.dataset.deckAdd)}));
  root.querySelectorAll('[data-deck-remove]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();removeMainCard(button.dataset.deckRemove)}));
  root.scrollTop=scrollTop;bindReviewButtons(root);bindHoverPreviews(root); // Main Deck hover is shown over the LEFT library panel; clicking the card opens Review.

  const total=countDeck();$('deckCount').textContent=total;$('mainTabCount').textContent=`${total} / ${MAIN_DECK_LEGAL_LIMIT}`;$('skillCount').textContent=familyCount('Skill');$('eventCount').textContent=familyCount('Event');$('itemCount').textContent=familyCount('Item');renderSkillClassTooltip();
  const valid=validationIssues().length===0;
  $('deckValidation').textContent=valid?'Deck Valid':'Deck Invalid';
  $('deckValidation').classList.toggle('valid',valid);$('deckValidation').classList.toggle('invalid',!valid);$('deckValidation').title='Season 0 · Shard Deck: '+s0Draft().shard_deck.map(x=>x.quantity+' × '+(x.kind==='MANA'?'Mana':x.class_name+' Class')).join(', ');
  const exportButton=$('exportJson');if(exportButton){exportButton.disabled=!valid;exportButton.title=valid?'Export valid 50-card Season 0 deck':'Export requires exactly 50 cards and a valid deck';}
  $('emptyDeck').hidden=entries.length>0;
  s0Persist();
}
function renderMain(){updateFilterStates();renderLibrary();renderMainDeck();updateTabs()}

function reviewEyebrow(card){if(card.family==='Hero')return 'HERO NAME';if(card.family==='Skill')return 'SKILL NAME';if(card.family==='Event')return 'EVENT NAME';if(card.family==='Item')return 'ITEM NAME';if(card.family==='LegacyModeDefinition')return 'LEGACY NAME';return 'CARD NAME'}
function reviewType(card){return card.family==='LegacyModeDefinition'?'Legacy Card':card.family==='Skill'?card.classification:card.family}
function reviewCost(card){return card.cost&&card.cost!=='No Mana cost'?card.cost:'—'}
function reviewManaValue(card){const cost=String(card?.cost||'').trim();if(!cost||cost==='No Mana cost')return '—';if(cost.includes(':'))return cost.replace(/\s*[·•]\s*/g,' • ');const simple=cost.match(/^(\d+)\s*Mana$/i);return simple?simple[1]:cost}
function labeledRowName(label='',prefix=''){const clean=String(label).replace(new RegExp(`^${prefix}\\s*[—-]?\\s*`,'i'),'').trim();return clean||prefix}
function romanRank(value){return ({1:'I',2:'II',3:'III'})[Number(value||1)]||String(value||'—')}
function rankUpBonusText(rank){const value=Number(rank||1);if(value===2)return 'After Rank Up, draw 2 cards and gain +1 Mana Regen.';if(value===3)return 'After Rank Up, draw 3 cards and gain +1 Mana Regen.';return ''}
function heroExpValue(rank){return ({1:'—',2:'300',3:'700'})[Number(rank||1)]||'—'}
function rowClassRank(label=''){const match=String(label).match(/^(.+?)\s*\((Rank\s+[IVX]+)\)\s*$/i);return match?{className:match[1].trim(),rank:match[2].replace(/^rank/i,'Rank')}:{className:String(label).replace(/\s*[—-].*$/,'').trim(),rank:'—'}}
function metricDamageType(card,row={},label=''){if(!['DAMAGE','BLOCK'].includes(label))return '';const primary=label==='DAMAGE'?String(row.damage_text||row.text||card.classification||''):String(row.effect_text||row.text||row.damage_text||'');const hasPhysical=/\bPhysical\b/i.test(primary),hasMagical=/\bMagical\b/i.test(primary);if(hasPhysical&&hasMagical)return 'Physical / Magical';if(hasPhysical)return 'Physical';if(hasMagical)return 'Magical';return ''}
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
function skillEffectText(row={},metric=null){let effect=String(row.effect_text||row.text||'').trim();if(!metric)return effect||String(row.damage_text||'—').trim()||'—';if(/^\s*[+-]?\d+\s*$/.test(effect)&&/^(?:PHYSICAL|MAGICAL) DAMAGE$/.test(metric.label))return `Deal ${metric.value} ${metric.label==='PHYSICAL DAMAGE'?'Physical':'Magical'} damage.`;if(/DAMAGE$/.test(metric.label)&&metric.label!=='DAMAGE REDUCTION')effect=effect.replace(/^(?:Deal|Inflict)\s+[+-]?\d+[^.]*?damage\.\s*/i,'').trim();else if(metric.label==='DAMAGE REDUCTION')effect=effect.replace(/^Block\s+[+-]?\d+[^.]*?damage[^.]*\.\s*/i,'').trim();else if(metric.label==='HEALING DONE')effect=effect.replace(/^(?:Heal|Restore)[^.]*?[+-]?\d+[^.]*\.\s*/i,'').trim();return effect||'—'}
function itemClassText(card){const classes=Array.isArray(card.requiredBaseClasses)?card.requiredBaseClasses.filter(Boolean):[];return classes.length?classes.join(' • '):'All Classes'}
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
const rows=card.rows?.length?card.rows:[{label:'Effect',text:card.text}];if(card.family==='Skill'){const isUltimate=Boolean(card.ultimate?.isUltimate),effectRows=rows.map((row,index)=>{const parsed=rowClassRank(row.label),metric=effectMetric(card,row),rankText=isUltimate&&/Rank\s+III/i.test(parsed.rank)&&index===rows.length-1?`Ultimate ${parsed.rank}`:parsed.rank,effectText=skillEffectText(row,metric),rankClass=isUltimate&&/^Ultimate\s+Rank\s+III$/i.test(rankText)?' class="ultimate-rank"':'';if(metric)return `<div class="review-effect-row has-metric"><div class="review-effect-class"><span>CLASS</span><strong>${esc(parsed.className||card.classGroup||'—')}</strong></div><div class="review-effect-rank"><span>RANK</span><strong${rankClass}>${esc(rankText)}</strong></div><div class="review-effect-metric"><span>${esc(metric.label)}</span><strong>${esc(metric.value)}</strong>${metric.damageType?`<small class="review-metric-type">${esc(metric.damageType)}</small>`:''}</div><div class="review-effect-info"><span>SKILL EFFECT</span><p>${esc(effectText)}</p></div></div>`;return `<div class="review-effect-row no-metric"><div class="review-effect-class"><span>CLASS</span><strong>${esc(parsed.className||card.classGroup||'—')}</strong></div><div class="review-effect-rank"><span>RANK</span><strong${rankClass}>${esc(rankText)}</strong></div><div class="review-effect-info full-span"><span>SKILL EFFECT</span><p>${esc(effectText)}</p></div></div>`}).join(''),rules=isUltimate&&card.ultimate?.owner?`<div class="review-ultimate-rules"><span>ULTIMATE RULES</span><p>${esc(/\bcan use this card\b/i.test(String(card.ultimate.owner))?card.ultimate.owner:`Only ${card.ultimate.owner} can use this card or Tribute it for EXP.`)}</p></div>`:'';$('reviewRows').innerHTML=effectRows+rules}else if(card.family==='Item'){const effect=rows.map(row=>row.effect_text||row.text||row.damage_text||'').filter(Boolean).join(' ');$('reviewRows').innerHTML=`<div class="review-effect-row item-effect-row no-metric"><div><span>CLASS</span><strong>${esc(itemClassText(card))}</strong></div><div><span>RANK</span><strong>All Ranks</strong></div><div class="review-effect-info full-span"><span>ITEM EFFECT</span><p>${esc(effect||'—')}</p></div></div>`}else if(card.family==='Event'){const effect=rows.map(row=>row.effect_text||row.text||row.damage_text||'').filter(Boolean).join(' ');$('reviewRows').innerHTML=`<div class="review-generic-row review-large-effect"><span>EVENT EFFECT</span><p>${esc(effect||'—')}</p></div>`}else if(card.family==='LegacyModeDefinition'){const effect=rows.map(row=>row.effect_text||row.text||row.damage_text||'').filter(Boolean).join(' ');$('reviewRows').innerHTML=`<div class="review-generic-row"><span>LEGACY ABILITY</span><p>${esc(effect||'—')}</p></div>${card.rules?`<div class="review-generic-row legacy-rules-row"><span>RULES</span><p>${esc(card.rules)}</p></div>`:''}`}else{$('reviewRows').innerHTML=rows.map(row=>`<div class="review-generic-row"><span>${esc(String(row.label||'CARD EFFECT').toUpperCase())}</span><p>${esc(row.text||row.effect_text||row.damage_text||'—')}</p></div>`).join('')}}
function openCardReview(cardId){
  const card=cardById(cardId);if(!card)return;const dialog=$('cardReviewDialog');dialog.dataset.reviewKind=card.family==='Hero'?'hero':card.family==='Skill'?'skill':card.family==='Item'?'item':card.family==='Event'?'event':card.family==='LegacyModeDefinition'?'legacy':'standard';$('reviewTitle').textContent=card.name;$('reviewEyebrow').textContent=reviewEyebrow(card);$('reviewArt').src=card.image;$('reviewArt').alt=card.name;if(card.family==='Hero'){heroReviewHtml(card);window.GL_S0_REVIEW_CLARITY?.enhanceHero(card,$('reviewRows'));}else {standardReviewHtml(card);window.GL_S0_REVIEW_CLARITY?.enhance(card,$('reviewRows'));}
  const progression=state.progressionByHeroId.get(card.id),box=$('reviewProgression');if(progression){box.hidden=false;$('reviewProgressionCards').innerHTML=progression.cardIds.map(id=>{const hero=cardById(id);return `<button class="review-progression-card ${id===card.id?'active':''}" type="button" data-review-rank-id="${id}"><img src="${hero.image}" alt="${esc(hero.name)}"></button>`}).join('');document.querySelectorAll('[data-review-rank-id]').forEach(button=>button.addEventListener('click',()=>openCardReview(button.dataset.reviewRankId)))}else{box.hidden=true;$('reviewProgressionCards').innerHTML=''}
  if(!dialog.open)dialog.showModal();
  dialog.querySelector('.review-card')?.scrollTo(0,0);
}
function bindReviewButtons(root){root.querySelectorAll('[data-review-id]').forEach(button=>{if(button.dataset.bound)return;button.dataset.bound='1';button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openCardReview(button.dataset.reviewId)})})}

function legacyReferenceSort(a,b){
  const familyOrder=card=>card.family==='Hero'?0:card.family==='LegacyModeDefinition'?1:2;
  const familyDiff=familyOrder(a)-familyOrder(b);if(familyDiff)return familyDiff;
  return idSort(a,b);
}
function legacyReferenceCardHtml(card){return `<article class="legacy-reference-card-tile" title="${esc(card.name)}"><img src="${card.image}" alt="${esc(card.name)}">${reviewButton(card.id)}</article>`}
function renderLegacyReferenceLibrary(){
  const cards=state.legacyCards.slice().sort(legacyReferenceSort),root=$('legacyReferenceGrid');if(!root)return;
  $('legacyReferenceCount').textContent=cards.length;root.innerHTML=cards.map(legacyReferenceCardHtml).join('');bindReviewButtons(root);
}
function openLegacyReferenceLibrary(){const dialog=$('legacyReferenceDialog');renderLegacyReferenceLibrary();if(dialog&&!dialog.open)dialog.showModal()}

function mainDeckViewCardHtml(card,quantity){return `<article class="legacy-reference-card-tile" title="${esc(card.name)}"><img src="${card.image}" alt="${esc(card.name)}"><span class="quantity-badge main-deck-view-quantity">×${quantity}</span>${reviewButton(card.id)}</article>`}
function renderMainDeckView(){
  const root=$('mainDeckViewGrid');if(!root)return;
  const entries=Object.entries(state.deck).filter(([,qty])=>Number(qty)>0).map(([id,quantity])=>({card:state.byId.get(id),quantity:Number(quantity)})).filter(item=>item.card).sort(mainDeckSort);
  const total=countDeck(),valid=validationIssues().length===0;
  $('mainDeckViewCount').textContent=total;
  $('mainDeckViewValidation').textContent=valid?'Deck Valid':'Deck Invalid';
  $('mainDeckViewValidation').classList.toggle('valid',valid);$('mainDeckViewValidation').classList.toggle('invalid',!valid);
  root.innerHTML=entries.map(({card,quantity})=>mainDeckViewCardHtml(card,quantity)).join('');
  $('mainDeckViewEmpty').hidden=entries.length>0;
  bindReviewButtons(root);
}
function openMainDeckView(){const dialog=$('mainDeckViewDialog');renderMainDeckView();if(dialog&&!dialog.open)dialog.showModal()}

function validationIssues(){return s0Validation().errors;}
function oldValidationIssues(){
  const issues=[];if(!heroFormationComplete())issues.push('Select three Hero progressions.');if(!legacyUniqueComplete())issues.push('Choose three unique Legacy Cards.');if(legacyCardCount()!==12)issues.push(`Legacy Deck must contain 12 cards (currently ${legacyCardCount()}).`);
  const incompatible=incompatibleDeckEntries();if(incompatible.length)issues.push(`${incompatible.reduce((sum,item)=>sum+item.quantity,0)} Main Deck card(s) are incompatible with the selected Heroes.`);for(const [id,quantity] of Object.entries(state.deck)){const card=state.byId.get(id);if(!card)issues.push(`Unknown card ID: ${id}.`);else if(quantity>copyLimit(card))issues.push(`${card.name} exceeds its copy limit.`)}return issues;
}
function askConfirm(options){return window.GL_S0_MODAL.askConfirm(options,esc)}

function blankDeck(){state.deck={};state.slots=[emptySlot(),emptySlot(),emptySlot()];state.rankView=1;$('deckName').value='New Deck';resetAllFilterSets();setTab('legacy');renderLegacy();renderMain()}
function normalizeImportedDeck(data){
  data=s0ImportPayload(data);
  const deck={};const entries=Array.isArray(data.main_deck)?data.main_deck:Array.isArray(data.mainDeck)?data.mainDeck:[];for(const item of entries){const id=item.card_id||item.cardId||item.id,card=state.byId.get(id),quantity=Number(item.quantity??item.qty??1);if(card&&Number.isFinite(quantity)&&quantity>0)deck[id]=Math.floor(quantity)}
  let rawSlots=(data.legacy_deck_package_slots||data.side_deck_package_slots||data.legacySlots||[]).slice(0,3).map(slot=>({progressionId:slot.progression||slot.progressionId||'',legacyId:slot.legacy||slot.legacyId||''}));while(rawSlots.length<3)rawSlots.push(emptySlot());
  const formation=data.default_formation||data.formation||{},ordered=[];for(const position of POSITIONS){const heroId=formation[position]||formation[position.toLowerCase()]||'',match=rawSlots.find(slot=>state.progressionById.get(slot.progressionId)?.cardIds[0]===heroId&&!ordered.includes(slot));if(match)ordered.push(match)}rawSlots.forEach(slot=>{if(!ordered.includes(slot))ordered.push(slot)});const slots=ordered.slice(0,3),used=new Set();slots.forEach((slot,index)=>{if(!state.progressionById.has(slot.progressionId)){slots[index]=emptySlot();return}const compatible=compatibleLegacies(slot.progressionId,index,slots);if(!slot.legacyId||used.has(slot.legacyId)||!state.legacyById.has(slot.legacyId))slot.legacyId=data.imported_from_s1?'':(compatible.find(card=>!used.has(card.id))?.id||'');if(slot.legacyId)used.add(slot.legacyId)});return {name:data.deck_name||data.deckName||'Imported Deck',deck,slots};
}
function applyDeck(normalized){state.deck={...normalized.deck};state.slots=clone(normalized.slots);$('deckName').value=normalized.name||'New Deck';state.rankView=1;resetAllFilterSets();setTab('legacy');renderLegacy();renderMain()}
function starterCover(starter,index){const centerHero=starter.default_formation?.CENTER||starter.default_formation?.center;const slots=starter.legacy_deck_package_slots||starter.side_deck_package_slots||[];const middle=slots[1]?.progression;const progressionId=centerHero||middle||slots[0]?.progression;return state.progressionById.get(progressionId)?.coverImage||state.legacyById.get(progressionId)?.image||''}
function renderStarterDialog(){
  const root=$('starterList');
  root.innerHTML=window.GL_S0_MODAL.starterMarkup(state.starters,state.progressionById,starterCover,esc);
  root.querySelectorAll('[data-starter-index]').forEach(button=>button.addEventListener('click',()=>{applyDeck(normalizeImportedDeck(state.starters[Number(button.dataset.starterIndex)]));$('starterDialog').close();toast('Starter Deck loaded')}));
}

async function openStarter(){if(isDeckDirty()){const ok=await askConfirm({eyebrow:'LOAD STARTER',title:'Replace the current deck?',message:'Loading a Starter replaces the current Legacy Deck, Main Deck, and deck name.',okLabel:'CONTINUE',danger:true});if(!ok)return}$('starterDialog').showModal()}
async function clearDeck(){if(!isDeckDirty()){blankDeck();return}const ok=await askConfirm({eyebrow:'CLEAR DECK',title:'Clear the current deck?',message:'This removes every selected Hero, Legacy, and Main Deck card.',okLabel:'CLEAR DECK',danger:true});if(ok){blankDeck();toast('Deck cleared')}}
async function importDeckFile(file){
  try{
    const original=JSON.parse(await file.text());let data=original;
    const converter=window.GL_S1_TO_S0_IMPORT;
    if(converter?.isSeason1(original)){
      const migration=converter.migrate(original,window.GL_DECK_BUILDER_DATA),report=migration.summary;
      const details=migration.issues.slice(0,100).map(item=>({label:`${item.kind}: ${item.name}`,value:`×${item.quantity} — ${item.reason}`}));
      if(migration.issues.length>100)details.push({label:'More skipped entries',value:String(migration.issues.length-100)});
      migration.copyLimitWarnings.forEach(label=>details.push({label:'Over copy limit',value:label}));
      const accepted=await askConfirm({eyebrow:'SEASON 1 → SEASON 0',title:'Review migrated cards before loading',
        message:`<b>${report.matched}</b> of <b>${report.source}</b> Main Deck copies matched by name; <b>${report.skipped}</b> skipped. ${report.heroMatched} Hero progressions and ${report.legacyMatched} Legacies matched. The draft may contain over 50 cards; the 50-card legality rule still applies. Unmatched names are listed below. This replaces the current draft only if you confirm. Your original JSON stays unchanged.`,
        list:details,okLabel:'IMPORT MATCHED CARDS'});
      if(!accepted)return;
      data={...migration.deck,imported_from_s1:true};
    }
    applyDeck(normalizeImportedDeck(data));toast('Deck imported');
  }catch(error){await askConfirm({eyebrow:'IMPORT ERROR',title:'Could not import this deck',message:esc(error.message||String(error)),okLabel:'CLOSE'})}
  finally{$('jsonFileInput').value=''}
}

function expandedLegacy(){const output=[];state.slots.forEach((slot,index)=>{const progression=state.progressionById.get(slot.progressionId),legacy=state.legacyById.get(slot.legacyId);if(!progression)return;const packageId=`CUSTOM-SLOT-${index+1}`,packageName=`${progression.name}${legacy?` + ${legacy.name}`:''}`;progression.cardIds.forEach(id=>{const card=state.legacyById.get(id);if(card)output.push({card_id:id,card_name:card.name,card_type:'Hero',package_id:packageId,package_name:packageName})});if(legacy)output.push({card_id:legacy.id,card_name:legacy.name,card_type:'Legacy',package_id:packageId,package_name:packageName})});return output}
function exportObject(){return s0Export('style2');}
function downloadJson(object){const safe=(object.deck_name||'Grandis_Legacy_Deck').replace(/[^a-z0-9_-]+/gi,'_').replace(/^_+|_+$/g,'')||'Grandis_Legacy_Deck',blob=new Blob([JSON.stringify(object,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`${safe}.json`;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function exportDeck(){const object=exportObject();if(!object.is_valid||countDeck()!==MAIN_DECK_LEGAL_LIMIT){toast('Export requires a valid deck with exactly 50 cards');return}downloadJson(object);toast('Deck exported')}

function resetFilters(){const family=state.filters.family,fresh=defaultFilterSet(family),key=family||'all';fresh.pool=selectedProgressions().length?'available':'all';state.filters=fresh;state.filterSets[key]=fresh;syncFilterControls();renderLibrary()}
function bindStaticEvents(){
  document.querySelectorAll('.tab-button').forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));$('rankPrev').addEventListener('click',()=>cycleRank(-1));$('rankNext').addEventListener('click',()=>cycleRank(1));
  $('heroPickerClose').addEventListener('click',()=>$('heroPickerDialog').close());$('heroPickerDialog').addEventListener('click',event=>{if(event.target===$('heroPickerDialog'))$('heroPickerDialog').close()});$('starterClose').addEventListener('click',()=>$('starterDialog').close());$('starterDialog').addEventListener('click',event=>{if(event.target===$('starterDialog'))$('starterDialog').close()});$('legacyReferenceOpen').addEventListener('click',openLegacyReferenceLibrary);$('legacyReferenceClose').addEventListener('click',()=>$('legacyReferenceDialog').close());$('legacyReferenceDialog').addEventListener('click',event=>{if(event.target===$('legacyReferenceDialog'))$('legacyReferenceDialog').close()});$('mainDeckViewOpen').addEventListener('click',openMainDeckView);$('mainDeckViewClose').addEventListener('click',()=>$('mainDeckViewDialog').close());$('mainDeckViewDialog').addEventListener('click',event=>{if(event.target===$('mainDeckViewDialog'))$('mainDeckViewDialog').close()});
  $('reviewClose').addEventListener('click',()=>$('cardReviewDialog').close());$('cardReviewDialog').addEventListener('click',event=>{if(event.target===$('cardReviewDialog'))$('cardReviewDialog').close()});
  $('loadStarter').addEventListener('click',openStarter);$('clearDeck').addEventListener('click',clearDeck);$('importJson').addEventListener('click',()=>$('jsonFileInput').click());$('jsonFileInput').addEventListener('change',event=>{const file=event.target.files?.[0];if(file)importDeckFile(file)});$('exportJson').addEventListener('click',exportDeck);$('deckName').addEventListener('input',s0Persist);
  $('filterToggle').addEventListener('click',()=>{const panel=$('filterPanel'),open=panel.hidden;panel.hidden=!open;$('filterToggle').setAttribute('aria-expanded',String(open));$('filterToggle').classList.toggle('open',open);const icon=$('filterChevron');if(icon)icon.src=`../assets/ui/chevron-${open?'up':'down'}.png`});
  $('searchInput').addEventListener('input',event=>{state.filters.search=event.target.value;renderLibrary()});$('familyFilter').addEventListener('change',event=>switchFilterFamily(event.target.value));$('classFilter').addEventListener('change',event=>{state.filters.className=event.target.value;renderLibrary()});$('skillTypeFilter').addEventListener('change',event=>{state.filters.skillType=event.target.value;renderLibrary()});
  $('keywordFilter').addEventListener('change',event=>{state.filters.keyword=event.target.value;renderLibrary()});
  $('effectFilter').addEventListener('change',event=>{state.filters.effect=event.target.value;renderLibrary()});
  $('cardPoolSelect').addEventListener('change',event=>{state.filters.pool=event.target.value;updateFilterStates();renderLibrary()});['manaMin','manaMax'].forEach(id=>$(id).addEventListener('input',()=>{updateManaRange();renderLibrary()}));$('resetFilters').addEventListener('click',resetFilters);
  const drop=$('deckGrid');drop.addEventListener('dragover',event=>{if(isMobileMainDeck()||!Array.from(event.dataTransfer.types||[]).includes('text/grandis-card-id'))return;event.preventDefault();event.dataTransfer.dropEffect='copy';drop.classList.add('drag-over')});drop.addEventListener('dragleave',event=>{if(!drop.contains(event.relatedTarget))drop.classList.remove('drag-over')});drop.addEventListener('drop',event=>{const id=event.dataTransfer.getData('text/grandis-card-id');if(!id)return;event.preventDefault();drop.classList.remove('drag-over');addMainCard(id)});
  const libraryDrop=document.querySelector('.library-panel');libraryDrop.addEventListener('dragover',event=>{if(isMobileMainDeck()||!Array.from(event.dataTransfer.types||[]).includes('text/grandis-remove-card-id'))return;event.preventDefault();event.dataTransfer.dropEffect='move';libraryDrop.classList.add('drag-remove-ready')});libraryDrop.addEventListener('dragleave',event=>{if(!libraryDrop.contains(event.relatedTarget))libraryDrop.classList.remove('drag-remove-ready')});libraryDrop.addEventListener('drop',event=>{const id=event.dataTransfer.getData('text/grandis-remove-card-id');if(!id)return;event.preventDefault();libraryDrop.classList.remove('drag-remove-ready');removeMainCard(id)});
  window.addEventListener('resize',()=>{const mobile=isMobileMainDeck();if(mobile===state.mobileMainDeck)return;state.mobileMainDeck=mobile;renderLibrary();renderMainDeck()});
}



/* DB-11: one logical deck shared across Style 1 and Style 2, including file:// navigation. */
let s0LastWorkspaceJson='';
function s0Persist(){
 if(!window.GL_S0_CAN_PERSIST)return;
 try{
  const value=JSON.stringify(s0Export('shared'));
  localStorage.setItem('grandis-season0-deck-draft-v2',value);
  s0LastWorkspaceJson=value;
 }catch(e){/* file:// privacy restrictions must not block cross-style handoff */}
}
function s0Restore(serialized){
 let restored=false,fromHandoff=false;
 try{
  const incoming=serialized===undefined?window.GL_S0_SHARED_WORKSPACE?.takeIncoming():null;
  fromHandoff=Boolean(incoming);
  const saved=serialized!==undefined?serialized:(!fromHandoff?localStorage.getItem('grandis-season0-deck-draft-v2'):null);
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
 // Store the received handoff in destination's own storage for refresh/reopening.
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
 try{shard_deck=window.GL_S0_LEGALITY.deriveShardDeck(main_deck,window.GL_S0_CATALOG)}
 catch(e){shard_deck=[{kind:'MANA',quantity:12}];}
 return {main_deck,legacy_packages,shard_deck};
}
function s0Validation(){
 const draft=s0Draft(),v=window.GL_S0_LEGALITY.validateDeck(draft,window.GL_S0_CATALOG,{policy:'starter_safe'});
 const ultClasses=new Set(draft.main_deck.filter(row=>window.GL_S0_CATALOG.cards.some(c=>c.card_id===row.card_id&&c.is_ultimate)).map(row=>row.card_id.split('-')[1]));
 if(ultClasses.size>3){v.errors.push('More than 3 Ultimate Class Shards are required');v.ok=false;}
 return v;
}
function s0Export(style){
 const deck=s0Draft(),validation=s0Validation(),name=$('deckName').value.trim()||'New Deck';
 return {schema:'GL-SEASON0-DECK-DRAFT-1',schema_version:'GL-SEASON0-DECK-DRAFT-1',
  source_authority:'R3.4-MainDeck-Rulebook-v2.7.8',rulebook:'v2.7.8',season:'S0',builder_version:'1.37.0',style,
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
  window.GL_DECK_BUILDER_STYLE2_RELEASE='1.46.0-S0';
  const data=window.GL_DECK_BUILDER_DATA;if(!data)throw new Error('Deck Builder data failed to load.');
  const keywordChoices=[...new Set((data.mainCards||[]).flatMap(card=>card.keywords||[]))].filter(Boolean).sort((a,b)=>a.localeCompare(b));
  $('keywordFilter').innerHTML='<option value="">All Keywords</option>'+keywordChoices.map(keyword=>`<option value="${esc(keyword)}">${esc(keyword)}</option>`).join('');
  const effectChoices=window.GL_S0_EFFECT_FILTER.choices(data.mainCards||[]);
  $('effectFilter').innerHTML='<option value="">All Effects</option>'+effectChoices.map(tag=>`<option value="${esc(tag)}">${esc(tag)}</option>`).join('');
  if(window.GL_S0_SHARED_WORKSPACE){
    window.GL_S0_SHARED_WORKSPACE.bindNavigation(()=>s0Export('shared'),s0Persist);
    window.GL_S0_SHARED_WORKSPACE.bindLiveSync(s0Restore,()=>s0LastWorkspaceJson);
  }else document.querySelectorAll('.style-switch-link').forEach(link=>link.addEventListener('click',s0Persist));
  state.cards=data.mainCards||[];state.byId=new Map(state.cards.map(card=>[card.id,card]));state.legacyCards=data.legacyCards||[];state.legacyById=new Map(state.legacyCards.map(card=>[card.id,card]));state.sourcePackages=data.legacyPackages||[];state.starters=data.starters||[];buildProgressions();bindStaticEvents();renderStarterDialog();blankDeck();syncFilterControls();s0Restore();
})();
