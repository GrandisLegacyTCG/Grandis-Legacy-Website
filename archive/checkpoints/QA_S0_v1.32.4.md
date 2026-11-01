# Grandis Legacy Deck Builder v1.32.4 — Final Season 0 Beta Checkpoint

Date: 2026-10-21  
Baseline: Deck Builder v1.32.3 (preserved backup)  
Authority: OSA v1.9.19, Rulebook v2.7.1  
UI: original Style 1 and Style 2 of v1.31 (underlying original theme CSS preserved byte-for-byte).

## Approved changes

1. **Hero class change parity with v1.31:** compatibility uses the existing OSA v1.9.19 `GL_S0_AVAILABLE_CARDS.available` helper, which considers all selected Hero progressions, eligible active classes/ranks, hybrid lineages, and owner-only Ultimate restrictions. When a Hero change makes previously compatible Main Deck cards unusable, a confirmation popup identifies the names and copies. Confirm removes only those cards; Cancel retains both the Hero choice and cards. Existing code's edit confirmation flow restored in both styles.
2. **All Cards:** permits viewing incompatible cards without allowing an off-class addition (click/drag). **Available Cards:** uses exactly the same compatibility predicate, reducing divergence between filtering and deck editing.
3. **Default Available Cards:** activated when a Hero is selected/changed or a deck with Heroes is imported. Filter RESET with selected Heroes returns to Available Cards. With no selected Heroes, Available is disabled and All Cards is shown. Manual All Cards remains possible.
4. **Effect dropdown:** added next to Keyword in both original UI styles. It matches explicit printed Season 0 effect wording, across Skill / Item / Event, not IDs, keyword tags, or card names. Current curated options: Poison, Bleed, Swap, Stun, Burn, Freeze, Draw, Discard. Examples: `S0-ITM-011 Poison Vial` matches Poison; `S0-ITM-019 Warp Scroll` matches Swap; `S0-WAR-002 Power Slash` matches Bleed. Card `S0-ARC-013 Triple Shot` does not incorrectly match Poison merely for quoting "Poison Arrow". This discovery classifier is a convenience text filter and is NOT authoritative Effect Recipe execution.
5. **Starter-safe export:** the Deck Builder UI applies its existing `starter_safe` policy for export, so even a fully 50-card draft containing a Skill that none of the selected Heroes can use is not exported. The independent Rulebook legality authority is unchanged. Workspace remains max 60; exactly 50 legal cards required for export.

## Automated validation

`npm run check` — PASS:
- 9/9 Season 0 source, structure, artwork and original-theme checks
- 6/6 Season 1 → Season 0 import mapping checks
- 8/8 v1.32.3 availability, workspace and authority checks (updated for v1.32.4 parity)
- 10/10 v1.32.4 final behavior, effect and preservation checks
- **Total 33/33 checks.**

`npm run check:browser:s0` — Chromium (original CSS + Season 0 source JavaScript inline in QA harness):
- **Style 1: PASS** — default availability, Poison Skill/Item filtering, off-class add blocked, Hero-change confirmation and removal.
- **Style 2: PASS** — default availability, Poison Item/Warp Scroll Swap filtering, off-class add blocked, Hero-change confirmation and removal.

This is focused Chromium smoke testing, not an exhaustive production-browser matrix. Use local Chrome/Firefox for final interaction testing, especially file import/export and persistence after reload. Previous 60-card behavior is covered in static tests; exact live browser file operation was not retested in this release.

## Source and UI integrity

- `js/data-s0.js`, `js/season0-catalog.js`, `js/s0-availability.js`, `js/season0-legality.browser.js` identical to v1.32.3 (SHA-256).
- Original Style 1 `css/app.css` and Style 2 `style-2/css/app-v1.31.css` identical to v1.32.3 (SHA-256).
- All 204 source artworks remain original and pass existing OSA hash checks.
- OSA v1.9.19, prior Deck Builder v1.32.3, and other versioned backups NOT modified.

## Open items not targeted by this checkpoint

- Empty Season 0 card slots remain excluded; new card artwork and effect recipes are deferred.
- The Effect filter uses cautious detection of explicit text patterns; it is not a semantic oracle and will be extended when future card artwork/wording is finalized.
- Neither application UI's original hover/zoom positioning nor modal layout was redesigned in this release.
