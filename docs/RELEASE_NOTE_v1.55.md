# Grandis Legacy Deck Builder v1.55 — Hero Review Popup Sizing

**Release:** 1 November 2026  
**Baseline:** v1.54  
**Scope:** Hero Review popup only, Style 1 and Style 2.

## Change

- Restore v1.53's Hero Review layout behavior by deleting the v1.54 short-height artwork clamp, which made the review artwork shrink more than intended in short viewports.
- Set popup width to 96% of the desktop v1.53 baseline (1180px => 1132.8px), and 96% of the small-desktop v1.53 width limit. Artwork reduces proportionally by ~4%, without stretching or cropping.
- Preserve 16px bottom padding after the final review section and before the Hero Lineages divider.
- Maintain v1.53's content-height behavior for Rank I/II/III. The main content can scroll when long, while the header and Hero Lineages footer remain visible.
- Preserve v1.54's Hero Name font weight, BUFF glossary wording, cleaned keyword badges, inline keyword placement, and Dual Class panel. No card data or gameplay changed.

## QA

- Compared computed layout measurements from v1.53, v1.54 and v1.55 for Bromir Oathforge Rank I, II and III in both styles at 1600x770, 1400x730, 1600x950, 900x700 and 390x844.
- In both styles, 1600px artwork width moved from 307px in v1.53 to 295px in v1.55 (~96%). Tablet/small desktop 900px moved from 225px to 216px (~96%).
- Verified both styles match for popup dimensions, art dimensions, content scroll, and visible fixed footer at all checked sizes; verified Noto Sans/card data unchanged by code diff.
- On mobile, the established v1.53/v1.54 layout remains unchanged.
