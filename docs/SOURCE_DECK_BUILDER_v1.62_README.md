> **v1.62 keyword/status display hotfix (no version increment):** Card Review keyword and Status explanations now follow official Player Rulebook v3.0 (2026-11-07), pp. 13–14. Updated **REFLECT**, **MANA STEAL**, and **Burn** wording; verified all other 13 Rulebook keywords and five Status descriptions remain exact. Both Style 1 and Style 2 use the same updated review helper. This is display text only: card artwork, card records, deck construction, gameplay logic, and OSA are unchanged. See `docs/HOTFIX_v1.62_RULEBOOK_V3_KEYWORD_STATUS.md`.

---

# Current release: Grandis Legacy Deck Builder v1.62 (2026-11-07)

Aligned eight Season 0 card artworks with supplied R3.5 sources: Poison Vial plus seven Thief Heroes. Corrected Poison Vial effect and printed class information in both Card Reviews. Grand Finale now renders its INVINCIBLE/Draw 3 shared effect once in both styles, retaining Bard 60 / Maestro 90, printed CONDITION and Ultimate RULES. The OSA archive is not modified. See `docs/RELEASE_NOTE_v1.62.md`.

---

# Current release: Grandis Legacy Deck Builder v1.61 (2026-11-07)

Style 2 Mobile Card Library and Main Deck collapse buttons now reuse `assets/ui/chevron-up.png` and `chevron-down.png` (the same existing icon set as FILTER); icons reflect expanded/collapsed state. No layout, card information, or gameplay changes. See `docs/RELEASE_NOTE_v1.61.md`.

---

# Current release: Grandis Legacy Deck Builder v1.60 (2026-11-06)

See `docs/RELEASE_NOTE_v1.60.md` for combined approved updates.

# Grandis Legacy Deck Builder v1.59 — Style 2 Mobile UX (6 November 2026)

**Baseline:** approved v1.58 Rulebook v2.9 Fix. On Style 2 mobile, Card Library and Main Deck now share a compact artwork/quantity grid, have independent minimize buttons, support tap-to-review without enlarge buttons, and Deck View displays 4–5 cards per row. Style 1 and desktop Style 2 are preserved; no gameplay/card-data changes. See `docs/RELEASE_NOTE_v1.59.md`.

---

**v1.58 review-only Rulebook v2.9 hotfix:** keyword/status descriptions now follow official Player Rulebook v2.9 (MANA BURN/STEAL unchanged), 15 Ultimate and 3 Special Event RULES footers match printed card artwork, and Ultimate RULES stroke removed; both styles. See `docs/HOTFIX_v1.58_RULEBOOK_V2.9_REVIEW.md`.

**v1.58 corrective patch:** includes root `CNAME` for `grandislegacytcg.web.id` and fixes `file://` Style 1/2 navigation. Keep this file alongside `index.html` and `.nojekyll` when deploying to the GitHub repository root. Details: `docs/HOTFIX_v1.58_GITHUB_AND_LOCAL_NAVIGATION.md`.

# Grandis Legacy Deck Builder v1.58 — Standalone Website Navigation + Hero Keyword Review (1 November 2026)

**Baseline:** v1.57. Site target: `grandislegacytcg.web.id`. Single app hosted at repository root, Style 1 `/`, Style 2 `/style-2/`. VS AI/PvP not yet launched and hidden; Hero Rank II/III RANGE keyword now displayed in review. See `docs/RELEASE_NOTE_v1.58.md`.

---

# Grandis Legacy Deck Builder v1.57 — Hero Artwork Fit (1 November 2026)

**Baseline:** v1.56 Hero Review Alignment Fix. **Status:** promoted after the v1.56 review changes.

