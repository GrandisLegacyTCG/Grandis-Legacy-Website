# Grandis Legacy Deck Builder — v1.50 (31 October 2026)

## Changes from v1.49.2

- Fixed the Style 1 Mana Cost field to mirror the Style 2 inline range layout: `0 [slider] 9` in the control row. The Effect dropdown, range track, and Reset Filters button have matching vertical alignment. Mana Cost remains two columns wide.
- Prevented horizontal scrolling on narrower desktop viewports by switching the Style 1 two-pane workspace to vertical stacking when its minimum side-by-side width cannot fit. This leaves existing desktop and mobile typography intact.
- Fixed Style 2's Deck Name toolbar so STARTER DECKS, IMPORT DECK, EXPORT DECK, and CLEAR DECK have the same height and alignment as the input.

All three entrypoints import `css/s0-layout-v1.50.css`. Style 1's Mana Cost markup now matches Style 2's inline numeric endpoints. No change to card data, images, rules, deck logic, import/export, or font sizes and weights.

## QA

- `npm run check`: passed.
- `npm run check:ui:v149`: passed for root, Style 1, and Style 2.
- Dedicated browser test at 375–1920 px (22 style/viewport cases): no horizontal page overflow; Style 1 filter controls share their expected centerlines; Style 2 toolbar buttons exactly match Deck Name input dimensions/bottom edge. No JavaScript errors. Inline browser harness does not load image URLs.

Status: Ready for visual review after deployment.
