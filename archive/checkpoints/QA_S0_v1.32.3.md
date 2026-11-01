# Grandis Legacy Deck Builder v1.32.3 — Season 0 QA Report

**Build basis:** Deck Builder v1.32.2, original Style 1 and original Style 2. **Authority unchanged:** OSA v1.9.19, Rulebook v2.7.1. **No updates to card art or original CSS.**

## Changes

1. **Available Cards fixed (both styles).** The filter now reads the actual Season 0 Skill eligible class/rank rows from OSA, the selected Hero progressions' Hero-card access paths, their dual/hybrid active lineages, and Ultimate named-owner restrictions. Previously every Skill/Event/Item was always marked compatible. Generic Items and Events remain available to a selected Hero. With no Hero selected the Available mode is disabled; Style 2 initially displays All Cards. **All Cards intentionally continues to show and allow off-class draft cards; construction legality and usability warnings are separate policies, as in OSA.**
2. **Main Deck working capacity 60 (both styles).** Adding normal copies works through 60, never 61; normal per-card 3-copy / Ultimate and Special Event 1-copy limits still apply. UI counter continues `N/50` to show the official target. S1 import still preserves matched cards (e.g., 60→52); no automatic trimming. Incoming S0 drafts above 60 are rejected. Draft serialization and re-import accept 60.
3. **EXPORT DECK requires precisely 50 and otherwise-valid construction.** Both buttons are visibly disabled at 0–49 and 51–60, or invalid 50-card decks; an independent check in the export function blocks bypass. The OSA 50/12/12 validator itself was not modified.

## Validation performed

- `npm run check`: **23/23 checks PASS** (9 static/source/legality, 6 real legacy S1 migration, 8 new availability/workspace). All 204 artwork hashes still match the OSA v1.9.19 catalog, 180 current S0 / 24 fallback S1; 11 progression packages retained; all 38 unavailable slots excluded.
- `npm run check:browser:s0`: **both original styles PASS** in headless Chromium with original CSS and JS inlined. Chose Hero(s) via the existing UI; verified `Available Cards` includes Archer Skill but not off-class Mage Skill, excludes the wrong Archer Ultimate owner, and `All Cards` still shows off-class cards. Built actual 50-card legal 12-Legacy/12-Shard deck, downloaded valid JSON, then added to 51–60 and observed export disabled at each boundary. Additional add at 60 leaves deck unchanged; serialization → import restores 60; removing 10 to exactly 50 re-enables export. Zero uncaught JavaScript errors.
- OSA v1.9.19, archived Season 0 catalog and artwork, v1.32.2 original core stylesheets, and the Style 2 approved hover/popup changes **unchanged**.
- Browser automation uses `page.set_content` with original CSS/JS inlined because Chromium localhost/file URL navigation is blocked by this QA environment; consequently full browser `localStorage` behavior across a real navigation was **not retested**. The shared draft serialization and import/restore pipeline were exercised using JSON round-trip in both styles.

## Scope boundary

This release changes the Deck Builder only. It does not migrate Season 0 gameplay effects, change OSA legality policy, modify Hero/Legacy/card data, or promote OSA to v2.0.0. A full in-browser manual smoke test by the user is still recommended.