- Hero Rank I, II and III continue sharing one popup height, header position and HERO LINEAGES footer position at the same viewport.
- Expand the artwork within the **middle content area** to the largest proportional size that fits before the HERO LINEAGES divider; keep a small clear gap, and do not add a Rank I scrollbar.
- Preserve the artwork's 5:7 proportions and the transparent (unframed) artwork area. The artwork width may use a slightly larger left column, while the popup itself stays unchanged.
- Long Rank II/III text still scrolls in the middle content area when required. On small stacked/mobile layouts, existing scrolling remains available.
- Styles 1 and 2 use the exact same Hero Review CSS. Font, other popup behavior, gameplay logic, card data, and illustrations are unchanged.

See `docs/RELEASE_NOTE_v1.57.md` for the implementation and verification scope.

---

# Grandis Legacy Deck Builder v1.56 — Review Layout Corrections (1 November 2026)

**Baseline:** latest v1.55 Hero Artwork Scroll Fix (including Legacy RULES hotfix). **Status:** awaiting designer approval.

- Hero Review popup width and normal Rank I height restored to v1.53, separately from artwork sizing. The artwork itself is 96% of its v1.53 width, with a proportional extra limit only for short viewports.
- Removed the decorative plate background, border and shadow around the Hero artwork while keeping the actual card image intact.
- Skill Review Class, Rank and metric columns measure the longest rendered text (including its actual font and letter spacing); values including **Ultimate Rank III** do not wrap. Preserve 38px padding on each side of dividers.
- The 16px padding before Hero Lineages, legacy RULES, Dual Class panel, keyword text, and all existing gameplay and typography remain unchanged. Changes apply equally to Style 1 and Style 2.
- The Hero Review scroll area still scrolls when long Rank II/III text cannot fit within the viewport; no information is clipped.

See `docs/RELEASE_NOTE_v1.56.md` for details.

---

> **v1.55 Hero Artwork scroll hotfix (1 November 2026, no version increment):** The previous 96% popup-width change did not reliably prevent scrolling on shorter/zoomed viewports. Hero artwork now scales independently to 96% normal width and further down only when viewport height requires it. No typography, non-Hero popup, card data, Legacy RULES, or dual-style behavior is altered. Longer Rank II/III text can still scroll when necessary.

> **v1.55 Legacy Review hotfix (1 November 2026, no version increment):** The ten Season 0 Legacy cards now display their printed **RULES** below LEGACY ABILITY in Card Review for both Style 1 and Style 2. The text is transcribed from the R3.2 Legacy card artworks. No other layout, font, gameplay, or card ability changes.

# Grandis Legacy Deck Builder v1.55 — Hero Review Sizing (1 November 2026)

**Baseline:** v1.54. **Scope:** shared Hero Review popup only in Style 1 and Style 2.

- Restored the approved **v1.53 Hero Review responsive behavior**; removed the v1.54 short-viewport artwork-height clamp.
- Hero Review desktop popup width is **96% of its v1.53 width**, with Hero card images scaled proportionally to approximately 96% of the v1.53 image size. Small mobile popup behavior is unchanged.
- Preserved 16px of bottom padding in the scrollable Hero Review content, between the last section (such as BONUS) and the HERO LINEAGES divider.
- The v1.54 Dual Class panel, keyword display, font sizes, Noto Sans, and card data remain unchanged.

See `docs/RELEASE_NOTE_v1.55.md` for details and QA.

---

# Grandis Legacy Deck Builder v1.54 — Card Review and Hero Review (1 November 2026)

**Baseline:** v1.53. **Scope:** shared Card/Hero Review only in Style 1 and Style 2.

- HERO NAME label weight 700; BUFF description shortened as requested.
- Keyword badges no longer use the pale outer stroke; their alignment is adjusted, and **Taunt** now shows BUFF and ALL OPPONENTS in their correct positions relative to the card's printed effect.
- Dual Class information is displayed as a separate warm-gray panel above Racial Traits, only for Dual Class Heroes.
- v1.54 introduced a short-height artwork clamp; this was superseded by the v1.55 sizing correction.
- No changes to card data, rules, main workspace, fonts, other dialogs, or Style 1's one-popup New Deck workflow.

See `docs/RELEASE_NOTE_v1.54.md` for details and QA.

---

