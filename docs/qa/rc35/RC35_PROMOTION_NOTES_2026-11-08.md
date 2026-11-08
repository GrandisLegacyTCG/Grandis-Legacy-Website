# RC35 — Release promotion (2026-11-08)

**Release file:** `Grandis_Legacy_VS_AI_Season0_v1.0_RC35_2026-11-08.zip`  
**In-game version:** `Grandis Legacy VS AI Season 0 v1.0 RC35`  
**Source baseline:** RC34.4 integrated release (2026-11-08).

RC35 is a release-number promotion requested by the designer after the large Beginner/Intermediate and Starter 4/5 feature update in RC34.4. The game logic is **identical to RC34.4**: Starter 4/5 designer imports, split Beginner/Intermediate AI strategy, default Beginner + AI Starter 1, random 4–5 on entering Intermediate, random 1–3 when returning to Beginner, original desktop design and existing landscape-mobile behavior. Expert is hidden.

**Files changed for the promotion:**
1. `engine/shared-app/app.bundle.js` — version display `RC34.4` to `RC35`; no strategy code changed.
2. `shared-ui/mobile-landscape-lobby.js` — diagnostic `glInternalRevision` label to `RC35`; viewport logic unchanged.
3. `README.md` — current release description prepended; RC34 revision history retained.
4. This release note added under `docs/qa/rc35`.

**Testing:** Regression and archive checks were rerun against this release. See release-side `RC35_Promotion_QA.json` for results. Earlier targeted Chromium QA for the RC34.4 feature update remains historical QA evidence and has not been represented as a fresh full-game test.

**Release limitations:** Full natural end-to-end match, native Android and Firefox device validation are not claimed; RC35 is a playable Release Candidate, not a final certification.
