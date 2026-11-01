# QA — Grandis Legacy Deck Builder v1.46.0 — 2026-10-30

## Scope
Style 2 only. Style 1 remains byte-identical to v1.45.0. Card/Hero Review and source card authority unchanged.

## Verified
- Five user-supplied JSONs incorporated in exact 1–5 order: Red-White, Blue-Red, Yellow-Blue, Green-Yellow, White-Green.
- Each starter includes 50 Main Deck cards, three Hero+Legacy packages, 12 derived Mana/Class Shards.
- All five pass bundled Season 0 `starter_safe` validator, including active Hero access and Ultimate restrictions: PASS (zero issues).
- Center position artwork IDs: `S0-WAR-H007`, `S0-MAG-H007`, `S0-THF-H007`, `S0-ARC-H007`, `S0-CLE-H007`; matching available artwork: PASS.
- Starter selector enabled in Style 2, preview based on CENTER formation Hero; no changes to Style 1.
- Style 2 responsive CSS targets 45:55 panel widths, 4 Card Library columns and 6 Main Deck columns, compact controls, and height-aware card sizing.
- Node JavaScript syntax: PASS; build manifest checksum: PASS.
- Original ZIP comparison: only original `style-2/index.html`, `style-2/js/app-s0.js`, and manifest have modified bytes. All `style-1/`, card data, artwork, shared UI/review files unchanged.

## Browser verification boundary
Automated Chromium navigation was attempted over local HTTP and via `file://`, but both were blocked by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). Visual breakpoints and interactions were **not** falsely marked as browser PASS; user should inspect on their desktop, especially the three-row fit on different viewport heights.

## Existing behavior retained
- The Starter Deck button prompts for confirmation if current deck is dirty, then replaces current deck after selection.
- No gameplay rules, copy limits or validation criteria altered.
