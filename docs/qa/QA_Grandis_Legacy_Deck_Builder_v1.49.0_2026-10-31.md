# QA — Grandis Legacy Deck Builder v1.49.0 — 2026-10-31

## Scope
Baseline: Deck Builder v1.48.0. Both Style 1 entrypoints and Style 2. UI-only update; no printed card data, gameplay rules, legality implementation or images changed.

## Verification results

- **PASS** — Node syntax: both Season 0 app scripts plus both new shared helper scripts.
- **PASS** — `npm run check`: seven artwork/keyword/metadata suites, valid 50-card sample and 242 artwork references in both styles.
- **PASS** — `python3 tests/browser-v149-ui.py`: root, Style 1, Style 2 at 1600×900 and 390×844. No browser JavaScript exceptions.
- **PASS** — Subtype option lists: Skill 7 classifications (Physical/Magical/Area/Casting Attack, Defense, Tactical, Support); Event 2; Item 4.
- **PASS** — Exact Skill filtered counts: Physical 50; Magical 28; Area 14; Casting 4; Defense 27; Tactical 23; Support 9 (using All Cards).
- **PASS** — Card Review name 20px, metadata 16px, explanation 12px `rgb(172,172,174)`; review X centered against header, all three entrypoints and both desktop/mobile.
- **PASS** — View Deck opens and closes; 20 card tiles render; first row at desktop has ≥7 columns and right gutter <40px; card expansion opens Review; modal fits viewport at both tested resolutions.
- **PASS** — Root `index.html` matches direct Style 1 entrypoint except for the necessary `<base href="../">`.

## Browser testing boundary
Chromium direct navigation of both HTTP and file URLs in this tool environment is blocked by policy. Instead the browser QA mounted the **actual** HTML plus CSS and JS inline, letting UI state, metrics, dropdown interactions, modal geometry and JavaScript errors be tested. In that environment, linked image assets were not loaded; the ZIP still retains original actual artwork, and an end-user visual check in the deployed page remains advisable.

## Known non-regression / source authority
Season 0 data/card copy, Rulebook v2.8.2, OSA engine, 50-card deck rules, Hero/Legacy, imports/exports and five Starter Decks were not edited. Noto Sans is requested through Google Fonts; remote font loading requires connectivity if not installed.
