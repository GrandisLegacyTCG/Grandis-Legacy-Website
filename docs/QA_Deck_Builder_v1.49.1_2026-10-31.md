# Grandis Legacy Deck Builder v1.49.1 — UI QA

Tested both Style 1 and Style 2 at desktop/medium/compact viewport widths of 1600×900, 1200×800, 900×760 and 740×900 using Chromium. Source is v1.49.0 plus targeted v1.49.1 hotfix. No gameplay / data changes.

| Reported item | Tested | Observed |
|---|---|---|
| Deck View card overlap | 8 displays | 0 overlapping cards, stable 5:7 card dimensions, no gap between card rows other than intended 14/10px. |
| Deck View right edge | 8 displays | Right gap is scrollbar width (15px), without additional blank padding. |
| Deck View Style 1 / Style 2 parity | 4 paired viewports | Dialog and scrolling grid dimensions/coordinates match exactly. |
| Style 1 Mana Cost | 4 viewports | Transparent background and 0px border/padding; compact height about 53px desktop; slider maintains double range. |
| Review spacing | 2 paired desktop viewports | Dynamic Class/Rank widths computed with 19px per divider side = 38px total. |
| Review Condition | Both styles | Border 0px, retained panel background/text/badge. |
| Style 1 Hero package | Desktop & compact | At wide 790px library, 3 Rank cards + info are side-by-side; at 570px library, info moves beneath, three Rank cards do not overlap. |
| Style 2 Hero picker | 1600 / 900 / 740 | Two columns on wide; single column at compact widths; list scrolls vertically. |
| Runtime exceptions | 8 displays | No page errors. |
| Source sanity | npm run check | PASS; 242/242 image files per style found and Season 0 card data/keyword tests passed. |

**QA limitation:** Chromium in the test environment blocks HTTP localhost and file: navigation. Tests mount the real HTML, CSS, and JS inline. Visual screenshots use replacement card art because asset URLs cannot be resolved from the inline page; packaged artwork was checked independently and left unchanged.
