# QA — Grandis Legacy Deck Builder v1.40.0

**Date:** 29 October 2026  
**Parent:** v1.39.0 R3.4 No Starters  
**Change scope:** Player-facing Card Review keyword explanations only.

## Authority and wording

- **Grandis Legacy Player Rulebook v2.8 EN, page 12**: 16 official keywords, text transcribed exactly into `js/s0-review-clarity.js`.
- **Machine Rules v1.0 JSON/YAML**: interpretation reference, not replacement authority.
- `MANA COST +1` and `MANA COST +2`: card-specific printed modifiers; previous approved description unchanged and explicitly not counted as the 16 rulebook keywords.
- Specific fixed mismatch: **RANGE** now says that *attacking outside normal Area of Attack counts as a Range Attack*. Merely having RANGE does not automatically classify an in-AoA attack as a Range Attack.
- Removed extra text from BLOCK, DODGE, BUFF, HEAL, and REVIVE definitions that was not part of the v2.8 p.12 wording. Gameplay behavior was not modified.

## Verification run

| Check | Result | Evidence |
|---|---|---|
| All 16 official v2.8 EN keyword descriptions exact | PASS | `tests/browser-v140-keyword-rulebook.py` compares all 16 expected strings to runtime JS |
| Both Mana Cost +1 / +2 explanations unchanged | PASS | Same test compares remaining 2 descriptions |
| Card Review renders expected explanation for one representative card per keyword | PASS 18/18, each style | Chromium DOM test; Style 1 and Style 2 |
| Card Review JS errors in those scenarios | PASS, 0 exceptions | Chromium DOM tests |
| All 13 printed CONDITION cards / 2 styles, REFLECT, rank rows | PASS | `tests/browser-v139-condition-reflect.py` |
| Card Review keyword badge and typography / Style 2 hover | PASS | `tests/browser-v138-layout-hover.py` |
| No-starters, deck selection, card availability / 3 entry points | PASS | `tests/browser-update5-no-starters.py` |
| JS syntax, 187 printed metadata, artwork SHA, keyword filters | PASS | `npm run check` (7/7 main R3.4 suites + 242/242 images each style) |
| ZIP integrity | PASS | ZIP CRC inspection following packaging |
| Opening extracted `index.html` using Windows Chrome/Edge `file://` | **NOT VERIFIED** | Current Chromium runtime blocks local `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; tested via injected DOM, not Windows double click |

## Scope boundary and limitations

- **Rulebook v2.8 descriptions only:** Other existing deck-construction metadata and validators still carry v2.7.8 references. They have **not been audited/migrated** under this release and must not be advertised as full Rulebook v2.8 compliance.
- **UNCHANGED:** R3.4 Main Deck images, Legacy cards, source artwork and card values, existing deck format / export, selection and quantity UI, no-Starter presets, and both Style 1/Style 2 layouts.
- OSA, VS AI S0, VS AI S1, PvP and website were not changed in this patch.

**Release conclusion:** Keyword explanation text is verified against Rulebook v2.8 EN p.12 in both Deck Builder UI styles. No claim of complete deck-rule or gameplay parity.
