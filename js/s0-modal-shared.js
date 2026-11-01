/* Grandis Legacy Season 0 — shared modal presentation and actions, v1.52.
   Both Deck Builder styles consume these helpers; only navigation differs. */
(function(global){
  'use strict';
  function starterMarkup(starters, progressionById, cover, escapeHtml){
    return starters.map((starter,index)=>{
      const raw=String(starter.deck_name||`Starter ${index+1}`).replace(/^Starter\s*\d+\s*[-–—]\s*/i,'');
      const name=raw.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\//g,' / ');
      const classes=(starter.legacy_deck_package_slots||[])
        .map(slot=>progressionById.get(slot.progression)?.baseClass).filter(Boolean).join(' • ');
      return `<button class="starter-option" type="button" data-starter-index="${index}"><span>STARTER ${index+1}</span><img src="${escapeHtml(cover(starter,index))}" alt=""><strong>${escapeHtml(name)}</strong><small>${escapeHtml(classes)}</small></button>`;
    }).join('');
  }
  function askConfirm(options,escapeHtml){
    const {eyebrow='CONFIRM',title,message,list=[],okLabel='OK',danger=false}=options;
    const get=id=>document.getElementById(id);
    return new Promise(resolve=>{
      const dialog=get('confirmDialog');
      const finish=accepted=>{if(dialog.open)dialog.close();cleanup();resolve(accepted)};
      const cleanup=()=>{
        get('confirmOk').onclick=null;get('confirmCancel').onclick=null;get('confirmClose').onclick=null;dialog.oncancel=null;
      };
      get('confirmEyebrow').textContent=eyebrow;
      get('confirmTitle').textContent=title||'Confirm action';
      get('confirmMessage').innerHTML=message||'';
      const details=get('confirmList');
      details.hidden=!list.length;
      details.innerHTML=list.map(item=>`<div class="confirm-item"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}</b></div>`).join('');
      get('confirmOk').textContent=okLabel;
      get('confirmOk').className=danger?'danger':'primary';
      get('confirmOk').onclick=()=>finish(true);
      get('confirmCancel').onclick=()=>finish(false);
      get('confirmClose').onclick=()=>finish(false);
      dialog.oncancel=event=>{event.preventDefault();finish(false)};
      if(!dialog.open)dialog.showModal();
    });
  }
  global.GL_S0_MODAL={starterMarkup,askConfirm};
})(window);
