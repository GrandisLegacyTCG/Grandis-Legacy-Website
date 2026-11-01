"""v1.49 cross-style UI smoke test. Inline mount sidesteps restricted file/http browser navigation.
Tests the real HTML, CSS and application JS; card image URLs are not fetched in the sandbox.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re
R=Path(__file__).resolve().parents[1]
COMMON=['js/season0-catalog.js','js/season0-legality.browser.js','js/data-s0.js',
        'style-2/js/s0-starters-v1.46.js','js/s1-to-s0-import.js','js/s0-availability.js',
        'js/s0-effect-filter.js','js/s0-review-clarity.js','js/s0-shared-workspace.js',
        'js/s0-subtype-filter.js','js/s0-ui-v1.49.js']
CSS1=['css/app.css','css/s0-enhancements-v1.32.2.css','css/s0-shared-header-review.css',
      'css/s0-part7-revision-v1.36.css','css/s0-part7-revision-v1.38.css',
      'css/s0-part7-revision-v1.39.css','css/s0-review-v1.41.css','css/s0-review-v1.42.css',
      'css/s0-review-v1.43.css','css/s0-review-v1.44.css']
# Chronological order is significant, particularly the v1.46 style-2 overlay.
CSS2=['style-2/css/app-v1.31.css','style-2/css/s0-enhancements-v1.32.2.css',
      'css/s0-shared-header-review.css','css/s0-part7-revision-v1.36.css',
      'css/s0-part7-revision-v1.38.css','css/s0-part7-revision-v1.39.css',
      'style-2/css/s0-style2-quantities-v1.36.css','css/s0-review-v1.41.css',
      'css/s0-review-v1.42.css','css/s0-review-v1.43.css','css/s0-review-v1.44.css',
      'style-2/css/s0-style2-compact-v1.46.css']
def mount(page, style):
    html=(R/('index.html' if style=='root' else 'style-1/index.html' if style=='style1' else 'style-2/index.html')).read_text()
    html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html,flags=re.I)
    html=re.sub(r'<link\b[^>]*>','',html,flags=re.I)
    css=(CSS2 if style=='style2' else CSS1)+['css/s0-ui-v1.49.css']
    html=html.replace('</head>',''.join(f'<style>{(R/f).read_text()}</style>' for f in css)+'''<script>
    window.__TEST_STORAGE=Object.create(null);
    Object.defineProperty(window,'localStorage',{configurable:true,value:{
    getItem:k=>window.__TEST_STORAGE[k]||null,setItem:(k,v)=>window.__TEST_STORAGE[k]=v,
    removeItem:k=>delete window.__TEST_STORAGE[k]}});
    </script></head>''')
    scripts=COMMON+[('style-2/js/app-s0.js' if style=='style2' else 'js/app-s0.js')]
    html=html.replace('</body>','<script>window.GL_DECK_BUILDER_BASE='+json.dumps('../' if style=='style2' else '')+';</script>'+''.join('<script>'+(R/f).read_text()+'</script>' for f in scripts)+'</body>')
    page.set_content(html,wait_until='commit')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for style in ('root','style1','style2'):
      for width,height in ((1600,900),(390,844)):
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        mount(page,style)
        assert page.evaluate('state.cards.length')==187,(style,'missing source cards')
        assert not errors,(style,errors)
        if style!='style2':
          if page.locator('#newDeckDialog').evaluate('(e)=>e.open'):
            page.locator('#createBlankDeck').click()
          page.locator('[data-library-tab="skills"]').click()
          page.locator('#filterToggle').click()
        else:
          page.locator('#mainTabButton').click()
          page.locator('#filterToggle').click()
          page.locator('#familyFilter').select_option('Skill')
        opts=page.locator('#skillTypeFilter option').all_text_contents()
        assert opts==['All Subtypes','Physical Attack','Magical Attack','Area Attack',
                      'Casting Attack','Defense','Tactical','Support'],(style,opts)
        for subtype,n in [('Physical Attack',50),('Magical Attack',28),('Area Attack',14),
                          ('Casting Attack',4),('Defense',27),('Tactical',23),('Support',9)]:
          page.locator('#skillTypeFilter').select_option(subtype)
          assert page.evaluate('filteredCards().length' if style=='style2' else 'filteredMainCards().length')==n,(style,subtype)
        page.locator('#skillTypeFilter').select_option('')
        if style=='style2':
          for family,options in [('Event',['All Subtypes','Normal Event','Special Event']),
                                 ('Item',['All Subtypes','Consumable','Protection','Utility','Buff'])]:
            page.locator('#familyFilter').select_option(family)
            assert page.locator('#skillTypeFilter option').all_text_contents()==options
          page.locator('#familyFilter').select_option('Skill')
        else:
          page.locator('[data-library-tab="events"]').click()
          assert page.locator('#skillTypeFilter option').all_text_contents()==['All Subtypes','Normal Event','Special Event']
          page.locator('[data-library-tab="items"]').click()
          assert page.locator('#skillTypeFilter option').all_text_contents()==['All Subtypes','Consumable','Protection','Utility','Buff']
        # Deck View modal is functional and has the same geometry across styles.
        page.locator('#mainDeckViewOpen').click()
        assert page.locator('#mainDeckViewDialog').evaluate('(e)=>e.open')
        box=page.locator('#mainDeckViewDialog').bounding_box()
        assert 0<=box['x']<=width and box['width']<=width and box['height']<=height,(style,box)
        page.evaluate("""()=>{
          state.deck=Object.fromEntries(state.cards.slice(0,20).map(card=>[card.id,1]));
          renderMainDeckView();
        }""")
        assert page.locator('#mainDeckViewGrid>.legacy-reference-card-tile').count()==20
        if width==1600:
          cells=page.locator('#mainDeckViewGrid>.legacy-reference-card-tile').all()
          first_y=cells[0].bounding_box()['y']
          first_row=[cell.bounding_box() for cell in cells if abs(cell.bounding_box()['y']-first_y)<3]
          assert len(first_row)>=7,(style,'too few modal columns',len(first_row))
          grid=page.locator('#mainDeckViewGrid').bounding_box()
          gutter=(grid['x']+grid['width'])-(first_row[-1]['x']+first_row[-1]['width'])
          assert 0<=gutter<40,(style,'excessive right gutter',gutter)
        page.locator('#mainDeckViewGrid>.legacy-reference-card-tile>.review-button').first.click()
        assert page.locator('#cardReviewDialog').evaluate('(e)=>e.open')
        page.locator('#reviewClose').click()
        page.locator('#mainDeckViewClose').click()
        # Card-review font and keywords, rendered for both styles.
        page.evaluate("()=>openCardReview(state.cards.find(c=>c.name==='Blooming Harmony').id)")
        title=page.locator('#reviewTitle').evaluate('e=>getComputedStyle(e).fontSize')
        stat=page.locator('#reviewStats .review-summary-item strong').first.evaluate('e=>getComputedStyle(e).fontSize')
        kw=page.locator('.review-keyword-description').first.evaluate('e=>[getComputedStyle(e).fontSize,getComputedStyle(e).color]')
        assert (title,stat,kw)==('20px','16px',['12px','rgb(172, 172, 174)']),(style,title,stat,kw)
        review_box=page.locator('#cardReviewDialog .review-card').bounding_box()
        header_box=page.locator('#cardReviewDialog .review-header').bounding_box()
        close_box=page.locator('#reviewClose').bounding_box()
        assert abs((header_box['y']+header_box['height']/2)-(close_box['y']+close_box['height']/2))<=1.5,(style,'review X not centered',header_box,close_box)
        assert not errors,(style,errors)
        print('PASS',style,width,'x',height,'filter categories, subtype results, modal, fonts',flush=True)
        page.close()
    browser.close()