# Grandis Legacy Deck Builder v1.53 — Style 1 New Deck: One Popup (1 November 2026)

**Baseline:** v1.52. **Scope:** Style 1 New Deck flow only.

- Restored the approved v1.51 **Choose how to begin** layout: **Blank Deck**, **Import JSON**, and **all five Starter Deck options** displayed in the same popup. Selecting a Starter now loads it directly; no secondary Starter popup.
- Starter information continues to use shared v1.52 markup/data for parity with Style 2.
- Style 2 retains its dedicated Starter popup, unchanged. All other v1.52 standardizations, including **Noto Sans**, borderless close X, Card Review, Deck View, Confirmation, and card data/logic are retained.

See `docs/RELEASE_NOTE_v1.53.md`.

---

# Grandis Legacy Deck Builder v1.52 — Shared popup parity (1 November 2026)

**Baseline:** v1.51. **Status:** READY FOR REVIEW. **Version format:** v1.52 (two components).

- **Card Review:** Style 1 is the layout/typography reference for both styles, including 20px title, aligned header/close, consistent Hero progression cards, effect text and all field spacing. Missing values show the same em dash (`—`). Compared the generated review content of all **242 Season 0 cards**; same semantic information across styles.
- **View Deck:** both use the Style 2 reference with the existing **Skills → Events → Items** ordering and common modal sizing, empty-state and scrollbar behavior. Card data, artwork, counters and deck validity are unchanged.
- **Confirmation:** both use the Style 2 presentation (24px heading, common body and button dimensions) and the more explicit Style 1 Hero-change wording. A shared confirmation helper keeps messages/actions consistent.
- **Starter Deck:** both use the same Style 2-derived dedicated Starter Deck popup with the same five choices and preview format. Style 1 still opens through its distinct **Choose How to Begin** screen; its Starter option now opens the common Starter popup instead of showing a separate starter layout.
- **Close X on all popups:** bare text symbol only, **no stroke, border, background or box**, center-aligned; hover changes text color, not its container. Page-level Style 1 and Style 2 navigation/design remain intentionally different.
- **QA:** `npm run check` and headless Chromium modal/content checks passed at widths **390, 900, 1600px** for both styles. Cross-style Card Review data parity: **242/242**. No horizontal page overflow in these viewport checks.

New shared files: `css/s0-modal-parity-v1.52.css`, `js/s0-modal-shared.js`. No Season 0 rules, card images, datasets, import/export formats or unrelated page typography were intentionally modified. A production deployment should receive final visual verification with live assets.

See `docs/RELEASE_NOTE_v1.52.md`.

---

# Grandis Legacy Deck Builder v1.51 — Deck View parity (31 October 2026)

**Baseline:** v1.50. **Status:** READY FOR REVIEW.

- Style 1 `View Deck` now uses the same card ordering as Style 2: **Skills → Events → Items**, sorted by Card ID within each category. Previously Style 1 sorted all categories by Card ID, so the two popups displayed mixed-family cards in different positions even though their CSS layout dimensions matched.
- Only Style 1 Deck View ordering and its JS cache version were changed. No changes to Noto Sans, typography, CSS, card data, interactions, artwork, or validation.

See `docs/RELEASE_NOTE_v1.51.md`.

---

# Grandis Legacy Deck Builder v1.50 — Layout Correction (31 October 2026)

**Baseline:** v1.49.2. **Release version:** v1.50 (two-part version numbering). **Status:** READY FOR REVIEW.

1. **Style 1 Mana Cost:** matches the compact inline layout of Style 2: the `0` and `9` values flank the slider horizontally, below the `MANA COST` and `0–9` label row. Effect dropdown, Mana Cost slider, and Reset button have matching vertical centerlines. The Mana Cost field still spans two columns; no slider/filter behavior changes.
2. **Responsive horizontal overflow:** removes the legacy fixed 1080px workspace width that caused horizontal scrolling at narrower desktop sizes. Style 1 switches its existing two-pane workspace to a vertically stacked layout below the width floor of the side-by-side panes (1124px). Desktop-sized fonts and existing mobile behavior remain unchanged. Style 2 also remains within the viewport.
3. **Style 2 Deck Name toolbar:** the four action buttons are aligned with the bottom and height of the Deck Name input, rather than centering against both the input and its label. Button text, font face, weight, color and borders are unchanged.

