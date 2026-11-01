# Grandis Legacy — Deck Builder v1.41.0 — 30 October 2026

## Scope
Popup review presentation only (Card Review + Hero Review), Style 1 and Style 2. No Deck Builder logic, data or artwork revisions. Engine integration and gameplay are **not** claimed. VS AI will reuse the review component only after designer approval/lock.

## Implemented
1. Card artwork anchors to the top of the review body; modal dynamically sizes to the tallest content column without artificial minimum height. Longer content scrolls when it exceeds the viewport. Hero Lineages are positioned below the content instead of separated by empty space.
2. Numeric categories by existing printed field: PHYSICAL DAMAGE / MAGICAL DAMAGE / DAMAGE REDUCTION / HEALING DONE, with unsigned displayed values. Area and Casting attacks infer damage type **only** from the printed row’s damage-type wording. When unclear, avoid inventing a type.
3. Consistent 12px gold labels, 14px body/values, 18px keyword image height.
4. Removed glossary header and panel; inline keyword/description lines appear **after** all card sections, including Ultimate Rules.
5. Status glossary from Player Rulebook v2.8.2 p14: Bleed, Burn, Freeze, Poison, Sleep and Stun, deduplicated within a card. Highlight names by per-status colors, with Stun yellow matching the supplied reference.
6. REACTION keyword explanation updated from Player Rulebook v2.8.2 p12–13 (legal outside Battle Phase when the stated trigger occurs).

## Explicit non-changes
Main/Legacy/Mana artwork and all runtime catalog records unchanged. The previous CONDITION box remains, now with 18px keyword artwork. No updates to deck validation, filtering, composition, selections, saving, import/export, hero progression or apps outside Deck Builder.

## Readiness
**Designer Review Candidate**, not yet DESIGN LOCKED. This is an UI/display refresh; original printed database may still contain older card wording independent of this scope. Windows file:// launch not verified by Chromium sandbox; Chromium DOM injection was used for UI QA.
