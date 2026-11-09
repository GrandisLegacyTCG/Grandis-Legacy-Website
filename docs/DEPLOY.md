# Manual Deploy

Target: `GrandisLegacyTCG/Grandis-Legacy-Website`, branch `main`, repository root.

Current production combination:
- VS AI RC36
- Deck Builder v1.63

Upload the contents of the deployment package to the repository root. Keep `CNAME` and `.nojekyll` at root. The integrated navigation uses `/` for VS AI and `/deck-builder/` for Deck Builder. PvP remains unavailable/hidden in this package.

For an incremental update from RC35 + Deck Builder v1.62, overwrite the files from the UPDATE_ONLY package and remove the paths listed in the separate cleanup list. The cleanup list is an operator aid and is not part of the production repository.
