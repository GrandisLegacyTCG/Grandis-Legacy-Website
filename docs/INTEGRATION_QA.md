# Grandis Legacy RC33 + Deck Builder v1.62 — Integration QA

**Prepared and checked:** 2026-11-08 (Asia/Jakarta).  
**Scope result:** PASS for local integration, source parity, static loading and syntax. This is not a full gameplay audit or a production/browser verification.

## Sources and repository check

- Repository: `GrandisLegacyTCG/Grandis-Legacy-Website`, branch `main`, commit `f6f1d8971e6458b96b46f2083f0481e02d2230db` (`GL S0 : VS AI RC32 + DB v1.62 - FIX`).
- Git tree: `bcab449bf947bcd21e59c4e50b2e7dc876b1a07a`; 764 files.
- 763 of 764 files in the supplied integrated RC32 ZIP match GitHub blob hashes exactly. The remaining historical CSV differs only in CRLF/LF line endings. Its exact GitHub LF bytes are retained.
- VS AI source: the attached `Grandis_Legacy_VS_AI_Season0_v1.0_RC33_2026-11-08.zip`.
- Deck Builder: the existing integrated v1.62, retained byte-for-byte.
- Source archive SHA-256 values are recorded in `SOURCE_PROVENANCE.json`.
- GitHub was read only. No commit, push, pull request or deployment was performed.

## Final integration boundaries

All 417 deployable files from RC33 are present, including the nested `engine/shared-ui/README.md`. 414 are byte-identical to RC33. The three allowed differences are:

1. `index.html`: existing site navigation/artwork CSS links and regenerated CSS/JS content-hash cache parameters.
2. `shared-app/app-runtime.js`: existing lobby navigation, bounded player Hand image preload/decode helpers and four call sites, plus four content-hash references for the two updated racial-token images.
3. `runtime/season0-generated/STAGE5_36_ROUTE_REFERENCE_AUDIT.csv`: repository LF line endings retained; text identical to RC33.

An independent source review of the actual final diff found no integration defect. The RC33 Music/SFX panel, Hero action artwork, opponent Mana hover preview, Card Played chronology and Battle Log changes are retained. No new gameplay or rule changes were added beyond the supplied RC33 release.

## Checks run in this session

| Check | Result |
| --- | --- |
| HTML entry points | 4 checked |
| Local HTML references | 111 valid; includes 100 asset references |
| CSS/JS `glsrc` hashes | 83/83 match the final file bytes |
| Racial-token image `glsrc` hashes | 4/4 match the two RC33 image files |
| Deck Builder | 347/347 files byte-identical; no added/deleted/changed file |
| RC33 deployable files | 417 present; 414 identical + 3 documented boundaries |
| Engine source | 54/54 files byte-identical to RC33 |
| Card artwork | 248/248 files byte-identical to RC33 |
| Battlefield stylesheet | Byte-identical to RC33 |
| JavaScript syntax | 40 JS, 11 CJS and 9 inline scripts pass |
| JSON source/config parsing | 37 files pass before adding this result report |
| Local HTTP requests | 18/18 return 200 and exact expected bytes |
| Domain file | `CNAME` remains `grandislegacytcg.web.id` |
| GitHub Pages support | `.nojekyll` retained |
| Newly missing CSS URL targets | 0 |

The HTTP checks cover the homepage, both Deck Builder styles, the Style 1 redirect, engine/runtime/CSS, both racial-token images, all eight new Hero action PNGs and `Tavern Quest.mp3`.

## Limits and inherited findings

- Interactive browser rendering/navigation, visual layout, audible playback and a full human-vs-AI match were not run here: this environment has no Chromium executable.
- HTTP checks establish route accessibility and exact served bytes, not JavaScript execution or gameplay correctness.
- Live GitHub Pages/custom-domain behavior remains unverified because no upload or deployment was performed.
- Two pre-existing CSS references remain absent, unchanged from the baseline: `assets/review-db158/css/app.css` refers to `../assets/ui/Grandis-Background.webp` and `../assets/ui/chevron-down.png` under the review asset tree. No new missing CSS reference was introduced.
- Documents under `docs/qa/rc33/` are supplied RC33 release evidence, not tests rerun in this integration session. The RC33 release-candidate status and its gameplay limitations remain applicable.

## Manual package use

The update-only archive contains only additions/changes against the exact baseline commit above. **No file deletion is required.** The full archive contains the complete site with paths rooted directly at the repository root. Both archives represent the same final content.

The detailed current result is `qa/RC33_INTEGRATION_RESULT.json`. `FILE_MANIFEST_SHA256.csv` lists SHA-256 and size for every final file except the manifest itself. Manual steps are in `MANUAL_UPDATE_RC33_ID.md`.
