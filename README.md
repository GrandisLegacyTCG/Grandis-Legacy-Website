# Grandis Legacy — GitHub Pages (one direct repository)

**Integrated 7 November 2026:** VS AI Season 0 **v1.0 RC31** and Deck Builder **v1.61**.

**GitHub Pages:** Deploy from branch `main` → `/(root)`; custom domain `grandislegacytcg.web.id`. The `index.html`, `CNAME`, and `.nojekyll` files live directly in repository root. No Actions/build scripts needed.

| Path | Application |
|---|---|
| `/` | VS AI RC31 (temporary homepage) |
| `/deck-builder/` | Deck Builder v1.61 — Style 1 |
| `/deck-builder/style-2/` | Deck Builder v1.61 — Style 2 |

**Navigation**: VS AI Lobby → Deck Builder; Deck Builder both styles → VS AI. Grandis Legacy logos → `/` (today VS AI, future main site). PvP navigation is preserved hidden and there is no PvP app bundled. The VS AI favicon comes from RC31's `engine/assets/favicon.png`, verified byte-identical to DB v1.61's `assets/favicon.png`.

The entire VS AI runtime remains in the repository root. The complete Deck Builder *runtime* stays isolated in `deck-builder/`. Use the exact standalone version source when upgrading each app. Don't overwrite the other app folder or shared integration files. Consult `INTEGRATION_NOTES.md` for repeatable patches and QA.

VS AI is still an RC, not a final QA-approved release. Browser gameplay/import and live GitHub Pages remain **NOT VERIFIED** until tested. Pushing to an existing live GitHub Pages branch may immediately update the domain. Make a repository backup and export important decks before switching routes.
