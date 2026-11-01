# Deck Builder v1.32.5 — R2 sync QA

- OSA: v1.9.21 / Rulebook: v2.7.2.
- 218 cards: 163 Main Deck (131 Skill, 20 Item, 12 Event) + 55 Legacy Deck (45 Hero + 10 Legacy).
- 15 Hero Progressions, 24 reserved Skill slots remain absent from catalogue.
- All 218 card artwork copied byte-for-byte from R2 OSA and checked against SHA-256. No Season 1 visual fallback remains.
- Latest Ultimate owners: Lethal Venom → Akra Norixius; Divine Edge → Sylvan Galesong.
- Two original v1.31 styles kept, CSS hash unchanged.
- Style 2 locate-click: preserve filter if card is present; otherwise reset to All Types + Available Cards when Heroes selected.
- Original S1-to-S0 import, available cards, keyword/effect filters, 60-card draft / 50-card legal export kept.
- Effect Recipes, VS AI and PvP remain outside scope. Metadata is still staged pending word-by-word review.

## Latest validation (October 22, 2026)

- `npm run check`: PASS; Style/card/legality (9/9), S1 migration (6/6), availability/60-card draft (8/8), plus additional R2 sync checks.
- Chromium `tests/browser-v1324-smoke.py`: PASS both original Style 1 and Style 2 (Effect filter, Available Cards default, Hero selection).
- Chromium `tests/browser-v1325-locate.py`: PASS Style 2 keeps filters when card already visible; when hidden, resets to All Types and Available Cards (with selected Hero) and locates the card.
- **IMPORTANT**: Desktop/browser local-file import/export and persistent localStorage should still be tested by the user. No live production deployment.
- Source images are exact R2. Source OSA metadata remains staged; not an approved, executable Season 0 gameplay implementation.
