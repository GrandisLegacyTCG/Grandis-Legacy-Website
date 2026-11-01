'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'js/s0-shared-workspace.js'),'utf8');
function check(locationUrl, href, expectedPrefix, shouldHaveHandoff){
 const location=new URL(locationUrl);
 const events={};
 const a={href, getAttribute(n){return n==='href'?href:null;},addEventListener(n,fn){events[n]=fn;}};
 const doc={baseURI:location.href,querySelectorAll(){return[a];}};
 const mockWindow={location,document:doc,URL,console,
  addEventListener(){},history:{replaceState(){}},localStorage:{getItem(){return null;},setItem(){}}};
 vm.runInNewContext(script,{window:mockWindow,URL,console});
 mockWindow.GL_S0_SHARED_WORKSPACE.bindNavigation(()=>({deck_name:'Local Test',main_deck:[],legacy_deck_package_slots:[]}),()=>{});
 assert(events.click,'style-switch click handler should be installed');
 events.click();
 assert(a.href.startsWith(expectedPrefix),`${locationUrl} -> ${a.href}, expected ${expectedPrefix}`);
 assert.strictEqual(a.href.includes('#gl-s0-workspace='),shouldHaveHandoff,`fragment mismatch ${a.href}`);
 if(shouldHaveHandoff){
   const u=new URL(a.href);assert(u.pathname.endsWith('index.html'),`Local navigation must target HTML: ${u.pathname}`);
   mockWindow.location.hash=u.hash;
   const draft=mockWindow.GL_S0_SHARED_WORKSPACE.takeIncoming();
   assert.strictEqual(draft.deck_name,'Local Test');
 }
 console.log('PASS',locationUrl,'->',a.href.replace(/#.*$/,'').split('/').slice(-2).join('/'));
}
check('file:///D:/Steffen/Grandis%20Legacy/Deck%20Builder/Grandis_Legacy_Deck_Builder_v1.58_2026-11-01/index.html','style-2/','file:///D:/Steffen/Grandis%20Legacy/Deck%20Builder/Grandis_Legacy_Deck_Builder_v1.58_2026-11-01/style-2/index.html',true);
check('file:///D:/Steffen/Grandis%20Legacy/Deck%20Builder/Grandis_Legacy_Deck_Builder_v1.58_2026-11-01/style-2/index.html','../','file:///D:/Steffen/Grandis%20Legacy/Deck%20Builder/Grandis_Legacy_Deck_Builder_v1.58_2026-11-01/index.html',true);
check('https://grandislegacytcg.web.id/','style-2/','/style-2/',false);
check('https://grandislegacytcg.web.id/style-2/','../','/',false);
assert.strictEqual(fs.readFileSync(path.join(root,'CNAME'),'utf8').trim(),'grandislegacytcg.web.id');
assert(fs.existsSync(path.join(root,'.nojekyll')));
assert(fs.existsSync(path.join(root,'index.html')));
const legacy=fs.readFileSync(path.join(root,'style-1/index.html'),'utf8');
assert(legacy.includes("location.protocol === 'file:' ? '../index.html' : '../'"));
console.log('PASS root CNAME, .nojekyll, index.html, legacy local/host redirect');
