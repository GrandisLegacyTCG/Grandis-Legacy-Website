# Manual Deploy

Target: `GrandisLegacyTCG/Grandis-Legacy-Website`, branch `main`, repository root.

Current production combination:
- VS AI RC36 (latest cumulative Patch 4 / internal RC36.6)
- Deck Builder v1.63

Deployment workflow: delete/replace the previous repository contents with the contents of this FULL_REPO package. Keep `CNAME` and `.nojekyll` at repository root. The integrated navigation uses `/` for VS AI and `/deck-builder/` for Deck Builder. PvP remains unavailable/hidden in this package.

Developer QA, historical source notes, test harnesses and patch-development artifacts are intentionally excluded from the deploy package and remain in the standalone sources.
