/* Season 0 shared Deck Builder workspace.
 * A deck draft lives only for the current tab/session, never between closed sessions.
 * Same-tab Style 1/2 navigation keeps the draft; file:// uses a one-time fragment.
 */
(function(root){'use strict';
 const STORAGE_KEY='grandis-season0-deck-session-v1';
 // Clear the old persistent autosave so a previous version cannot revive a closed deck.
 try{root.localStorage.removeItem('grandis-season0-deck-draft-v2');}catch(e){}
 const FRAGMENT_PREFIX='#gl-s0-workspace=';
 function portable(exported){
  return {v:1,n:String(exported.deck_name||exported.name||'New Deck').slice(0,80),
   m:(exported.main_deck||[]).map(x=>[x.card_id,Number(x.quantity)]),
   s:(exported.legacy_deck_package_slots||[]).slice(0,3).map(x=>[x.progression||'',x.legacy||''])};
 }
 function encode(exported){return FRAGMENT_PREFIX+encodeURIComponent(JSON.stringify(portable(exported)));}
 function parse(fragment){
  if(!String(fragment||'').startsWith(FRAGMENT_PREFIX))return null;
  try{
   const body=fragment.slice(FRAGMENT_PREFIX.length);
   if(body.length>16000)throw Error('Draft fragment too long');
   const raw=JSON.parse(decodeURIComponent(body));
   if(raw.v!==1||!Array.isArray(raw.m)||!Array.isArray(raw.s)||raw.m.length>187||raw.s.length>3)throw Error('Invalid shared draft');
   if(raw.m.some(x=>!Array.isArray(x)||typeof x[0]!=='string'||x[0].length>96||!Number.isInteger(x[1])||x[1]<1||x[1]>60))throw Error('Invalid Main Deck entries');
   if(raw.s.some(x=>!Array.isArray(x)||x.length!==2||x.some(v=>typeof v!=='string'||v.length>96)))throw Error('Invalid Legacy Deck slots');
   const total=raw.m.reduce((sum,x)=>sum+x[1],0);
   if(total>60)throw Error('Oversized draft');
   return {schema:'GL-SEASON0-DECK-DRAFT-1',season:'S0',style:'shared',
     deck_name:typeof raw.n==='string'?raw.n.slice(0,80):'New Deck',
     main_deck:raw.m.map(x=>({card_id:x[0],quantity:x[1]})),
     legacy_deck_package_slots:raw.s.map(x=>({progression:x[0],legacy:x[1]}))};
  }catch(err){console.warn('Invalid cross-style workspace:',err.message);return null;}
 }
 function takeIncoming(){
  const incoming=parse(root.location.hash);
  if(incoming){
   try{root.history.replaceState(root.history.state,'',root.location.pathname+root.location.search);}catch(e){}
  }
  return incoming;
 }
 function bindNavigation(getDraft,persist){
  root.document.querySelectorAll('.style-switch-link').forEach(link=>{
   function prepare(){
    try{
     persist();
     const url=new URL(link.getAttribute('href'),root.document.baseURI);
     // HTTP(S): both styles have shared origin/sessionStorage. Avoid long, ugly
     // #gl-s0-workspace fragments (and URLs containing deck details).
     // file:// or cross-origin: retain the portable fallback handoff.
     if(root.location.protocol==='file:'){
       // Browsers do not consistently open index.html when a file:// link
       // targets a directory. Use the actual HTML file for local launches.
       if(url.pathname.endsWith('/'))url.pathname+='index.html';
       // file:// storage isolation differs by browser; pass the draft and
       // immediately clear its fragment when the destination initializes.
       url.hash=encode(getDraft());
       link.href=url.href;
     }else if(url.origin!==root.location.origin){
       url.hash=encode(getDraft());
       link.href=url.href;
     }else{
       // Keep short canonical URLs on the published website.
       url.hash='';
       link.href=url.pathname+url.search;
     }
    }catch(e){console.warn('Could not prepare style change:',e.message);}
   }
   link.addEventListener('click',prepare,{capture:true});
   link.addEventListener('auxclick',event=>{if(event.button===1)prepare();},{capture:true});
  });
 }
 function bindLiveSync(restore,getLastSeen){
  root.addEventListener('storage',event=>{
   if(event.key!==STORAGE_KEY||!event.newValue||event.newValue===getLastSeen())return;
   restore(event.newValue);
  });
  const refresh=()=>{
   try{const saved=root.sessionStorage.getItem(STORAGE_KEY);if(saved&&saved!==getLastSeen())restore(saved);}catch(e){}
  };
  root.addEventListener('focus',refresh);
  root.addEventListener('pageshow',event=>{if(event.persisted)refresh();});
 }
 root.GL_S0_SHARED_WORKSPACE={STORAGE_KEY,encode,parse,takeIncoming,bindNavigation,bindLiveSync};
})(window);
