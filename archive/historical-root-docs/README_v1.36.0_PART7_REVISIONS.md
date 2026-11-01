# GRANDIS LEGACY — Deck Builder v1.36.0 · OSA Part 7 UI Revisions

**Released:** 29 October 2026. **Source:** v1.35.0 R3.4 No Starters. **Gameplay not modified.**

## Completed changes

- **DB-08 Header:** shared `Noto Sans` typography metrics (family, size, weight, letter spacing, line-height) between Style 1 and Style 2, referencing Style 1.
- **DB-09 Card Review:** desktop popup artwork stays still and the **right information column scrolls independently**; popup title/close remain pinned. Responsive mobile layout keeps details scrollable.
- **DB-10 Keyword imagery:** all **18 approved** keyword labels are clipped from the owner's original `Keyword.png` as transparent PNG badges, embedded inline in Effect and immediately after Effect in Keyword Explanation, including Condition labels. **ALL ALLIES** is absent. Both MANA COST +1/+2 have the owner-approved literal explanation. Rulebook 2.7.8 supplies remaining explanations.
- **DB-11 Style switching:** Style 1 ↔ Style 2 share the same local draft. Preservation includes Main Deck copies, selected Hero/Legacy slots **with exact Left/Center/Right positions, including intentionally empty slots**, and deck name; source/validation and original import/export remain intact.
- **DB-12 Style 2 Main Deck:** remove enlarged hover preview **only in the Style 2 Main Deck**. Clicking any card illustration/body opens the full Card Review, while other library-specific interactions remain unchanged.
- **DB-13 Style 2 Main Deck:** card-level **− / ×N / +** copy controls; supports zero-removal, ordinary copy limits, workspace upper bound, live counters and both-style synchronization. Buttons do not open Review.

No Starter presets and no gameplay metadata, card IDs, balancing, other visuals, or construction limits have been changed. R3.4 Main Deck, Legacy R3.2 and Rulebook v2.7.8 remain the authority. This is a static Deck Builder, not an OSA Engine update.

## Validation

Run `npm test`; current v1.36 additional suite: `npm run check:browser:v136`. Source remains directly deployable as a static GitHub Pages site, with `index.html` and `style-2/index.html` as entry points (plus `style-1/index.html` alias). Browser QA is performed in an in-memory Chromium harness because local file/localhost navigation is blocked in this environment. Production-host navigation must be independently verified following deployment.

Historical v1.35 documentation remains in `README_v1.35.0_PART7.md`.
