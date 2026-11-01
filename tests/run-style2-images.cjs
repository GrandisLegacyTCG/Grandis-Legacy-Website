 'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function load(style){
 const window={GL_DECK_BUILDER_BASE:style==='style2'?'../':''};
 const ctx=vm.createContext({window});
 vm.runInContext(fs.readFileSync(path.join(root,'js/data-s0.js'),'utf8'),ctx,{filename:'js/data-s0.js'});
 return window.GL_DECK_BUILDER_DATA;
}
for(const style of ['style1','style2']){
 const data=load(style);
 const pageRoot=path.join(root,style==='style2'?'style-2':'.');
 const all=[...data.mainCards,...data.legacyCards];
 assert.equal(all.length,242,'card catalog unchanged');
 let checked=0;
 for(const card of all){
   assert(!card.image.includes('{S0_IMAGE_BASE}'),`unresolved placeholder ${card.id}`);
   const abs=path.resolve(pageRoot,card.image);
   assert(fs.existsSync(abs),`${style} missing artwork ${card.id}: ${card.image} -> ${abs}`);
   assert(abs.startsWith(path.join(root,'assets/season0/cards')+path.sep),`${style} wrong art root for ${card.id}`);
   const buffer=fs.readFileSync(abs);assert.equal(buffer.toString('hex',0,4),'52494646',`${card.id} not a valid RIFF/WebP container`);
   checked++;
 }
 for(const prog of data.legacyPackages){
   const file=path.resolve(pageRoot,prog.coverImage);
   assert(fs.existsSync(file),`${style} missing ${prog.name} cover at ${prog.coverImage}`);
 }
 assert.equal(data.starters.length,0,'starter presets must stay absent');
 console.log(`PASS ${style}: ${checked}/242 card images, ${data.legacyPackages.length} progression covers, no starters`);
}
