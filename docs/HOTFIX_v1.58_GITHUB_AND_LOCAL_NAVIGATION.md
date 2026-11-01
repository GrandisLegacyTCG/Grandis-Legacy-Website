# v1.58 Corrective Patch — GitHub Pages domain + local style navigation

This is a **same-version fix** for Grandis Legacy Deck Builder v1.58, NOT v1.59.

## Fixed

- Added root `CNAME` containing only `grandislegacytcg.web.id`. This file must not be deleted during GitHub repository updates when deploying from `main` / `(root)`. GitHub typically creates it when the domain is saved in Pages settings, but replacing the repository contents can remove it and break the custom domain.
- Kept root `.nojekyll` and `index.html`; deploy only the **contents inside** the ZIP's top folder to the GitHub repository root.
- On `file://`, Style 1 -> Style 2 now navigates to `style-2/index.html`, and Style 2 -> Style 1 navigates to `../index.html`, not to folders that browsers might display as directory listings.
- On `https://grandislegacytcg.web.id`, Style 1 retains `/`, Style 2 retains `/style-2/`.
- Old `/style-1/` redirects to `/` on the website and to the real `index.html` when opened locally.
- The local cross-style deck handoff still uses a transient `#gl-s0-workspace` fragment for compatible file-based storage. The destination clears it after importing the draft. Hosted switching never puts deck contents in URL.
- No gameplay, data, artwork, formatting, badge/alignment, or visibility changes beyond the navigation/domain repair.

## Deploy / diagnosis

1. In repository `GrandisLegacyTCG/Grandis-Legacy-Website`, ensure `CNAME`, `.nojekyll`, and `index.html` are **at repository root**, and keep `style-2/index.html` in its folder.
2. Replace/commit the v1.58 source files at the same root. Do not upload only the ZIP, and do not leave the enclosing `Grandis_Legacy_Deck_Builder_v1.58_2026-11-01` folder around the site files.
3. GitHub Settings > Pages: branch `main`, folder `/(root)`, custom domain `grandislegacytcg.web.id`. Verify Actions > pages build and deployment succeeded.
4. A GitHub-branded `404 There isn't a GitHub Pages site here` can indicate deleted custom-domain mapping or failed deployment; if it persists, check GitHub Pages custom domain/CNAME and Actions logs. An absent `index.html` at publishing root can also yield 404. DNS should not need to be changed if previous DNS verification succeeded.
