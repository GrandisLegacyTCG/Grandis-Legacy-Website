/* v1.58: cross-style routing preserves shared deck without URL fragment on HTTPS. */
const assert=require('assert/strict');
const fs=require('fs');const vm=require('vm');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
function test(protocol,from,relative,target){
  let handler,href=relative,persisted=0;
  const link={getAttribute(name){assert.equal(name,'href');return relative},set href(v){href=v},get href(){return href},addEventListener(name,cb){if(name==='click')handler=cb}};
  const location={protocol,origin:protocol==='file:'?'null':'https://grandislegacytcg.web.id',href:from,hash:'',pathname:new URL(from).pathname,search:''};
  const doc={baseURI:from,querySelectorAll:()=>[link]};
  const w={location,document:doc};
  const ctx={window:w,URL,encodeURIComponent,decodeURIComponent,JSON,console};
  vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(ROOT,'js/s0-shared-workspace.js'),'utf8'),ctx);
  w.GL_S0_SHARED_WORKSPACE.bindNavigation(()=>({deck_name:'Saved Deck',main_deck:[{card_id:'S0-ARC-001',quantity:2}],legacy_deck_package_slots:[]}),()=>persisted++);
  handler({button:0});
  assert.equal(persisted,1);
  if(protocol==='file:')assert.ok(href.includes('#gl-s0-workspace='),href);
  else assert.equal(href,target);
}
test('https:','https://grandislegacytcg.web.id/','style-2/','/style-2/');
test('https:','https://grandislegacytcg.web.id/style-2/','../','/');
test('file:','file:///tmp/Grandis/index.html','style-2/');
for (const file of ['index.html','style-2/index.html']){
 const text=fs.readFileSync(path.join(ROOT,file),'utf8');
 assert.match(text,/data-app-unavailable="true" hidden aria-label="Grandis Legacy applications"/);
 assert.match(text,/s0-review-clarity\.js\?v=1\.58/);
 assert.match(text,/app-s0\.js\?v=1\.58/);
}
const ali=fs.readFileSync(path.join(ROOT,'style-1/index.html'),'utf8');
assert.match(ali,/location\.replace\(new URL\("\.\.\/"/);
console.log('PASS v1.58 canonical navigation, same-origin handoff without fragment, offline fallback, hidden apps and cache busting.');
