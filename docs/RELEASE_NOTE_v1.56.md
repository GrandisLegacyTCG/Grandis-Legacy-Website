# Grandis Legacy Deck Builder v1.56 — Hero and Skill Review Correction

Date: 2026-11-01
Baseline: v1.55 Hero Artwork Scroll Fix + Legacy Rules Fix
Approval: pending user review

## Changes

1. **Hero Review popup**: restore v1.53 desktop geometry (1160px maximum width and normal 663px Rank I height, viewport-limited). Unlike v1.55, no 96% popup-width reduction.
2. **Hero artwork**: scale the actual card image to 96% of the v1.53 width; on shorter screens, shrink further to prevent image-only scrolling. Preserve its 5:7 aspect ratio. Remove wrapper/background/shadow styling.
3. **Skill Review columns**: use real DOM text measurement (actual rendered font/letter spacing), and disallow text wrapping for Class, Rank and metric values. Keep the requested 38px on both sides of each divider.
4. Keep the existing 16px bottom spacing before Hero Lineages.

## Regression checks

- Both styles: reviewed Rank I, II, III at 1600x770, 1440x740, 1200x620, 900x700 and 390x844.
- At 1600x770, popup width and Rank I height match the v1.53 baseline (1160x663); artwork is 294.9px wide vs v1.53's 307.2px (96%).
- Across both styles and all 5 viewports, opened all 155 Skill Cards to check Class, Rank and metric values do not wrap or exceed their columns.
- Validated no JS page errors, images maintain aspect ratio, Hero Rank I does not need extra scroll on tested desktop viewports, and both styles render identical popup geometry.
- Note: Rank II/III and mobile may scroll where their text cannot fit the available height.

No card data, Legacy rules, game behavior, typography, deck validation, artwork files or other popup types changed.

## Pending-approval Hero Review alignment correction (same v1.56)

- Hero Rank I/II/III now share one fixed outer modal height at each viewport; header and Hero Lineages footer remain at identical positions while switching ranks.
- Main content is the only scrollable area; Rank I should not display a scrollbar when its information fits. Text-heavy Rank II/III keep scrolling as required.
- Hero artwork responds to **available vertical space**, without changing the popup dimensions, card aspect ratio, font, gameplay or other review dialogs.
- This supersedes the older note above about Rank I's natural/663px popup height.
