# Integration QA — VS AI RC34 + Deck Builder v1.62

Date: 2026-11-08 (Asia/Jakarta)

Baseline GitHub commit: `5fd2bc590147e287d81db6c5abb8e4eb09fe3bf2` (`GL S0 : VS AI RC33 + DB v1.62`).

## Results

- RC34 controlled engine regression: **20/20 PASS**.
- `node --check`: PASS for `engine/shared-app/app.bundle.js`, `shared-app/app-runtime.js`, and `shared-ui/mobile-landscape-lobby.js`.
- RC34 production parity: `engine/shared-app/app.bundle.js`, `shared-ui/battlefield-ui.css`, and `shared-ui/mobile-landscape-lobby.js` are byte-identical to the attached RC34 final source.
- Integration merge: `index.html` and `shared-app/app-runtime.js` retain repo navigation/artwork-loading integration while incorporating RC34 changes.
- Cache validation: all 15 local CSS/JS references using `?glsrc=` match the first 12 hex characters of the current file SHA-256.
- Deck Builder v1.62: **347 files byte-identical** to the RC33 integrated baseline.
- `CNAME`: `grandislegacytcg.web.id`.
- No GitHub push, commit, PR, or deployment was performed by this preparation.

## Scope / limits

This validates the integrated files locally and runs the controlled RC34 engine regression supplied with the release. It does not claim a full natural browser match or live-domain deployment QA.
