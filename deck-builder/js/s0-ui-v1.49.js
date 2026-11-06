/* Review detail columns are measured across every Rank row, not evenly divided. */
(function(){
  'use strict';
  const rows=document.getElementById('reviewRows');if(!rows)return;
  // Actual DOM measurement (including letter spacing and the loaded font)
  // avoids rounding-induced wraps such as "Ultimate Rank III".
  function width(node){
    if(!node)return 0;
    const style=getComputedStyle(node);
    const probe=document.createElement('span');
    probe.textContent=node.textContent.trim();
    probe.style.cssText='position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;display:inline-block;white-space:nowrap;max-width:none;';
    probe.style.font=style.font;
    probe.style.letterSpacing=style.letterSpacing;
    document.body.appendChild(probe);
    const actual=probe.getBoundingClientRect().width;
    probe.remove();
    return Math.ceil(actual)+2;
  }
  function align(){
    const blocks=[...rows.querySelectorAll('.review-effect-row')];
    const classes=blocks.map(block=>block.querySelector('.review-effect-class')).filter(Boolean);
    const ranks=blocks.map(block=>block.querySelector('.review-effect-rank')).filter(Boolean);
    const widest=list=>Math.max(64,...list.map(group=>Math.max(width(group.querySelector('span')),width(group.querySelector('strong')))));
    // Column boundary is a fixed 38px from the longest piece of text.
    rows.style.setProperty('--gl-review-class-width',`${widest(classes)+38}px`);
    rows.style.setProperty('--gl-review-rank-width',`${widest(ranks)+76}px`);
  }
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;align()});
  });
  observer.observe(rows,{childList:true});
  document.fonts?.ready.then(align).catch(()=>{});
})();
