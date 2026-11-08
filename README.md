# Grandis Legacy — Direct GitHub Pages (VS AI RC34 + Deck Builder v1.62)

Manual-upload package prepared on 2026-11-08 from the attached VS AI Season 0 v1.0 RC34 final release and the existing integrated Deck Builder v1.62. Baseline repo: `GrandisLegacyTCG/Grandis-Legacy-Website`, `main`, commit `5fd2bc590147e287d81db6c5abb8e4eb09fe3bf2` (`GL S0 : VS AI RC33 + DB v1.62`).

- `/` — VS AI Season 0 v1.0 RC34, temporary homepage.
- `/deck-builder/` — Deck Builder v1.62 Style 1.
- `/deck-builder/style-2/` — Deck Builder v1.62 Style 2.
- Logos link to `/`; navigation between VS AI and Deck Builder is retained.
- PvP remains hidden. PvP backend and Main Website are not included.
- Existing player Hand artwork preload/card-back loading safeguards are retained.
- RC34 production changes come from the attached final RC34 source; integration edits are limited to website navigation, artwork loading safeguards, and content-hash cache keys.

## RC34 source changes retained

RC34 replaces the RC33 engine/runtime and battlefield UI files, adds the mobile landscape lobby script, and carries the RC34 QA artifacts supplied with the final source. Card Played is newest-first while Battle Log remains chronological (oldest to newest).

## Upload manually

Extract the ZIP first. Copy its **contents** to the repository root, where `index.html`, `CNAME`, `.nojekyll` and the application folders belong. Do not upload the ZIP as a website file and do not add an extra enclosing folder.

The UPDATE_ONLY ZIP contains only files added or changed against commit `5fd2bc590147e287d81db6c5abb8e4eb09fe3bf2`; no deletion is required. The FULL_REPO ZIP contains the complete combined site.

GitHub Pages remains **Deploy from a branch -> main -> /(root)** with custom domain `grandislegacytcg.web.id`. No GitHub Actions or build step is required. This preparation does not push, commit, open a pull request, or deploy to GitHub.

See `docs/MANUAL_UPDATE_RC34_ID.md`, `docs/INTEGRATION_QA.md`, and `docs/SOURCE_PROVENANCE.json`. The RC32/RC33 source README snapshots remain historical; the active VS AI release is RC34.