These changes are limited to markup positioning and an additional CSS override `css/s0-layout-v1.50.css`, loaded by the root, Style 1, and Style 2 entrypoints. Card records, artwork, deck rules, filtering semantics, Hero Selection structure, Review typography, and import/export code have not been changed. Latest live version is **v1.50**; older version numbers shown below refer only to historical changelog entries.

**QA:** automated Chromium viewport checks at 375, 500, 740, 768, 900, 1000, 1100, 1124, 1200, 1600, 1920 px for Style 1 and Style 2: no page horizontal overflow; Style 1 Effect/slider/Reset vertically aligned with inline 0/9 values; Style 2 all four action buttons share identical heights and bottom edges with Deck Name input. `npm run check` and `npm run check:ui:v149` passed; Noto Sans CSS declarations and font sizes remain the same. Browser harness mounts local HTML/CSS/JS inline, so normal deployment should still receive a final visual check with real artwork loaded.

See `docs/RELEASE_NOTE_v1.50.md`.

---

# Grandis Legacy Deck Builder v1.49.2 — 3 UI fixes (31 October 2026)

**Baseline:** v1.49.1. **Entrypoints:** root `index.html`, `style-1/index.html`, and `style-2/index.html` (all load the current fix). **Status:** READY FOR REVIEW.

1. Card Review dividers: 38px padding on **each** side (76px total), with dynamically measured Class/Rank column widths in both styles.
2. Style 1 Hero Selection: remove the v1.49.1 container-based stacking so desktop has three Hero ranks on the left and the info panel on the right, matching v1.48.0. Keep the exact current Noto Sans typography and a minimum 16px gap between Lineages and SELECT HERO; let the outer container grow to fit. Original mobile viewport behavior remains.
3. Style 1 Filter: vertically align the Effect dropdown and Mana Cost bar (and Reset); retain Mana Cost width and compact appearance. Style 2 filter unchanged.

Retains the Deck View, Condition border and Noto Sans fixes from v1.49.1. No gameplay, deck-construction rules, card assets, or import/export changes.

See `docs/RELEASE_NOTE_v1.49.2.md`.

---

# Grandis Legacy Deck Builder v1.49.1 — QA Hotfix (31 October 2026)

**Baseline:** v1.49.0. **Scope:** all active entrypoints (`index.html`, `style-1/index.html`, `style-2/index.html`). **Status: READY FOR REVIEW; not gameplay-locked.**

This release corrects five reported layout issues from v1.49.0: Deck View overlap (fixed-size non-overlapping tiles and reduced right scrollbar gap), Style 1 Mana Cost height/background, 38px Review column divider spacing, removal of Condition banner border, and responsive Hero selection. Both styles use exactly the same Deck View popup geometry.

**Verification:** `npm run check` passed; inline Chromium DOM QA at 1600×900, 1200×800, 900×760 and 740×900 for both styles found no page errors, no card overlaps, 15px final-card-to-scroll-area distance, and identical modal positioning across styles. Image files are unchanged. The test environment blocks file/localhost navigation; visual screenshots used inline CSS/JS plus a replacement artwork, so the ZIP still requires normal site review after deployment.

See `docs/RELEASE_NOTE_v1.49.1.md`. No gameplay rule, card catalog, art file, or save/export logic changes.

---

# Grandis Legacy Deck Builder v1.49.0 — UI consistency update (31 October 2026)

**Baseline:** v1.48.0. **Scope:** Style 1 (root `index.html` and `style-1/index.html`) and Style 2 (`style-2/index.html`). **Status: READY FOR REVIEW; not gameplay-locked.**

### Approved UI changes implemented

