# Grandis Legacy GitHub Pages — Integration QA (2026-11-07)

## Baseline / scope
- VS AI: v1.0 RC32 (source ZIP SHA256: `362724579a6739ef713e461f3874b199288f0ad6e664267c45df504f82b77af7`)
- Deck Builder: v1.62 (source ZIP SHA256: `41302f430e6e6bfa17e37ca58d6bf663505043e65eb72f7e158969a5560deed3`)
- Source ZIPs were freshly extracted from `/mnt/data`, not copied from the previous combined site.
- Gameplay/AI/card databases and standalone version numbers unchanged.
- Navigation to Deck Builder, logo to `/`, hidden PvP, favicon, prior Hand-artwork loading guard kept.
- New: content-hash `glsrc` query parameter on locally referenced CSS/JS files in HTML, specifically because the source release names and existing `?v=...` tags may not change between hotfixes.
- Only 4 files are kept at repo root.

## Validation
- ZIP sources extracted: VS AI 692 files; Deck Builder 575 files.
- Compared source deployable files present: 755 PASS (755/755), with integration boundaries allowed in 4 HTML/JS files.
- HTML local asset references: 100 PASS.
- HTML JS/CSS references with SHA-256 content URL tags: 83 PASS.
- JavaScript syntax: 40 PASS. JSON parse: 33 PASS.
- Static HTTP paths: 12 PASS.
- Interactive browser gameplay and user navigation: **NOT VERIFIED**; headless Chromium request to local test server was blocked by environment policy.
- Known pre-existing missing CSS URL references (not newly introduced): `assets/review-db158/css/app.css` references `../assets/ui/Grandis-Background.webp` and `../assets/ui/chevron-down.png`. Neither was silently modified.
- Live GitHub or domain deployment: **NOT PERFORMED**.

## Source comparison with previous combined ZIP
All 751 unmodified deployable assets/scripts from the current VS AI / Deck Builder source ZIPs match the corresponding files of the previous RC32/v1.62 combined ZIP byte-for-byte. This suggests that if a same-version source hotfix was intended to change these files, no such difference is observable in the two ZIPs currently mounted in this chat. The corrected package still changes the integration shell and cache invalidation strategy; it does not claim to contain unobserved hotfix content.

## Publishing / sync
1. Back up the current GitHub repository. Extract archive and put **contents** into root.
2. Delete obsolete tracked files that no longer belong to this static site; do not simply overlay and leave stale files.
3. Keep `CNAME` and Settings -> Pages -> Deploy from branch: `main`/`/(root)`.
4. After push check the deployed `index.html`, network requests and load of new `glsrc` hash query parameters.
