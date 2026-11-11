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

1. This package targets the **existing** `GrandisLegacyTCG/Grandis-Legacy-Website` repository. Replace its published files with **all extracted files and folders from this package root**, not a nested folder or ZIP file. Keep the root `index.html`, `.nojekyll`, and `CNAME`.
2. In the repository, configure **Settings → Pages → Deploy from a branch**, branch `main`, folder `/ (root)`; GitHub Pages publishes `index.html` automatically.
3. Keep `CNAME` with exactly `grandislegacytcg.web.id`. Verify **Settings → Pages → Custom domain** is `grandislegacytcg.web.id` after uploading; if GitHub cleared it when the former repo contents were replaced, enter it and save again. Do not delete `.nojekyll`. No Node install, build step, backend, secrets or `.env` are needed.
4. For local testing, serve the repository directory with any static HTTP server (for example `python -m http.server 8000`), then open `http://localhost:8000/`. Direct `file://` usage can differ from a hosted website.

**GitHub operations are intentionally NOT performed by the assistant.** The file replacement and Pages settings changes must be done manually by the project owner.

## Included / excluded

Included: only active HTML/CSS/JavaScript, all R3.6 card artwork, game UI/audio, needed keyword icons, and the player-facing Rulebook v3.2 PDF. Both apps reuse the same `card-art/` files; all 242 Deck Builder image files were verified byte-for-byte identical to VS AI assets before deduplication. Deck Builder paths are routed to the shared assets for both styles. Fonts use the existing Google Fonts stylesheet with browser fallback (no font binary is packaged). The required custom-domain CNAME and player-facing lobby navigation/Hand artwork fallbacks are kept.

Excluded: standalone QA suites and logs; developer notes and docs; manifest/hash history; source snapshots; unused legacy runtime files; season1 data; archived backups; test fixtures; unpublished source authority exports; PvP and tutorial applications; tracking tag. Original standalone archives remain unchanged outside this repository.

## Rules / release compatibility

VS AI RC38's **application-specific automatic Mana Deck composition** is preserved, while Deck Builder v1.64 keeps its independent rulebook deck-construction checks. Imported JSON may carry Mana/Shards, but VS AI rebuilds 12 shards from the selected Hero base classes for both player and AI as in the supplied RC38 release.

This is a static release candidate, not a promise that every gameplay interaction is bug-free. Validate it in the deployed GitHub Pages URL before public release.

## 2026-11-12 GitHub Pages 404 correction

The previous runtime-only package unintentionally removed the existing repo's root `CNAME`; the old published repo used `grandislegacytcg.web.id`, and removing it can make GitHub Pages return 404 on that domain. The corrected package restores `CNAME` and the previous lobby-navigation/Hand-art fallback behavior. If GitHub Pages still returns 404 after uploading, verify that `main`/`(root)` is the publishing source, the Pages Custom domain matches the `CNAME`, and the latest Pages build succeeded.

The lower file count is mostly intentional: 242 byte-identical card images have been deduplicated into `card-art/`. Developer/test files and inactive older UI scripts remain outside the repository.
