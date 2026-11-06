/* v1.32.4 — Text-based card-effect discovery for the Deck Builder, NOT gameplay rules.
   Uses only printed Season 0 card effect text (including Item/Event), not names,
   keywords, IDs, or unrelated quoted card names. Conservative curated tags. */
(function(root){
 'use strict';
 const TERMS=[
   ['Poison',/\b(?:inflict|remove|has|with|affected by|suffers?|suffering|gain|gains|give|gives|apply|applies)\s+(?:(?:a|the|\d+|\w+?)\s+){0,3}poison\b|\bpoison\s+(?:status|duration|damage)\b/i],
   ['Bleed',/\b(?:inflict|remove|has|with|affected by|suffers?|suffering|gain|gains|give|gives|apply|applies)\s+(?:(?:a|the|\d+|\w+?)\s+){0,3}bleed\b|\bbleed\s+(?:status|duration|damage)\b/i],
   ['Swap',/\b(?:swap|exchange)\b/i],
   ['Stun',/\b(?:inflict|remove|has|with|gain|gains|apply|applies)\s+(?:\w+\s+){0,3}stun\b|\bstun\s+(?:status|duration)\b/i],
   ['Sleep',/\b(?:inflict|remove|has|with|gain|gains|apply|applies)\s+(?:\w+\s+){0,3}sleep\b|\bsleep\s+(?:status|duration)\b/i],
   ['Burn',/\b(?:inflict|remove|has|with|gain|gains|apply|applies)\s+(?:\w+\s+){0,3}burn\b|\bburn\s+(?:status|duration|damage)\b/i],
   ['Freeze',/\b(?:inflict|remove|has|with|gain|gains|apply|applies)\s+(?:\w+\s+){0,3}freeze\b|\bfreeze\s+(?:status|duration)\b/i],
   ['Draw',/\bdraw\s+(?:up\s+to\s+)?(?:a|one|two|three|\d+)\s+cards?\b/i],
   ['Discard',/\bdiscard\s+(?:a|one|two|three|\d+|all|up\s+to)\b/i],
 ];
 function text(card){
   // row.effect_text is printed body text; fallback to card.text for generic Items/Events.
   return [card?.text||'',...(card?.rows||[]).map(x=>x.effect_text||x.text||'')].join(' | ');
 }
 function tags(card){const body=text(card);return TERMS.filter(([,pattern])=>pattern.test(body)).map(([name])=>name)}
 function choices(cards){return TERMS.map(([name])=>name).filter(name=>(cards||[]).some(c=>tags(c).includes(name)))}
 root.GL_S0_EFFECT_FILTER={tags,choices};
})(window);
