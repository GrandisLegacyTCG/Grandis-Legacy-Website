# v1.55 — Hero Artwork Scroll Hotfix (same version)

Base: v1.55 Legacy Rules Fix. Both Style 1 and Style 2 use the same `css/s0-hero-sizing-v1.55.css`.

## Problem
The 96%-size correction applied to the *modal width*, but did not guarantee that the artwork and scrollable body fit into a short viewport (for example 1200 CSS px × 620 CSS px with browser zoom). Restoring the v1.53 layout alone was insufficient.

## Correction
- Preserve the previously approved popup, content structure and fonts.
- Make the actual Hero artwork width `min(96%, (100dvh - 262px) × 5/7)`; height follows its 5:7 aspect ratio. The viewport-height condition reserves room for header, Rank Lineages footer and content padding.
- Preserve 16px content bottom padding above the footer.
- When information text itself exceeds the remaining body height (some Rank II/III cards, very short screens), retain scrolling rather than hide information.
- Do not touch the Legacy RULES hotfix or any card data.
