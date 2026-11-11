# Grandis Legacy — RC38 + Deck Builder v1.64, slim branch deployment

Built from the last-successful FULL_REPO_TRIMMED base with the RC38 game engine and Deck Builder v1.64 from the recovery release. Gameplay behavior and 242 card images are preserved; duplicate copies are removed without replacing artwork with generic placeholders.

## Deployment — SAME GitHub Pages settings as before

The repository uses GitHub Pages **Deploy from a branch**, branch **main**, folder **/(root)**. It **does not require** a new GitHub Actions workflow or a build system. The package includes `index.html`, `.nojekyll`, and `CNAME` at root. The custom domain in `CNAME` is `grandislegacytcg.web.id`.

Upload the *extracted contents* of this ZIP to the existing repo root, replacing the old files entirely. Delete the old `deck-builder/assets/season0/cards/` copies if your upload method does not remove files automatically, and delete the old `.github/workflows/deploy-pages.yml` if present. These deletions are necessary for a true clean-replace but are not required to display artwork; the new code reads `card-art/` at root.

Set **Settings > Pages > Build and deployment** to **Deploy from a branch**, `main`, `/(root)` (leave unchanged if already configured). Make sure **Custom domain** is `grandislegacytcg.web.id`. Do not choose GitHub Actions for this release.

This is a static site: VS AI `/`, Deck Builder Style 1 `/deck-builder/`, Deck Builder Style 2 `/deck-builder/style-2/`, and player rulebook `/rulebook/Grandis_Legacy_Player_Rulebook_v3.2_EN_2026-11-10.pdf`.

**If GitHub Pages still gives a 404:** GitHub's previous two Pages runs #23 and #24 failed with `startup_failure` and zero jobs, even though source files were present. That is an upstream Pages/Actions deployment-start condition, NOT a missing card-art route. Check the latest Pages workflow status and GitHub Pages source/domain. No ZIP alone can guarantee that a startup-failure (before any job) is fixed. Compare the build logs rather than repeatedly changing the game runtime.

## Included and excluded

Included: VS AI RC38 runtime, both Deck Builder v1.64 styles, all necessary audio/UI/242 card art images and other in-use art, player rulebook. Card art is loaded from root `card-art/`, using relative paths for both Deck Builder styles. `GL_S0_CATALOG` review images also use the shared path.

Excluded: 242 duplicate webp artwork copies from `deck-builder/assets/season0/cards/`, QA/dev logs, tests, source snapshots, developer history, redundant CSS/JS from previous versions, and the optional GitHub Actions deployment workflow. Standalone packages are not changed.

All repository uploads, commits and GitHub settings remain **manual** by the project owner.

## Artwork loading

Card artwork is stored once under `card-art/` and loaded by VS AI and both Deck Builder styles. Each style resolves relative paths to the same shared directory. A small browser-only fallback script shows the appropriate Back of Card if an individual card file fails to load. No image is copied into the Deck Builder.