1. **Card Review:** title 20px; top metadata values (Type, Subtype, Mana Cost, EXP Tribute, etc.) 16px; Keyword/Status explanation text 12px, `#ACACAE`. Gold labels retain their prior size.
2. **Rank/metric dividers:** measure the widest Class/Rank value/label across Review rows; consistently position separators 14px after the widest text, rather than equal-width columns.
3. **Card Review close (X):** vertically centered in the header for both styles, including Hero Review.
4. **Noto Sans:** explicitly loaded from Google Fonts and declared for all UI controls/dialogs. Printed text inside card images is unchanged. Browser needs internet to download the font if not installed locally.
5. **Unnecessary hairline:** remove the extra topbar bottom border. Functional borders on cards/inputs/sections remain.
6. **Style 1 filter:** top row Subtype, Class, Keyword, Card Pool; bottom row Effect, 2-column Mana Cost, Reset Filters. Category still comes from the existing Heroes/Legacies/Skills/Events/Items tabs.
7. **Style 2 filter:** 4+4 grid: Type, Subtype, Class, Card Pool; Keyword, Effect, Mana Cost, Reset Filters. Replaces the two Card Pool buttons with one dropdown. Attack Style removed; actual attack subtypes are within Subtype, RANGE remains a Keyword. Both styles share the same classification taxonomy and filtering logic; Event and Item Subtype options change with Type.
8. **View Deck button in Style 1:** placed immediately to the left of Total Cards, preserving the Style 1 button treatment and keeping accordion semantics valid (no nested buttons).
9. **View Deck modal:** Style 1 and Style 2 share modal dimensions, alignment, card grid, scrollbar gutter, status and X-button header centering. Card preview remains functional.

### Verification and constraints

- `npm run check` — PASS (existing Season 0 syntax, card metadata, artwork references and logic tests).
- `npm run check:ui:v149` — PASS at 1600×900 and 390×844 in the root, Style 1, and Style 2 entrypoints; verifies dropdown contents and actual filtered counts, Card Review typography and close-button alignment, View Deck modal grid and card preview.
- Browser tests mount the real HTML/CSS/JS inline because this execution environment blocks direct `http://localhost` and `file://` navigation. Asset URLs therefore are not fetched in visual tests; original artwork/image files remain untouched in the ZIP.
- No changes to gameplay rules, card metadata, image assets, deck structure, copy limits, export, validation, or starter contents. Prior historic QA/source lock files remain as historic documents.

---

# Grandis Legacy Deck Builder v1.48.0 — Starter access & Style 2 Library spacing (30 October 2026)

- **Style 1:** Five supplied Starter Decks now available from **NEW DECK** on the actual root `index.html` entrypoint (and direct `style-1/index.html`), in user-provided order, with CENTER Rank I Hero art.
- **Style 2:** Four equal card columns fill the Library width; horizontal gaps are consistently 6px; incomplete last rows stay left-aligned. The 45:55 panel ratio, six Main Deck columns and existing compact controls remain.
- Only relevant entrypoint HTML and Style 2 Library CSS changed. No card/hero review, rules, card data/art, or builder logic changes.
- QA: `Grandis_Legacy_Deck_Builder_QA_v1.48.0_2026-10-30.md` (separate release attachment).

**Status: READY FOR REVIEW, NOT LOCKED.**

---

# Grandis Legacy Deck Builder v1.45.0 — Area Damage Review wording (30 October 2026)

**Scope: display-only Card Review fix in both Style 1 and Style 2.** Baseline v1.44.0.

- Corrected all numeric Area Attack Skill Effect previews: `Deal Area 50 Magical damage.` → `Deal 50 Area Magical damage.` (or Physical) in both styles, for all affected Class/Rank rows.
- Preserved subsequent clauses/keywords (e.g., Freeze, Stun, Poison, Bleed, HEAL, SURE HIT, MANA BURN).
- No changes to printed card wording, card data/figures, artwork, gameplay rules, Deck Builder mechanics, or Hero Review.
- Full regression report: `docs/qa/QA_Grandis_Legacy_Deck_Builder_v1.45.0_2026-10-30.md`.

