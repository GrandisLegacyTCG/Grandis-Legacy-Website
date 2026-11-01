"""Part7: real localhost navigation, not only injected DOM harness."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import socket, subprocess, time
R=Path(__file__).resolve().parents[1]
with socket.socket() as sock:
 sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
server=subprocess.Popen(['python3','-m','http.server',str(port),'--bind','127.0.0.1'],cwd=R,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 time.sleep(.5)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  geom={}
  for rel in ['index.html','style-1/index.html','style-2/index.html']:
   page=browser.new_page(viewport={'width':1440,'height':900})
   errors=[];bad=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda resp:bad.append((resp.status,resp.url)) if resp.status>=400 else None)
   response=page.goto(f'http://127.0.0.1:{port}/{rel}',wait_until='load',timeout=15000)
   assert response.status==200,rel
   page.wait_for_function("typeof state !== 'undefined' && !!window.GL_S0_REVIEW_CLARITY && state.cards.length===187",timeout=15000)
   st=page.evaluate("() => ({main:Object.values(state.deck).reduce((a,b)=>a+b,0),slots:state.slots.map(x=>x.progressionId),open:document.querySelector('#newDeckDialog')?.open||false})")
   assert st['main']==0 and not any(st['slots']) and not st['open'],(rel,st)
   assert page.locator('#keywordFilter option[value="ALL ALLIES"]').count()==0,rel
   page.evaluate("openCardReview('S0-THF-009')")
   text=page.locator('#reviewRows').inner_text()
   assert 'Deal 90 Physical damage.' in text and 'CONDITION' in text,rel
   im=page.evaluate("() => ({src:document.querySelector('#reviewCardImage')?.getAttribute('src'),count:document.images.length})")
   geom[rel]=page.locator('.topbar').bounding_box()
   assert not errors and not bad,(rel,errors,bad[:6]);print('HTTP HOST PASS',rel,'header',geom[rel],'card image',im)
   page.close()
  assert geom['index.html']['height']==geom['style-2/index.html']['height'] and abs(geom['index.html']['width']-geom['style-2/index.html']['width'])<2
  browser.close()
 print('PASS localhost real browser 3/3')
finally:
 server.terminate();server.wait(timeout=10)
