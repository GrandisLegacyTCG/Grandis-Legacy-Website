# Grandis Legacy Deck Builder v1.37.0 — QA / Part 7 corrections

**Date:** 29 October 2026  
**Source:** v1.36.0 released ZIP plus previous v1.36.1 unshipped review/hover patch.  
**Authority:** Main Deck R3.4, Legacy R3.2, Mana R1, Rulebook v2.7.8.  
**Scope:** Deck Builder front end only. **OSA engine unchanged.**

## Reported regressions and changes

| Finding | Fix | Browser evidence |
|---|---|---|
| Keyword Explanation duplicated once per Rank | Collect all distinct printed Keyword labels across card effect rows, append **one** independent block after all printed Rank/effect boxes. Ultimate Rules follow it. | Absolute Defense 2 Ranks: one explanation block with `REFLECT`, `INVINCIBLE` and no duplicates; both styles pass. |
| Style 2 Card Library left hover was lost | Restore the original Library hover enlarged artwork and retain Library's Review control; Main Deck hover remains disabled and Main Deck enlarge control stays removed. | Hover Library card shows zoom, hover Main Deck card does not; direct click opens Card Review, and `−/+` still work. |
| DB-11 previous shared draft did not survive real style navigation | Keep same storage key and add **URL-fragment draft handoff** to actual Style 1↔Style 2 links. Fragment contains only compact deck name, Card IDs/quantities, and three positional Hero/Legacy slot IDs. On destination, restore **before any blank state can overwrite storage**, honor empty slots, store the received draft, then clear fragment where history is supported. Use `storage` event and focus/pageshow resync on hosted same-origin tabs. | Chrome offline click-handler round trip Style 2→Style 1→Style 2→Style 1: 2→3→2 Main Deck copies, correct selected Mage/Thief Hero slots, blank Legacy/position retained, updated name retained; storage-event and deliberate clear-deck tests pass. |
| Ultimate Rules printed `Only Only ...` | Detect already-complete printed restriction and display it verbatim rather than prefixing repeated wording. | Absolute Defense: `Only Bromir...` occurs once; other printed rules preserved. |

## Execution

- `npm test` — **PASS**, exit code 0: JS syntax, 7/7 catalog tests, artwork integrity for all **242** assets, no Starter Decks, both style image-resolution checks, browser keyword/scroll/header/quantity tests, review/hover suite, and cross-style shared-workspace suite.
- New `tests/browser-v137-workspace.py` — **PASS** bidirectional click/handoff, editing on both styles, storage-event refresh and blank-deck propagation.
- Existing `tests/browser-v1361-review-hover.py` — **PASS** distinct explanation panel, Ultimate Rules, Card Library hover, Main Deck direct click and quantities.
- No gameplay engine code, card rules, printed metadata, or artwork changed.

## Constraints / limitations

- Direct browser navigation via `file://`, localhost HTTP, and intercepted remote URLs is blocked by the browser sandbox (`ERR_BLOCKED_BY_ADMINISTRATOR`). Therefore these are **offline in-memory Chromium tests**, with actual switch click handlers and transferred URL fragments, **not deployed end-to-end navigation certification**.
- On a hosted site, both styles must be deployed under the **same origin and same Deck Builder base path**. For normal use, switch using the "CHANGE TO STYLE" link rather than opening an old bookmark in a separate origin.
- If importing into an already-open different-origin tab directly rather than through the switch link, browser storage may not synchronize: the click handoff is the cross-origin fallback. Two tabs on the same hosted origin are synchronized via `storage` events.
- A different browser, Incognito session, or device does not share local storage; JSON import/export remains the portable solution.

**Verdict:** SCOPED PASS on included client-side regression suite; hosted navigation smoke remains outstanding.
