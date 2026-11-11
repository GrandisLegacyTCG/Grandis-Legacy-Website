# Grandis Legacy — VS AI + Deck Builder (Season 0)

This repository is a **runtime-only static site** combining the unmodified Season 0 gameplay logic and player tools of:

- **VS AI Season 0 RC38** (source package dated 2026-11-12)
- **Deck Builder v1.64** — Style 1 and Style 2 (source package dated 2026-11-12)

## Open the app

- `/` — VS AI gameplay + lobby.
- `/deck-builder/` — Deck Builder, Style 1.
- `/deck-builder/style-2/` — Deck Builder, Style 2.
- `/deck-builder/style-1/` — legacy redirect to Style 1.
- `/rulebook/Grandis_Legacy_Player_Rulebook_v3.2_EN_2026-11-10.pdf` — Player Rulebook.

VS AI and the Deck Builder link to each other via relative URLs, so the site works on a custom domain or under a **GitHub Pages project subpath** (`/<repo>/`). Decks are exported as JSON from Deck Builder and imported through VS AI's deck-selection screen. This package does **not** introduce automatic cross-app sync or change gameplay/card rules.

## Deployment (GitHub Pages)

1. Create a **new, empty repository** and upload **all files and folders from this package root** (not the ZIP as a single file).
2. In the repository, configure **Settings → Pages → Deploy from a branch**, branch `main`, folder `/ (root)`; GitHub Pages publishes `index.html` automatically.
3. Do not delete `.nojekyll`. Relative asset paths allow the same package to run at the Pages project URL. No `npm install`, build step, backend server, secrets, or `.env` are necessary.
4. For local testing, serve the repository directory with any static HTTP server (for example `python -m http.server 8000`), then open `http://localhost:8000/`. Direct `file://` usage can differ from a hosted website.

**GitHub operations are intentionally NOT performed by the assistant.** The repository must be created and uploaded manually by the project owner.

## Included / excluded

Included: only active HTML/CSS/JavaScript, all R3.6 card artwork, game UI/audio, needed keyword icons, and the player-facing Rulebook v3.2 PDF. Both apps reuse the same `card-art/` files; all 242 Deck Builder image files were verified byte-for-byte identical to VS AI assets before deduplication. Deck Builder paths are routed to the shared assets for both styles. Fonts use the existing Google Fonts stylesheet with browser fallback (no font binary is packaged).

Excluded: standalone QA suites and logs; developer notes and docs; manifest/hash history; source snapshots; unused legacy runtime files; season1 data; archived backups; test fixtures; unpublished source authority exports; PvP and tutorial applications; old custom-domain CNAME and tracking tag. Original standalone archives remain unchanged outside this repository.

## Rules / release compatibility

VS AI RC38's **application-specific automatic Mana Deck composition** is preserved, while Deck Builder v1.64 keeps its independent rulebook deck-construction checks. Imported JSON may carry Mana/Shards, but VS AI rebuilds 12 shards from the selected Hero base classes for both player and AI as in the supplied RC38 release.

This is a static release candidate, not a promise that every gameplay interaction is bug-free. Validate it in the deployed GitHub Pages URL before public release.
