# Grandis Legacy — GitHub Pages (one direct repository)

**Integrated 7 November 2026:** VS AI Season 0 **v1.0 RC31** and Deck Builder **v1.61**. **No version increase.**

**UI fix in this package:** VS AI player Hand now preloads Opening Hand and later Draw artwork, displays the original Main Deck card back while an image is pending, and fades in the card front after decoding. This is a narrow UI fix; game rules, AI, Draw logic, and Deck Builder are unchanged.

**GitHub Pages:** Deploy from branch `main` → `/(root)`; custom domain `grandislegacytcg.web.id`. The `index.html`, `CNAME`, and `.nojekyll` files live directly in repository root. No Actions/build scripts needed.

| Path | Application |
|---|---|
| `/` | VS AI RC31 (temporary homepage) |
| `/deck-builder/` | Deck Builder v1.61 — Style 1 |
| `/deck-builder/style-2/` | Deck Builder v1.61 — Style 2 |

**Navigation**: VS AI Lobby → Deck Builder; Deck Builder both styles → VS AI. Grandis Legacy logos → `/` (today VS AI, future main site). PvP navigation is preserved hidden and there is no PvP app bundled. The VS AI favicon comes from RC31's `engine/assets/favicon.png`, verified byte-identical to DB v1.61's `assets/favicon.png`.

The entire VS AI runtime remains in the repository root. The complete Deck Builder *runtime* stays isolated in `deck-builder/`. Use the exact standalone version source when upgrading each app. Don't overwrite the other app folder or shared integration files. Consult [`docs/INTEGRATION_NOTES.md`](docs/INTEGRATION_NOTES.md) for repeatable patches and QA. Upload instructions: [`docs/UPLOAD_TO_GITHUB.md`](docs/UPLOAD_TO_GITHUB.md).

VS AI is still an RC, not a final QA-approved release. Browser gameplay/import and live GitHub Pages remain **NOT VERIFIED** until tested. Pushing to an existing live GitHub Pages branch may immediately update the domain. Make a repository backup and export important decks before switching routes.

**Root-clean layout:** Root holds only `index.html`, `CNAME`, `.nojekyll`, and this `README.md`. Integration CSS lives in `assets/css/`; integration/upload/QA notes live in `docs/`. This layout does not add any build step.
