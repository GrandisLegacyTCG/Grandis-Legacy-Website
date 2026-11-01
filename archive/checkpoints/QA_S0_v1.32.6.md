# Grandis Legacy Deck Builder v1.32.6 — R2 UI Hotfix QA

## Scope

This release corrects the four user-reported issues in **Deck Builder v1.32.5**. It is a **Deck Builder-only** patch. OSA v1.9.21, Rulebook v2.7.2 and the 218 Season 0 R2 artwork files remain unchanged.

1. **Tidier archive** — all old `QA_S0_*.md`, QA text logs, and versioned `S0_SOURCE_LOCK_*.json` are retained in `archive/checkpoints/`, instead of cluttering the root. Runtime folders (`assets/`, `css/`, `js/`, `style-1/`, `style-2/`, `data/`) remain where HTML references expect them.
2. **Direct Style switch** — from root/Style 1, hyperlink now targets `style-2/index.html` explicitly; from Style 2 it targets `../style-1/index.html`. Style 1's nested HTML was stale (Season 1); it is replaced with the current S0 entrypoint that uses shared root files. Firefox no longer receives a directory URL when the built-in switch is clicked.
3. **Artwork** — `js/data-s0.js` used literal `{S0_IMAGE_BASE}` tokens in **233 URL fields**, causing browser requests for invalid filenames and blank cards. Data loading now resolves the tokens to a relative root (`assets/` or `../assets/`) for both styles. 218 original WEBP images are byte-for-byte preserved and verified. Hero cover images are fixed too.
4. **Hide incomplete Hero progression choices** — player-facing choices are dynamically gated to progression owners whose Ultimate Skill exists in the R2 source, leaving **13 selectable progressions**. Melody Silverstring and Bromir Oathforge are not shown in Style 1 Hero Library nor Style 2 Hero Picker; raw 45 Hero/15 progressions remain in data unchanged for future rollout. Imported/stored decks cannot activate unavailable progressions; they must be selected once their Skills are available. 24 reserved Skill slots remain unfilled.

## Validation

- `npm run check`: PASS (source SHA-256, v1.31 original CSS hashes, 50/12/12 construction, 60-card draft limit, S1→S0 migration, availability, hybrid/Ultimate owners, Style 2 locate).
- `npm run check:browser:s0`: PASS. Existing Chromium smoke tests Style 1 & Style 2; existing Style 2 locate test; **new** Chromium injected-DOM tests for both Style 1 entrypoints and Style 2, confirming **13 selectable Hero progressions**, blocked Melody/Bromir, updated image path strings and switch link targets.
- **218 / 218 image files**: exist, verified WEBP decodability with PIL and matched hashes from Season 0 source catalog using existing automated tests.
- Original core CSS files `css/app.css`, `style-2/css/app-v1.31.css`: hashes unchanged vs v1.32.5 and canonical v1.31.
- Python ZIP `testzip()`: PASS.

## Limitations and use

Testing infrastructure blocks direct `file://` and HTTP navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`), so direct Firefox double-click navigation and actual bitmap loading must be spot-checked by the user. The automated browser checks use the real application HTML/CSS/JS injected into Chromium, and file existence / relative URLs / image decoding / hashes are tested separately. **Do not claim a real local-file navigation browser test passed in this environment.**

Extract entire ZIP, then open `style-1/index.html` or `style-2/index.html`. Do not enter a browser URL ending in `/style-2/`; Firefox displays the folder index rather than automatically opening `index.html` for `file://` URLs.

**Unchanged:** S0 card text metadata, Effect Recipes (still pending), 218 original image bytes, OSA v1.9.21, Gameplay Rulebook v2.7.2, 50-card export legality, 60-card editing capacity, S1→S0 import.
