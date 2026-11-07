# Grandis Legacy — GitHub Pages (VS AI RC32 + Deck Builder v1.62)

Direct static website for **grandislegacytcg.web.id**. Version labels of both source apps stay unchanged.

- `/` — VS AI Season 0 **v1.0 RC32** (temporary landing page).
- `/deck-builder/` — Deck Builder **v1.62**, Style 1.
- `/deck-builder/style-2/` — Deck Builder **v1.62**, Style 2.
- PvP is **not bundled**; its navigation remains hidden. The main website is not bundled.
- Logo links point to the domain root, while the deck-builder/VS AI links work on one domain.
- Existing Deck Builder favicon is identical to the RC32 favicon at `engine/assets/favicon.png`.
- The previous Hand artwork loading prefetch/placeholder fix is retained on RC32.

## Publishing

Copy the **contents** of this archive directly into the GitHub repository root. On GitHub Pages choose **Deploy from a branch**, `main`, `/(root)` and verify custom domain `grandislegacytcg.web.id`. Don't upload the ZIP as a single file. To avoid stale files from prior versions, sync the tracked repository against this archive rather than only adding files. Backup the live repository before replacing it.

No build step or GitHub Actions required. This archive is a **deployable site snapshot**: historical docs, test fixtures and standalone archives have been excluded; current app runtime/assets are retained. Read `docs/INTEGRATION_REPORT.md` for exact QA scope. GitHub and the existing website were not changed by creating this archive.