**Status: READY FOR USER REVIEW (not LOCKED).**

---

# Grandis Legacy Deck Builder v1.44.0 — Artwork scale & visible Hero Lineage (30 October 2026)

**Scope: Card Review and Hero Review popup only.** Baseline v1.43.0; no changes to the Deck Builder workspace, card data, card art, legality, saved decks, import/export, or VS AI.

- **Correction to v1.43.0 artwork scaling:** Card Review artwork is **75% of the v1.41.0 artwork width**, not 75% of v1.42.0. On wide desktop, the card image is about 292px rather than ~267px; the right-hand details use the remaining width. On mobile, artwork is 187.5px instead of 184px. Style 1 and Style 2 use the same sizing rule.
- **Hero Lineage visible without scrolling:** Hero Review now reserves a permanent bottom lineage row. If a viewport is too short for all information, **only the content region** scrolls; the Rank I/II/III thumbnails remain visible and clickable. Hero artwork is responsively sized to fit shorter desktop windows while maintaining its aspect ratio.
- Previous rules for Card Review numeric-only Skill effects (`Deal 30 Physical damage.` etc.), font sizes, Status/Keyword explanations, and Hero Review content are preserved.
- This is a **review candidate, not LOCKED** for VS AI reuse.

Verification: `python3 tests/browser-v144-artwork-lineage.py` and `npm run check`.

---

# Grandis Legacy Deck Builder v1.43.0 — Card Review polish (30 October 2026)

**Scope: Review popup UI ONLY.** Baseline v1.42.0. Card data, printed artwork, validation, filters, deck building, and import/export unchanged.

- Card Review artwork is now **75% of its v1.42.0 size**, e.g. 32% -> 24% modal width on wide desktop; the detail panel gains the rest. Mobile art max-width is 184px (previously 245px). Hero artwork is not resized by this change.
- When a Skill Attack row contains **only a numeric damage value**, show `Deal 30 Physical damage.` or `Deal 30 Magical damage.` in its SKILL EFFECT according to its confirmed damage type. The numeric DAMAGE field remains separate. Other effects, status text, healing, block, and ambiguous Area/Casting damage types are not rewritten.
- Both Style 1 and Style 2 use the same rendering. **READY FOR REVIEW, NOT LOCKED.**

# Grandis Legacy Deck Builder v1.42.0 — Unified Card & Hero Review (30 October 2026)

**Scope:** Review popups only. The Deck Builder workspace, card artwork R3.4, card effects, legality, import/export and saved decks were not changed.

- Style 1 (`index.html` and `style-1/index.html`) and Style 2 (`style-2/index.html`) now share one Review layout. All three entrypoints load `css/s0-review-v1.42.css`.
- Review artwork is top-aligned and approximately 80% of the previously illustrated Style 2 size at desktop widths; the right detail column expands into the free space. Art retains the 5:7 ratio with no additional black panel.
- Skill/Ultimate metadata now reads CARD TYPE / SUBTYPE / MANA COST / EXP TRIBUTE with vertical separators and a rule below; Item and Event use their printed classification for SUBTYPE.
- Four approved numeric fields continue to show printed values without +/-: PHYSICAL DAMAGE, MAGICAL DAMAGE, DAMAGE REDUCTION, HEALING DONE.
- Gold headings 12px/700, white values 14px/700, effect descriptions 14px/500, keyword and status descriptions 14px/400, keyword images 18px.
- Status explanations now use **The affected Hero** rather than **This Hero**, preserving Rulebook v2.8.2 mechanics without implying who applied the Status.
- Hero Review: CARD TYPE / HP / REQUIRED EXP; Race/Racial Traits; Class/Rank and Class Ability; BONUS; then three Rank cards in HERO LINEAGES. Auto-height, with scrolling on smaller screens.
- Keyword/Status explanations remain at the bottom with no heading or container. An explicit CONDITION remains in its own panel.

Review-ready; not yet locked for VS AI. Verification: `python3 tests/browser-v142-unified-review.py` and `npm run check`.

