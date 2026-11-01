# Grandis Legacy Deck Builder v1.58 — Website Release (1 November 2026)

Baseline: **v1.57**. This is a static GitHub Pages release for the new standalone `grandislegacytcg.web.id` website; does not touch the prior Website v1.40 repo.

1. Hide unavailable VS AI/PvP buttons, desktop navigation and mobile hamburger. Keep markup as a later reactivation point; no external navigation to the old website from the Deck Builder logo.
2. Canonical routes: `/` = Style 1 and `/style-2/` = Style 2. Both style-switch links use these simple paths. The legacy `/style-1/` URL redirects to `/`, preserving any existing hash handoff.
3. Shared Deck workspace is persisted via same-origin localStorage for hosted navigation **without** appending `#gl-s0-workspace=` to URLs. The existing encoded-fragment handoff remains available as fallback for `file://` or cross-origin use.
4. Hero Review now uses the shared keyword badge renderer on Hero descriptions. The four Archer Hero cards (Korvak/Sylvan, Ranks II and III) normalize the transcription "Range Attack" to the artwork-printed **RANGE** keyword, and show its explanation. This changes the Review UI only, not underlying Season 0 card data, gameplay, or keywords metadata.
5. Both styles use the same utility for keyword rendering. No changes to existing keyword positioning, CSS typography, Hero sizing, gameplay, or individual card assets.

Deployment: unpack the **contents** of the ZIP's main folder into the GitHub Pages repository **root** (not the enclosing ZIP folder). Retain `.nojekyll`. Cache-busting query strings for changed shared assets are set to 1.58.
