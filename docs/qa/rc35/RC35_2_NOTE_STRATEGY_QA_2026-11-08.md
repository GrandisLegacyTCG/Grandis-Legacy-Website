# RC35.2 (internal) - Intermediate Starter 5 Note Strategy

Distribution name: `Grandis_Legacy_VS_AI_Season0_v1.0_RC35_2026-11-08.zip` (RC35 only in filename).

## Designer-approved strategy

- **Vae**: while Priest/Saint is active, retain one or two copies in Hand even if a Bard/Maestro combo needs Vae in Discard. Only when 3 copies are in Hand may an optional exchange discard 1 copy. When Priest/Saint is defeated, Vae may be exchanged to seed a combo. Play Vae as a Heal using Priest/Saint when the recipient is missing at least 20 HP; it reaches Discard by normal resolution and can supply later combo costs.
- **Zol**: prefer Archer/Marksman/Grand Ranger Attack when that Hero lives and Mana is sufficient. A duplicate copy may be exchanged; a sole copy may be exchanged if Mana is insufficient **and** the relevant combo is already in Hand. If Archer is defeated, Zol may instead be exchanged for combo preparation.
- **Lun**: keep the lone copy for BLOCK unless a combo requiring Lun is in Hand. Extra Lun copies are eligible for optional Bard/Maestro exchange.
- **Healing efficiency**: Intermediate compares missing HP to the card's **printed** Healing row, excluding Priest/Saint passive and other healing bonuses from the utilization percentage. Passive bonuses still apply during actual resolution. Beginner retains the existing utilization calculation and decisions.
- **Scope**: conditional AI decisions only, not gameplay legality; no artificial Note movement. No card art, decks, or UI were changed.

## Verification

- Focused scenario tests: **22/22 PASS**, `RC35_2_NOTE_STRATEGY_TESTS.cjs` and `RC35_2_NOTE_STRATEGY_RESULTS.json`.
  - Includes **actual Bard/Maestro exchange commitment** and **actual Priest Vae commit**, with Hand/Discard and healed HP verified.
  - Includes duplicate limits, live/dead Priest, live/dead Archer, insufficient Mana, relevant combo detection, Lun BLOCK preservation, Hand Limit preference, and Beginner unchanged.
- RC35 engine regression: **20/20 PASS** (`RC35_1_ENGINE_REGRESSION.cjs`).
- Difficulty/AI regression: **16/16 PASS** (`RC34_DIFFICULTY_AI_TESTS.cjs`).
- JavaScript syntax: PASS, `node --check` on `engine/shared-app/app.bundle.js`.
- RC34 targeting QA suite is superseded for RC35. Its unmodified 17-case test assumes Beginner defaults use Intermediate targeting; 10/17 pass on **both** RC35.1 input and RC35.2. The separate current difficulty suite passes. This is a pre-existing test assumption, not a newly introduced Note regression.

## Verification limits

Full natural match and live mobile UI have **not** been run in this revision. Chromium navigation is blocked by environment (`ERR_BLOCKED_BY_ADMINISTRATOR`) for both file and localhost; no visual-browser PASS is claimed. The included controlled engine tests run real commits for the two Note flows, but not an exhaustive full-match simulation.
