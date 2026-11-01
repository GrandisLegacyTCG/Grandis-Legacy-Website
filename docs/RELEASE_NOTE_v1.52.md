# Grandis Legacy Deck Builder v1.52 — Popup Parity

**Release:** 1 November 2026  
**Baseline:** v1.51  
**Status:** Ready for review

## Design decisions implemented

| Function / Component | Common reference / behavior |
|---|---|
| Card Review | Style 1 layout and typography for Skill, Hero, Item, Event, Legacy views |
| Missing information placeholder | Em dash `—`, from Style 2 |
| Deck View | Style 2 layout and Skills / Events / Items ordering, matching empty state |
| Confirmation Dialog | Style 2 visual style and action-buttons, Style 1 detailed Hero-change wording |
| Starter Deck Dialog | Style 2 dedicated five-Starter layout, shared by both styles |
| Close control | Same 25px Noto Sans X, no border/background/stroke; center-aligned |
| Responsive modals | Matched widths, spacing, max-height and breakpoint behavior |

The *navigation* to Starter Deck is intentionally different: Style 1 retains its Choose How to Begin dialog, while the Starter list itself is identical. The main-page layouts, navigation and filters remain distinct. The shared modal CSS is loaded by root and both style-specific entrypoints; the shared JS is called from both styles for Starter-list markup and confirmation.

## Testing performed

- Automated comparison of Card Review rendered information across all **242** Season 0 card entries: **0 semantic differences** after normalizing expected relative asset URL paths.
- Automated Chromium navigation, Starter Deck loading, and modal geometry checks at **390**, **900** and **1600** CSS px in both styles: **passed**.
- Both styles loaded first Starter Deck as **Red-White Deck** and displayed 50 cards in QA.
- Modal X has zero border and transparent background; review, deck, confirmation, starter geometry and horizontal page overflow assertions passed.
- `npm run check`: passed; card/artwork integrity unchanged.

## Invariants

Season 0 legality, card data, artwork, deck validation, import/export and gameplay rules remain unchanged. All unaffected page typography and both style navigations are retained. Visual testing uses a local browser harness and does not replace final on-site QA.
