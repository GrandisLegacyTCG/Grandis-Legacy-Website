# Grandis Legacy Deck Builder — v1.51 (31 October 2026)

## Change from v1.50

- **Deck View ordering parity:** Style 1 now uses the same `mainDeckSort` comparator as Style 2 (`Skill` → `Event` → `Item`, with card-ID ordering within a family). In v1.50 Style 1 sorted the entire view by card ID, making the two Deck Views appear different for the same list.
- The shared modal geometry and CSS were already identical between both styles, so no CSS, typography, artwork, filtering, card data, validation, or import/export changes were made.

## QA

- Compared the rendered order of the same mixed-family deck in Style 1 and Style 2.
- Verified computed geometry and card order at multiple viewport widths.
- Verified syntax and package manifest integrity.
