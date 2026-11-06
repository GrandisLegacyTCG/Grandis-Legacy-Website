# Upload to GitHub — Direct Pages

1. **Back up** the current live `Grandis-Legacy-Website` repository and export any important saved decks.
2. Extract this ZIP. GitHub repository root must contain `index.html`, `CNAME`, `.nojekyll`, `deck-builder/` (no extra wrapping directory).
3. Use GitHub Desktop to copy **contents** of extracted ZIP into the cloned repository, replacing old deployed files. Be careful: old files not present in this release may need removal; do not delete unrelated repository resources without checking.
4. Review changes → Commit → Push. With Pages set to `Deploy from a branch` → `main` → `/(root)`, this can go live automatically.
5. Confirm `Settings → Pages` custom domain `grandislegacytcg.web.id`; don't change DNS if already working.
6. Check `/` (VS AI RC31), `/deck-builder/` (DB v1.61 Style 1), `/deck-builder/style-2/` (Style 2); navigation, favicon, PvP hidden, exported/imported deck, live gameplay and card artwork.

**Important:** This ZIP is a static web repository, not a ZIP to upload directly to GitHub Pages. Extract and upload its contents to the root. It does not modify the old `grandislegacytcg.github.io` repository. GitHub deployment is not performed by generating this ZIP.

**Root-clean convention:** Do not copy the `docs/` files or `assets/css/` stylesheets into the repository root. The `docs/` and `assets/css/` folders are already part of this ZIP. Keep all folders as-is.
