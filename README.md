# Grandis Legacy — Direct GitHub Pages (VS AI RC33 + Deck Builder v1.62)

Manual-upload package prepared on 2026-11-08 from the attached VS AI Season 0 v1.0 RC33 release and the existing integrated Deck Builder v1.62. Baseline: `GrandisLegacyTCG/Grandis-Legacy-Website`, `main`, commit `f6f1d8971e6458b96b46f2083f0481e02d2230db`.

- `/` — VS AI Season 0 v1.0 RC33, the temporary homepage.
- `/deck-builder/` — Deck Builder v1.62 Style 1.
- `/deck-builder/style-2/` — Deck Builder v1.62 Style 2.
- Logos link to `/`; navigation between VS AI and Deck Builder is retained.
- PvP remains hidden. PvP backend and Main Website are not included.
- The existing player Hand artwork preload and card-back loading safeguard are retained.
- The RC33 engine, battlefield CSS, music and Hero action artwork come from the attached RC33 source. Integration changes are limited to navigation, artwork loading and content-hash cache keys. No additional gameplay fixes are introduced.

## Upload manually

Extract the ZIP first. Copy its **contents** to the repository root, where `index.html`, `CNAME`, `.nojekyll` and the application folders belong. Do not upload the ZIP as a website file and do not add an extra enclosing folder.

The update-only ZIP contains exactly the files added or changed against the baseline commit above; **no file deletion is required**. It is suitable when updating that baseline. The full ZIP contains the complete combined site.

GitHub Pages remains **Deploy from a branch → main → /(root)** with custom domain `grandislegacytcg.web.id`. No GitHub Actions or build step is required. This preparation did not push, commit, open a pull request or deploy to GitHub.

See `docs/MANUAL_UPDATE_RC33_ID.md` for Indonesian upload instructions, `docs/INTEGRATION_QA.md` for validation and limits, and `docs/SOURCE_PROVENANCE.json` for source hashes. `docs/FILE_MANIFEST_SHA256.csv` records the final package contents. The `SOURCE_VS_AI_RC32_README.md` snapshot and RC32/earlier source records remain historical; the active VS AI release is RC33.
