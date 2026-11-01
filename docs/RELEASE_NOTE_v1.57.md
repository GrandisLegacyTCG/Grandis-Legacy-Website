# Grandis Legacy Deck Builder v1.57 — Hero Artwork Fit

Date: 2026-11-01  
Baseline: v1.56 Hero Review Alignment Fix  
Scope: Hero Review presentation in Style 1 and Style 2 only

## Change

- Increase Hero Review artwork size, constrained by the middle panel height so the card's bottom nearly reaches the HERO LINEAGES separator without touching it.
- Expand the artwork grid column to 35% on desktop, without changing the outer popup width, height, header, or footer.
- Artwork keeps a 5:7 aspect ratio; its CSS width is the smaller of the column width and the height-constrained width, reserving 16px bottom padding as before.
- Rank I has no image-induced scrollbar at tested desktop viewport sizes; Rank II/III may still scroll for longer text.
- Mobile (<761px) continues using the prior stacked Hero Review presentation.
- Non-Hero Review popup layout, fonts, deck validation, card data, Legacy RULES, and artwork files are unchanged.

## QA

- Isolated Chromium render using the actual HTML modal markup and linked CSS for both styles at 1600×770, 1435×752, 1200×620, 900×700, and 390×844.
- At each tested viewport, Rank I/II/III popup height and HERO LINEAGES position matched within each style. Rank I had no middle-panel overflow at desktop sizes; Rank II/III retained scrolling as needed.
- Browser checks are an isolated modal render with representative content. Production behavior with all assets still merits inspection.
