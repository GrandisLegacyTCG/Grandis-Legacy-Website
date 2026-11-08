# Integration QA — VS AI RC35 + Deck Builder v1.62

Date: 2026-11-08 (Asia/Jakarta)

## Results

- RC35 controlled engine regression: **20/20 PASS**.
- RC35.2 Note strategy: **22/22 PASS**.
- Historical difficulty suite: **15/16**, with the single mismatch expected because RC35.3 intentionally changes default AI Starter from 1 to 2.
- `node --check`: PASS for `engine/shared-app/app.bundle.js`, `shared-app/app-runtime.js`, and `shared-ui/mobile-landscape-lobby.js`.
- RC35 production files merged from attached source; website navigation and Hand artwork loading safeguard retained.
- All 15 local CSS/JS `?glsrc=` cache references match current file SHA-256 prefixes.
- Deck Builder v1.62 remains byte-identical to the RC34 integrated baseline.
- `CNAME`: `grandislegacytcg.web.id`.
- No GitHub push, commit, PR, or deployment performed.

## Scope / limits

Controlled source/regression validation only; no claim of full natural browser match or live-domain deployment QA.
