# Grandis Legacy Deck Builder v1.49.1 — 2026-10-31

Hotfix on top of v1.49.0; no card database, gameplay, deck-construction rules or persistence changes.

1. Both styles: Deck View cards return to stable fixed-size proportional tiles using a wrapping layout. Cards cannot overlap rows. The last card in a full row is distributed close to the right scrollbar without extra right-side padding.
2. Style 1: Mana Cost range uses the compact unboxed layout of Style 2, retaining its two-column width.
3. Both styles: Review Class/Rank/Damage/Healing column divider padding is 19px each side (38px combined); width measurement accounts for the longest row label or value.
4. Both styles: remove outline around Review CONDITION container, retaining badge, background and padding.
5. Style 1: Hero selection cards and info panel switch to stacked arrangement based on available library width; at narrow size the three Rank cards remain in a row. Style 2: Hero chooser uses a single-column list at compact window widths.

Regression check: syntax, load, layout boxes, scrolling, card preview, filter and desktop/mobile sizing.
