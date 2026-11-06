# Upload to GitHub — Direct Pages Layout

**This ZIP is not meant to be uploaded as a single `.zip` file to GitHub. Extract it first.** It is already the website, with `index.html` in the root; no Python build or GitHub Actions are needed.

1. In GitHub, identify the repository that currently publishes `grandislegacytcg.web.id`. **Do not change the old `grandislegacytcg.github.io` repository.**
2. Back up/clone the domain's existing repository. For 750+ website files, **GitHub Desktop or git** is easier than the GitHub browser uploader.
3. Extract this ZIP. Copy the **contents** of the extracted folder (including `.nojekyll` and `CNAME`) directly into the cloned repository root, alongside the existing `.git` directory (never delete `.git`). Do not leave a wrapper folder like `Grandis_Legacy_Direct_Pages_Ready_.../` around the website files.
4. With a backup already made, remove stale website files from the previous deployment where appropriate so old file routes aren't left behind. Do not delete non-website files blindly; review changes in GitHub Desktop before committing.
5. In the repository's **Settings → Pages**, select **Deploy from a branch**; choose the publishing branch (normally `main`) and **`/ (root)`**. Verify the **Custom domain** is `grandislegacytcg.web.id`.
6. Commit and push the changes to that publishing branch. This may replace the live homepage, so do so only when ready.
7. After GitHub Pages completes publishing, check:
   - `https://grandislegacytcg.web.id/` (VS AI RC30)
   - `https://grandislegacytcg.web.id/deck-builder/` (Deck Builder Style 1)
   - `https://grandislegacytcg.web.id/deck-builder/style-2/` (Deck Builder Style 2)
   - Navigation buttons, logo, hidden PvP links, favicon, saved decks, export/import, and actual gameplay.

**Important:** Do NOT select GitHub Pages “GitHub Actions” source for this ZIP. It contains a **direct-to-root static website** and no deployment workflow.
