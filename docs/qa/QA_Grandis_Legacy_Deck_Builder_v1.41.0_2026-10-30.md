# Grandis Legacy — Deck Builder v1.41.0 QA — 30 October 2026

## Test evidence
- Both styles: `index.html`, `style-2/index.html` use the same shared review helper and scoped stylesheet.
- Chromium DOM-injected tests: 6 viewport/style combinations: 1600×1000, 1366×768, 790×870 across two styles; no JS exception.
- Review examples verified: Hammer of Justice (40/60 Magical), Unbroken Stand (60/60 Reduction), Blooming Harmony (30/50 Heal), Resonance Burst (30/50 Area Magical), Bow Bash (20 Physical), Double Casting (no irrelevant numeric metric).
- **187/187** Main card reviews rendered per style; all **203/203** populated numeric rows match numeric source fields and display without +/- signs per style; all six statuses found and shown.
- **45/45** Hero review variants rendered per style; top alignment and dynamic-height bounds checked; no JS exception.
- Keyword glossary: no heading, background, border; 18px image, after effect & Ultimate Rules.
- Typography checked on both styles: gold heading 12px; white effect/body 14px.
- `npm run check:syntax:s0`: PASS.
- `node tests/run-update5-no-starters.cjs`: PASS 10/10 tests; card assets unchanged; 50/12/12, no Starters, ability data unchanged.
- `node tests/run-v131-import-export-static.cjs`: PASS.
- JavaScript syntax checks on all altered JS sources: PASS.

## Limitations
- Browser test uses DOM-injected HTML/CSS/JS to sidestep sandbox restrictions on direct `file://` and loopback, thus **not** an actual Windows double-click test.
- Numeric values are sourced from existing card `damage_text`, not independently re-transcribed from artwork for every card. All 203 populated R3.4 card data rows are displayed; this check does not certify older metadata against all 187 actual images.
- Status colors for Stun match provided yellow example; other statuses use curated semantic palette (not verified pixel-by-pixel from all printed artwork).
- This does not migrate Deck Builder legality or card text database to Rulebook v2.8.2; the request is limited to review popup presentation.
- Not yet designer-approved or locked for VS AI reuse.
