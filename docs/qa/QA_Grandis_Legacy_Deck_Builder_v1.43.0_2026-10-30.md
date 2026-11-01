# Grandis Legacy Deck Builder v1.43.0 — QA — 30 October 2026

Scope is limited to Card Review popup, based on v1.42.0.

- **Artwork**: width scaled to 75% of v1.42.0 (measured CSS visual width: 355.8→266.9px at 1440×900, 258.5→193.9px at 900×900, and 245→184px at 390×844). Hero Review artwork remains unchanged.
- **Skill effect**: all 29 numeric-only Physical/Magical Attack effect rows now read `Deal <value> Physical damage.` or `Deal <value> Magical damage.` in the review, with separate numeric damage metrics preserved. Non-numeric effects such as Hammer of Justice Stun are unchanged.
- **Browser tests**: Style 1, Style 2, and Style 1 alias, at 1440×900 / 900×900 / 390×844. Browser renderer runs by inlining HTML/CSS/JS due to direct local HTTP navigation restrictions in this environment. No page JS exceptions.
- **Static QA**: `npm run check` PASS, including 7/7 card-artwork/metadata suites and both style image audits. 271/271 input artwork/data files unchanged by hashes against v1.42.0.
- **Packaging**: npm metadata and release notes updated; assets, gameplay validation, deck construction, import/export, VS AI, PvP untouched.

Not tested: actual opening of `index.html` by double click on Windows; local HTTP browser navigation blocked by environment. Designer approval/locking still pending.
