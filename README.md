# Grandis Legacy Website — Direct GitHub Pages Repository

**Package:** VS AI Season 0 v1.0 RC30 + Deck Builder v1.60  
**Date:** 6 November 2026  
**Target:** `https://grandislegacytcg.web.id/`  
**Deployment mode:** GitHub Pages → Deploy from a branch → `main` → `/ (root)`.

This repository is **already built** for static hosting. There is no `apps/`, `_site/`, or integration build step required at deployment time. `index.html` is at the **repository root**, as in the previous GitHub-ready repositories.

## Routes

| URL | App |
| --- | --- |
| `/` | VS AI Season 0 RC30 (temporary homepage) |
| `/deck-builder/` | Deck Builder v1.60 Style 1 |
| `/deck-builder/style-2/` | Deck Builder v1.60 Style 2 |
| `/deck-builder/style-1/` | Redirect to Style 1 |

- VS AI Lobby: **GO TO DECK BUILDER** links to `/deck-builder/`.
- Deck Builder Style 1 and 2: **GO TO VS AI** links to `/` (including mobile navigation).
- Grandis Legacy logo links to `/` (currently VS AI; later Main Website).
- PvP navigation is retained **hidden**, but PvP is **not shipped**.
- The VS AI favicon matches the v1.60 Deck Builder favicon.

## Repository layout

```text
index.html                    VS AI RC30 entry point
assets/                       VS AI assets; shared favicon
card-art/                     VS AI card artwork
engine/                       VS AI static engine/runtime assets
runtime/                      VS AI runtime data
shared-app/                   VS AI app UI and logic
shared-ui/                    VS AI shared UI
site-integration.css          Added navigation style (VS AI)
deck-builder/
  index.html                  Deck Builder Style 1
  style-2/index.html          Deck Builder Style 2
  style-1/index.html          Redirect to Style 1
  assets/, css/, data/, js/   Deck Builder's own runtime assets
CNAME                         grandislegacytcg.web.id
.nojekyll                     Disables Jekyll processing
UPLOAD_TO_GITHUB.md           Upload directions
```

## Updating later releases independently

The apps have **separate runtime trees**, but some integration changes must be preserved whenever new standalone files are copied in. Do **not** overwrite the entire repository with a single app ZIP.

### New VS AI release

Update the VS AI files at the repository root (`index.html`, `assets/`, `card-art/`, `engine/`, `runtime/`, `shared-app/`, `shared-ui/`), while leaving `deck-builder/` intact. Reapply or verify:

1. Root `index.html` includes `assets/favicon.png` and `site-integration.css`.
2. VS AI Lobby navigation in `shared-app/app-runtime.js`: logo link `./`, **GO TO DECK BUILDER** `deck-builder/`, PvP hidden.
3. The common favicon is still the Deck Builder favicon.
4. Root `CNAME`, `.nojekyll`, and the repository `README.md` remain present.

Upstream markup may change; validate new insertion points rather than blindly replacing code strings. Preserve the new game's own behavior and assets.

### New Deck Builder release

Update **only** `deck-builder/` runtime files. Reapply or verify on both `deck-builder/index.html` and `deck-builder/style-2/index.html`:

1. Grandis Legacy logo goes to root (`../` on Style 1, `../../` on Style 2).
2. Desktop and mobile **GO TO VS AI / VS AI** links point to root.
3. Application navigation is visible on both styles; PvP links stay hidden.
4. Style switching, existing deck persistence, and Deck Builder export are intact.

Do not overwrite VS AI root files or remove the root `CNAME`.

## Test and safety notes

- Source versions are RC30 and v1.60 as provided for integration. RC30 is a *release candidate*, not a newly certified final release.
- Site generation and static navigation/integrity checks were performed. **Browser end-to-end and live GitHub Pages tests were NOT VERIFIED**; the local Chromium browser was blocked by the execution environment's administrator policy.
- Saving decks on the same origin *should* preserve localStorage across route moves, but live storage persistence and actual JSON import from v1.60 into RC30 still need browser verification. Export/back up important decks before switching the root deployment.
- The old `grandislegacytcg.github.io` website/repository was **not altered** to create this ZIP.
- **Pushing to `main` of the domain's live Pages repository may publish the new homepage immediately.** Back up that repository first. The ZIP itself has not been deployed.
