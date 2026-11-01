# Grandis Legacy Deck Builder v1.36.0 — QA / DB-08..DB-13

**Date:** 29 October 2026  
**Baseline:** v1.35.0 · Main Deck R3.4 · Legacy R3.2 · Mana Deck R1 · Rulebook 2.7.8 EN.  
**Scope:** Deck Builder presentation, client-side interaction, shared draft. **No OSA gameplay engine update.**

| Requirement | Result | Verification |
|---|---|---|
| DB-08 Header fonts identical | PASS | Computed Style 1 vs Style 2 `Noto Sans`, 17px, weight 700, letter spacing 0.595px, line-height 20.74px (1280×620 offline Chromium); shared header CSS explicitly forces nav and subtitle typography. |
| DB-09 Right-column independent scroll | PASS | Absolute Defense at 1280×620: Style 1 right scrollHeight/clientHeight = 582/445; Style 2 = 486/464. Artwork coordinates unchanged when scrolled. Mobile right scroll supported. |
| DB-10 User keyword artwork | PASS | 18 cropped transparent badges from provided `Keyword.png`; ALL ALLIES omitted; inline Effect and Keyword Explanation use images with meaningful alt text; X Cross Slash CONDITION/SURE HIT, Absolute Defense REFLECT/INVINCIBLE verified. |
| DB-11 Switch Style retains deck | PASS in simulated shared-storage restore | Same 2-copy deck restored in both directions; Mage placement retained in RIGHT position while LEFT/CENTER and Legacy remain intentionally blank. Saved deck name/slots retained by shared serializer; no automatic starter. |
| DB-12 Style 2 deck hover preview removed | PASS | No `data-hover-card-id` on desktop Main Deck card; no enlarged hover popup; click on card opens Review directly. Library hover remains unchanged. |
| DB-13 Style 2 −/+ quantity controls | PASS | 2→3→2 with controls; disabled at copy limit; controls stop propagation, Main Deck counter updates, persisted state updates. `−` to zero removes by existing code. |
| Existing R3.4 visual/catalog integrity | PASS | Original provided card-art catalog hashes, 187 Main / 45 Hero / 10 Legacy = 242; 15 progressions; no starter presets. |
| Existing rules/metadata | PASS (regression scope) | Existing R3.4 art/R3.3 printed baseline test suite; no card metadata or gameplay changed. |
| Full user-facing hosted navigation | NOT TESTED | Direct local file and localhost Chromium navigation blocked by runtime security policy; offline in-memory Chromium page harness used. Must verify on actual hosted GitHub Pages deployment. |

### Commands and tests

- `npm test` — **PASS, exit code 0**. Runs source syntax checks, card/catalog art audits, no-starters regression, older browser regression tests and new `tests/browser-v136-revisions.py` (all pass).
- New suite covers both styles, Chrome-computed header styles, right-only scroll (desktop/mobile), sprite placement, condition/damage text, Style 2 quantity and click actions, storage serialization and rehydration including incomplete Legacy selections.
- The baseline v1.35 artwork paths and catalog remain unmodified; sprite assets are additive.

### Open deployment-only check

Deploy extracted contents to the same GitHub Pages base path (not the outer ZIP parent folder); verify actual navigation with a saved partially built deck Style 1→Style 2→Style 1, hover and Review modal images, and browser cache refresh. The package has not been published by this QA.
