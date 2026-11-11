/* Deck Builder v1.64: same filter relevance rules in Style 1 and Style 2.
   Never erase stored filter values when controls are temporarily disabled. */
(function(root){'use strict';
 const FAMILIES=new Set(['Skill','Event','Item']);
 function getManaCost(card){
  const cost=String(card?.cost||'');
  if(/no mana cost/i.test(cost))return 0;
  const values=[...cost.matchAll(/(\d+)\s*Mana/gi)].map(match=>Number(match[1]));
  return values.length?Math.min(...values):0;
 }
 function control(id,enabled,reason){
  const field=document.getElementById(id);if(!field)return;
  field.classList.toggle('disabled',!enabled);
  field.classList.toggle('gl-filter-unavailable',!enabled);
  field.setAttribute('aria-disabled',String(!enabled));
  field.title=enabled?'':(reason||'Not applicable to this card category');
  field.querySelectorAll('select,input,button').forEach(el=>{
   el.disabled=!enabled;
   if(el.tagName==='SELECT'||el.tagName==='BUTTON')el.setAttribute('aria-disabled',String(!enabled));
  });
 }
 function apply({family='',mode='',cards=[]}={}){
  const isLegacy=mode==='heroes'||mode==='legacies';
  const main=FAMILIES.has(family)||(!isLegacy&&!family);
  const relevant=(cards||[]).filter(c=>FAMILIES.has(c.family)&&(!family||c.family===family));
  const classEnabled=isLegacy||family==='Skill';
  const subtypeEnabled=!isLegacy&&FAMILIES.has(family)&&root.GL_S0_SUBTYPE_FILTER.choices(family).some(value=>relevant.some(c=>c.classification===value));
  const keywordEnabled=main&&relevant.some(c=>(c.keywords||[]).length>0);
  const effectEnabled=main&&relevant.some(c=>root.GL_S0_EFFECT_FILTER.tags(c).length>0);
  const manaValues=new Set(relevant.map(getManaCost));
  // Item cards have no printed Mana Cost; keep the global range, but disable
  // its interaction until the user switches to a relevant card type.
  const manaEnabled=main&&manaValues.size>1&&[...manaValues].some(v=>v>0);
  const poolEnabled=main&&relevant.length>0;
  control('classField',classEnabled);
  control('skillTypeField',subtypeEnabled);
  control('keywordField',keywordEnabled);
  control('effectField',effectEnabled);
  control('manaField',manaEnabled);
  // Style 2 uses a class instead of an id for its Mana Cost field.
  const manaField=document.querySelector('.gl-filter-grid-style2 > .mana-filter');
  if(manaField){
   manaField.classList.toggle('disabled',!manaEnabled);
   manaField.classList.toggle('gl-filter-unavailable',!manaEnabled);
   manaField.setAttribute('aria-disabled',String(!manaEnabled));
   manaField.title=manaEnabled?'':'No adjustable Mana Cost for this card type';
   manaField.querySelectorAll('input').forEach(el=>el.disabled=!manaEnabled);
  }
  control('cardPoolField',poolEnabled);
  return {classEnabled,subtypeEnabled,keywordEnabled,effectEnabled,manaEnabled,poolEnabled};
 }
 root.GL_S0_FILTER_RELEVANCE={apply};
})(window);
