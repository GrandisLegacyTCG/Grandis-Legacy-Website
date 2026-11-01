# Grandis Legacy — Deck Builder v1.42.0 — QA (2026-10-30)

## Baseline and Scope
- Source: Deck Builder v1.41.0; S0 R3.4 artwork; Rulebook v2.8.2 status explanations.
- This update changes only Card/Hero Review rendering in `js/app-s0.js`, `style-2/js/app-s0.js`, Review explanation wordings in `js/s0-review-clarity.js`, three HTML entrypoints to include Review styles, new `css/s0-review-v1.42.css`, and version/test/docs metadata.
- No OSA, VS AI, PvP, card data, image, validator or deck import/export modifications.

## Verification Results
- `npm run check`: PASS (JS syntax, 7 card/artwork suites, Style 1 & 2 image tests). Data/card hashes checked against the original v1.41.0 ZIP: **270/270 assets and data files unchanged**.
- `python3 tests/browser-v142-unified-review.py`: PASS on all **three entrypoints** (Style 1 root, Style 1 alias, Style 2), each at **1440×900** and **390×844** = **6 viewport runs**. No JavaScript page errors.
- In each viewport: **187 Main Card Review** instances, **45 Hero Review** instances, **203 numeric rows**, **15 Ultimate cards**, plus a consistent metadata layout across all Skills and 3 Hero lineage cards per Hero.
- Printed Condition panels on 13 cards, Keyword explanations on 101 cards, and Status explanations on 44 cards were rendered in each run.
- Computed typography: headings 12px/700, values 14px/700, effect text 14px/500, status text 14px/400; keyword images 18px.
- Desktop artifact top-aligned in both styles; mobile popups scroll within the viewport.

## Limitations / Historical Tests
- The historical `npm test` aggregate remains **non-green**: old `browser-v1361-review-hover.py` expects Keyword Explanation *before* Ultimate Rules, while the approved v1.41–v1.42 behavior puts explanations at the bottom. The failing assertion is an outdated test contract, not a new functional regression. `npm run check` and the new v1.42 browser test pass.
- QA ran with an inlined Chromium harness. Actual Windows `file://` double-click is not proven: Chromium direct navigation was blocked in this execution environment. Paths are relative, but Windows needs user testing.
- Responsive test covers desktop and mobile reference widths, not every intermediate resolution or every manual interaction.
- Status name colors use the existing artwork-inspired palette, not pixel-sampled colors per card.

**Status: READY FOR DESIGNER REVIEW, NOT LOCKED.**
