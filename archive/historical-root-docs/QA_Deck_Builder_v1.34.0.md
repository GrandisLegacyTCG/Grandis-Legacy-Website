# Grandis Legacy Deck Builder v1.34.0 — QA Summary

**Date:** 28 October 2026

**Scope:** Deck Builder display, source asset import, construction metadata and keyword filter; OSA engine unchanged.

| Gate | Result |
|---|---|
| Card coverage | PASS: 242 cards (187 Main, 45 Hero, 10 Legacy) |
| Main artwork R3.3 | PASS: 187/187 supplied artwork imported |
| User-supplied Provoke Rank II artwork | PASS: overrides R3.3 original |
| Legacy art R3.2 | PASS: 55/55 imported |
| Artwork SHA256 | PASS: 242/242 hashes agree with catalog |
| Deck Builder printed metadata | PASS: 187/187 against tracked R3.3 display snapshot |
| Keyword MANA BURN | PASS: 6 Skill cards indexed |
| Keyword MANA STEAL | PASS: 2 Skill cards indexed |
| Provoke printed Rank II / no Rank I | PASS |
| Style 1 image resolution | PASS: 242/242 |
| Style 2 image resolution | PASS: 242/242 |
| Style 1 keyword filter DOM interaction | PASS: burn 6; steal 2 |
| Style 2 keyword filter DOM interaction | PASS: burn 6; steal 2 |
| Starter Deck presets | PASS: absent |
| Syntax checks | PASS |

**Test commands:** `npm run check` (7/7 dedicated suites, and image resolution for both styles).
Interactive filter checks ran in headless Chromium using an in-memory HTML/JS harness because direct file/HTTP navigation is blocked in the test environment. Full hosted navigation testing remains to be done on the deployment target.

**Exception:** `S0-THF-005 Steal` is shown as `MANA STEAL 1` from its R3.3 image; the older OSA R3.3 source JSON still contains outdated wording.

**Explicit exclusions:** no OSA implementation/certification, no Starter Deck presets, no final artwork beyond the supplied R3.3 + Provoke, no VS AI work.
