# Grandis Legacy — Direct GitHub Pages (VS AI RC32 + Deck Builder v1.62)

Built from the standalone source ZIPs currently attached to this project. Original application version numbers were **not changed**.

- `/` — VS AI Season 0 RC32 (temporary homepage).
- `/deck-builder/` — Deck Builder v1.62 Style 1.
- `/deck-builder/style-2/` — Deck Builder v1.62 Style 2.
- Grandis Legacy logos link to `/`; VS AI ↔ Deck Builder navigation is enabled.
- PvP buttons are hidden. PvP backend and Main Website are not included.
- The VS AI Hand-artwork preload / card-back safeguard is retained.

## GitHub Pages deployment

Extract ZIP and copy its **contents** directly to the root of the Pages repo, not the ZIP itself. Configure **Deploy from a branch** → **main** → **/(root)** and keep custom domain `grandislegacytcg.web.id`. Back up the current repo before replacing files. Synchronize deleted files as well as added/changed files, or orphaned artifacts from the previous upload may remain.

No GitHub Actions/build required. The root contains only `.nojekyll`, `CNAME`, `index.html`, `README.md`; all release/source provenance is under `docs/`.

See `docs/SOURCE_PROVENANCE.json` for the SHA-256 of both source ZIPs and `docs/INTEGRATION_QA.md` for test results and limitations.
