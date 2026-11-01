# Deck Builder v1.58 — Rulebook v2.9 review correction (2026-11-01)

**Version remains v1.58.** Built from the v1.58 GitHub Ready corrective package.

- Keyword explanations in `js/s0-review-clarity.js` checked against official Player Rulebook v2.9, page 13. Updated the REVIVE wording to follow printed v2.9. **MANA BURN and MANA STEAL explanations deliberately left unchanged at designer request.**
- Status explanations brought into line with Player Rulebook v2.9, page 14, using the printed subject/verb wording (Bleed, Burn, Freeze, Poison, Sleep, Stun). No status mechanics changed.
- Visually audited bottom RULES footer bands on all 242 Season 0 card artworks. All 15 Ultimate Skill footer RULES transcribed from the R3.4 card artwork, including named owner and actual Color Mana Shard (Green, White, Blue, Yellow, Red). The 3 Special Events (S0-EVT-001/003/008) now show their printed deck-limit RULES. The existing 10 Legacy RULES remain unchanged. Other cards in the current 242-artwork set have no printed bottom RULES band.
- The shared Card Review enhancer replaces old Ultimate footer text for both styles and inserts Special Event RULES before keyword explanations. Does not rewrite `data-s0.js`, card effect text or deck construction logic.
- Ultimate RULES container stroke removed via shared stylesheet; existing background, typography, padding and layout retained.
- GitHub custom domain `CNAME` and local file navigation hotfix from the prior v1.58 package retained.

## Files changed

- `js/s0-review-clarity.js`
- `css/s0-rulebook-v2.9-review-v1.58.css` (new)
- `index.html` and `style-2/index.html` (shared CSS/JS cache refresh)
- `docs/HOTFIX_v1.58_RULEBOOK_V2.9_REVIEW.md` (new)
- `README.md`, `FILE_MANIFEST_SHA256.csv` (release documentation and hashes)