---

# Grandis Legacy Deck Builder v1.41.0 — Card/Hero Review Refresh (30 October 2026)

**Scope:** display-only Card Review / Hero Review for **Style 1 and Style 2**. The existing Deck Builder systems are unchanged. This is a designer-review build, **not yet locked for VS AI reuse**.

- Artwork top-aligned with details; popup height follows content; long reviews can scroll inside the popup; Hero Lineages follows the Hero content without a fixed empty gap.
- Four printed numeric fields: **PHYSICAL DAMAGE**, **MAGICAL DAMAGE**, **DAMAGE REDUCTION**, **HEALING DONE**. Positive/negative signs are omitted from Review values; artwork is unchanged.
- Printed values are read from existing `damage_text` fields with confirmed type, never inferred from unrelated numbers in effect prose. Displayed **203 numeric fields** in 187 main cards; no card data or deck legality changed.
- Gold metadata labels **12px**, white content **14px**, Keyword images **18px** across both styles.
- Keyword Explanation placed at the very bottom of the card text with no title, background, or border. The previous **CONDITION card-wide panel** remains in its current position.
- Added Rulebook **v2.8.2** status explanations for Bleed, Burn, Freeze, Poison, Sleep, Stun without header or panel; name color uses a status palette to approximate the printed artwork. REACTION glossary updated from Rulebook v2.8.2.
- Rank/Ultimate Rules remain in place. The underlying R3.4 art, existing UI controls outside the popup, import/export, Hero progression selection, 50/12/12 deck, no-Starter policy, and OSA/VS AI/PvP builds remain untouched.

Documentation: `release/RELEASE_NOTE_v1.41.0.md` and `docs/qa/QA_Grandis_Legacy_Deck_Builder_v1.41.0_2026-10-30.md`.

---

## Deck Builder v1.40.0 — Keyword Explanation (29 October 2026)

- Keyword descriptions in **Card Review / KEYWORD EXPLANATION** updated to match the **Player Rulebook v2.8 EN, page 12** (all 16 official keywords). Notably, RANGE now explains that only attacks **outside normal AoA** count as Range Attacks.
- Both Style 1 (`index.html`) and Style 2 (`style-2/index.html`) use the same updated definitions.
- Card-specific `MANA COST +1` and `MANA COST +2` descriptions preserved as previously approved; these two labels are **not** official Rulebook p.12 keywords.
- Scope limited to display wording. The existing deck-construction validator/catalog metadata is **not certified migrated to Rulebook v2.8**. R3.4 art, card values, Main/Legacy/Mana constraints, export format, workspace state, and no-Starters behavior are unchanged.

## Deck Builder v1.39.0 (29 October 2026)

- Review artwork background now matches the modal surface.
- CONDITION has its own panel before rank effect rows and is displayed once per occurrence printed on the card.
- REFLECT explanation follows Player Rulebook v2.7.8 EN latest (2026-10-28, updated upload).
- All previous Style 1/2, deck state, artwork R3.4 and no-Starters behavior preserved.

# Grandis Legacy Season 0 — Deck Builder v1.38.0

Open **index.html** for Style 1, or **style-2/index.html** for Style 2. Both views share the same in-progress deck. This archive includes Main Deck R3.4 artwork and no Starter Deck presets.

## Latest changes
- Card Review uses identical 20px keyword assets in Skill Effect and Keyword Explanation.
- Card Review typography is 14px for gold metadata labels and 12px for white content; card name remains a larger title.
- Style 2 Main Deck hover shows card zoom to the **left over Card Library**, mirroring the Library zoom on the right. A click opens Card Review; quantity controls remain independent.
- Historical README, QA and superseded source audit files were preserved under `archive/historical-root-docs/`. Only active top-level files remain in the application root.

## Verification
Run `npm test`. Most browser regression scripts use offline Chromium; live website deployment has not been certified. See `docs/qa/QA_Grandis_Legacy_Deck_Builder_v1.38.0_2026-10-29.md` for actual test results.
