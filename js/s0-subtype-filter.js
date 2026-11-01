/* Shared Season 0 card-subtype filter for both Deck Builder styles. */
(function(root){
  'use strict';
  const BY_FAMILY={
    Skill:['Physical Attack','Magical Attack','Area Attack','Casting Attack','Defense','Tactical','Support'],
    Event:['Normal Event','Special Event'],
    Item:['Consumable','Protection','Utility','Buff']
  };
  function choices(family){return (BY_FAMILY[family]||[]).slice()}
  function matches(card,subtype){return !subtype || String(card?.classification||'')===subtype}
  function fill(select,family,current=''){
    const choicesForFamily=choices(family);
    select.innerHTML='<option value="">All Subtypes</option>'+choicesForFamily.map(value=>{
      const escape=text=>String(text).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
      return `<option value="${escape(value)}">${escape(value)}</option>`;
    }).join('');
    select.value=choicesForFamily.includes(current)?current:'';
    return select.value;
  }
  root.GL_S0_SUBTYPE_FILTER={choices,matches,fill};
})(window);
