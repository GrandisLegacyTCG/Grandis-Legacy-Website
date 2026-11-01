# Grandis Legacy — Deck Builder v1.44.0 — 2026-10-30

## Changes (Review modal only)
1. Fix scaling basis: artwork width is 75% of v1.41.0, not 75% of v1.42.0. Style 1 and Style 2 unified.
2. Hero Lineage is permanently visible at the bottom of the Hero Review modal, including short viewports. Overflow, if any, is confined to the main Hero content.
3. Hero art size responds to screen height. Other Deck Builder components and all printed art remain untouched.

## QA
- Chromium DOM tests verify artwork ratios and all 45 Hero reviews in each style at 1440×900, 1365×720, 1024×768, 768×700, and 390×844 (450 hero/viewport combinations).
- Normal mouse clicks on Hero Lineage thumbnails pass. No page errors in this test.
- Existing source/artwork tests pass; ZIP CRC verification done on release archive.
- Browser testing used an inlined-document harness; direct Windows file:// execution is not verified.

Status: READY FOR USER REVIEW, NOT LOCKED.
