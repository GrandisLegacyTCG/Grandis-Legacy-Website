/* Season 0 deck-validation reasons; shared by both visual styles. */
(function(root){'use strict';
 let active=null,popup=null,pinned=false,touchPending=false;
 const escape=s=>String(s||'');
 function hide(){
  if(active)active.removeAttribute('aria-describedby');
  if(popup)popup.remove();
  popup=null;active=null;pinned=false;
 }
 function reasons(el){
  try{const list=JSON.parse(el?.dataset?.glDeckErrors||'[]');return Array.isArray(list)?list:[]}
  catch(e){return []}
 }
 function show(el,stick=false){
  const items=reasons(el);if(!items.length)return hide();
  if(active===el&&popup&&pinned&&!stick)return;
  hide();active=el;pinned=stick;
  popup=document.createElement('div');popup.id='gl-deck-validation-tooltip';popup.className='gl-deck-validation-tooltip';popup.setAttribute('role','tooltip');
  const heading=document.createElement('strong');heading.textContent='Why this deck is not valid';popup.appendChild(heading);
  const list=document.createElement('ul');
  items.forEach(message=>{const li=document.createElement('li');li.textContent=escape(message);list.appendChild(li)});
  popup.appendChild(list);
  // A modal dialog is in the top layer; append inside it so the tooltip stays visible.
  (el.closest('dialog[open]')||document.body).appendChild(popup);
  const anchor=el.getBoundingClientRect(),r=popup.getBoundingClientRect();
  const x=Math.min(Math.max(10,anchor.right-r.width),Math.max(10,root.innerWidth-r.width-10));
  const top=anchor.bottom+10+r.height<=root.innerHeight-8?anchor.bottom+8:Math.max(8,anchor.top-r.height-8);
  popup.style.left=x+'px';popup.style.top=top+'px';el.setAttribute('aria-describedby',popup.id);
 }
 function findBadge(target){return target?.closest?.('[data-gl-deck-errors]')||null}
 document.addEventListener('pointerover',e=>{
  if(e.pointerType!=='mouse')return;
  const el=findBadge(e.target);
  if(el&&(!active||active!==el))show(el);
 });
 document.addEventListener('pointerout',e=>{
  if(e.pointerType!=='mouse'||!active||pinned)return;
  const from=findBadge(e.target),to=findBadge(e.relatedTarget);
  if(from===active&&to!==active&&!popup?.contains(e.relatedTarget))hide();
  if(popup?.contains(e.target)&&!popup.contains(e.relatedTarget)&&!active.contains(e.relatedTarget))hide();
 });
 document.addEventListener('pointerdown',e=>{touchPending=e.pointerType==='touch'||e.pointerType==='pen';},{capture:true});
 document.addEventListener('focusin',e=>{
  const el=findBadge(e.target);if(el&&!touchPending)show(el);
 });
 document.addEventListener('focusout',e=>{if(!pinned&&active&&!active.contains(e.relatedTarget))hide()});
 document.addEventListener('click',e=>{
  const el=findBadge(e.target);
  if(!el){if(pinned)hide();touchPending=false;return}
  if(!reasons(el).length){touchPending=false;return}
  if(active===el&&pinned)hide();else show(el,true);
  touchPending=false;
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape')hide();
  if((e.key==='Enter'||e.key===' ')&&findBadge(e.target)){
   e.preventDefault();const el=findBadge(e.target);if(active===el&&pinned)hide();else show(el,true);
  }
 });
 root.addEventListener('resize',hide);
 root.addEventListener('scroll',e=>{if(!pinned&&active)hide()},{capture:true,passive:true});
 function setBadge(el,report){
  if(!el)return;
  const list=Array.isArray(report?.errors)?report.errors:[];
  if(active===el)hide();
  if(!list.length){
   delete el.dataset.glDeckErrors;el.removeAttribute('tabindex');el.removeAttribute('role');
   el.removeAttribute('aria-label');el.removeAttribute('aria-haspopup');el.removeAttribute('title');
   return;
  }
  el.dataset.glDeckErrors=JSON.stringify(list);
  el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-haspopup','true');
  el.setAttribute('aria-label',el.textContent.trim()+'. '+list.join(' '));
  el.removeAttribute('title'); // Avoid a duplicate native tooltip over the designed popup.
 }
 root.GL_S0_VALIDATION_TIP={setBadge,hide};
})(window);
