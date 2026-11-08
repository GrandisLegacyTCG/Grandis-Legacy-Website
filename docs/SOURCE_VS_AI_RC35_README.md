# Grandis Legacy — VS AI Season 0 (v1.0 RC35; internal RC35.3)

## Internal RC35.3 - Default AI Starter 2 (2026-11-08)

Beginner remains the default difficulty. On initial VS AI Lobby load, PLAYER defaults to Starter 1 and AI now defaults to Starter 2 (Blue-Red Deck). Clicking Intermediate still rerolls AI between Starter 4/5; returning to Beginner still rerolls AI between Starter 1/2/3. No AI logic, gameplay, starter deck composition, or UI layout changes. Official ZIP filename remains RC35.

## Internal RC35.2 - Intermediate Starter 5 Note handling (2026-11-08)

**Distribution filename remains RC35.** Fixes Intermediate-only Bard/Maestro optional Hand exchange, Hand Limit preference, and Tribute scoring around Note cards. When a Priest/Saint is active, retain the first two Vae (a third may be exchanged); play Vae for legal Healing instead of discarding it merely for a combo. Healing utilization in Intermediate is evaluated from the printed amount without class/Attachment bonuses; Vae used through Priest/Saint is eligible from 20 missing HP. Zol is prioritized as an Archer/Marksman/Grand Ranger Attack (duplicate, insufficient Mana plus an actual combo, or defeated Archer permit exchange); Lun is retained as BLOCK unless a relevant combo is in Hand or an extra copy exists. Existing Beginner AI, all five Starter decks, gameplay rules, UI, and card assets remain unchanged. See `docs/qa/rc35/RC35_2_NOTE_STRATEGY_QA_2026-11-08.md`.

## Internal RC35.1 - Intermediate Rank-Up Commitment + Soul Charged Shot (2026-11-08)

**Distribution filename stays RC35.** The existing Beginner AI, Starter decks, difficulty selection, art, and gameplay rules are unchanged. Intermediate AI now follows the agreed EXP investment/Rank Up rules: Rank I has a hard focus after investment, Rank II locks after two normal Tributes (500 EXP), and 200/600 EXP automatically prioritizes the final normal Tribute so Rank Up earns Draw 2/3. The AI will not spend its last Tribute-compatible ordinary Skill on nonterminal attacks, and will preserve Silver at Rank I and Gold at Rank I or once Rank II reaches 500 EXP. Gold remains playable at Rank II (300-400 EXP). A demonstrable immediate match-win is an allowed exception.

**Soul Charged Shot (S0-ARC-018):** when legal, Intermediate prefers targeting outside normal AoA using Marksman/Grand Ranger's RANGE conversion, where the card's printed effect doubles damage. A guaranteed in-AoA lethal can still beat a nonlethal RANGE option. Beginner's historic scoring remains unchanged. No card rule or damage formula is modified.

**QA:** 33/33 Intermediate/difficulty tests repeated three times; 20/20 historical gameplay regression; JS syntax PASS. See `docs/qa/rc35/RC35_1_INTERMEDIATE_EXP_RANGE_QA_2026-11-08.md` and `RC35_1_INTERMEDIATE_EXP_RANGE_RESULTS.json`. Does not constitute a complete natural-match or live Android hardware test.

**Promoted on 2026-11-08 from the fully integrated RC34.4 build.** Official distribution: `Grandis_Legacy_VS_AI_Season0_v1.0_RC35_2026-11-08.zip`. This promotion updates release labels and preserves the entire RC34.4 feature set; no new gameplay rules or AI decisions were introduced during the version promotion.

- **Difficulty:** Beginner selected by default with AI Starter 2; selecting Intermediate unlocks Player/AI Starters 1–5 and randomly selects AI Starter 4–5; returning to Beginner limits both sides to 1–3 and randomly selects AI Starter 1–3. Expert stays hidden. Beginner retains pre-RC34.3 targeting behavior, and Intermediate uses the approved conditional strategy changes.
- **Decks:** Designer-updated Starter 4 (Green-Yellow) and 5 (White-Green) from the November 8 imports; Starter 1–3 unchanged.
- **Lobby:** Existing desktop presentation, text-only Beginner/Intermediate selector in Noto Sans, unchanged Start Match; landscape-fitted mobile lobby and visually rotated portrait on rotation-locked devices.
- **Gameplay:** All RC34 fixes carried forward; no card text, OSA authority, or artwork changes for RC35.
- **Verification:** Version-promotion syntax, regression and ZIP integrity checks documented in `docs/qa/rc35/RC35_PROMOTION_NOTES_2026-11-08.md`. Targeted QA is not a complete natural-match/browser-device certification.

---

## RC34.4 - Beginner / Intermediate + Designer Starter 4-5 (internal revision, 2026-11-08)

Same-name full RC34 ZIP; internal game version **RC34.4**. This is playable release-candidate software (not a claim of bug-free full-match certification).

**VS AI Lobby**: text-only `Beginner` and `Intermediate` buttons added to the LEFT of the existing Start Match button; Noto Sans, no outer group border, no divider, Expert intentionally not shown. Original deck panels, cards, fonts and desktop arrangement preserved. Existing mobile landscape canvas/portrait 90-degree rotation-lock-safe behavior preserved.

**Default**: Beginner with AI Starter 2. Beginner unlocks Starter 1-3 for both Player and AI and keeps AI scoring/behavior prior to RC34.3 target-priority changes, while retaining RC34 rule fixes. Clicking Intermediate unlocks all five starters for both sides and **randomly selects AI Starter 4 or 5**; clicking Beginner randomly selects AI Starter 1, 2 or 3, and resets a Player Starter 4/5 selection to a permitted starter. Repeated clicks reroll the AI Starter in that mode. Custom deck imports are gated to Intermediate.

**Uploaded deck authority**: Starter 4 `Green-Yellow Deck` and Starter 5 `White-Green Deck` replaced from the two user-provided 2026-11-08 JSON exports. Both pass current RC34 v3.0 structural validation (Main 50 / Legacy 12 / Mana 12). Starter 1-3 remain unchanged; hero progressions and new default formations for 4-5 follow the uploads. The originals carried legacy v2.9 metadata; validation uses current RC34 rules and card data, not the old export validation badge.

**Intermediate AI (conditional decisions, not gameplay rules)**: CENTER-first focus-fire with lethal exceptions; Archer reach after CENTER defeat; class/racial and Arcane Warrior/Conqueror passive counter preferences; racial defense conservation (50+ damage or lethal); 80% Potion/Greater Health Potion usage; Priest-first healing; Phoenix Feather safety checks; selective Flashpowder, Intercept and Tactical Adaptation countering; 5-card Hand/Tribute draw gate for Reload/Tune Up/Singularity Reload/Market Bargain/Human Ambition; midgame Elf Mana finishing; Mana disruption early; duplicate/low-value Tribute, one-Hero-at-a-time Rank II plan, then Rank III priorities for the two Green-lineage carries; prevent Ultimate EXP overflow; protect five special Ultimates; use Magic Compass/Deja Vu with a legal potential finishing line; draw counter and Note/Discard bonuses for uploaded Starter 4/5; Replenish recycles an available Replenish and finisher when possible; AI can automatically resolve Replenish and Arrow Barrage in their legal pathways. AI never sees hidden defense cards. Existing OSA card legality/damage rules were not rewritten.

**QA**: existing gameplay regression **20/20 PASS**; mode/AI targeted tests **16/16 PASS** (including Arrow Barrage and Replenish actual engine commits); desktop, touch landscape and rotation-locked portrait **3/3 UI state/click/Start-Match-to-Coin-Flip PASS** using Chromium with a complete inline script/CSS harness to avoid container navigation restrictions. Syntax checked. No completed long natural match, hardware Android test, hosted-network deployment or Firefox QA is claimed. See `docs/qa/rc34/RC34_DIFFICULTY_STARTER_UPDATE_QA_2026-11-08.md`.

## RC34.3 - AI Target Priority Update (internal revision, 2026-11-08)

Improved AI Battle target scoring, using only legal attack options and visible battlefield information:

- Prefer a reachable opponent Hero without a currently usable Racial defense, Class passive damage reduction, or known ongoing immunity.
- Among otherwise comparable targets, focus Heroes with attached EXP cards AND missing HP (not merely inherent Rank II/III EXP).
- Prefer the opponent CENTER lane when impact and defensive exposure are otherwise comparable, because it is reachable by LEFT, CENTER, and RIGHT under normal Area of Attack; no automatic CENTER-only targeting.
- Where LEFT/RIGHT still tie, alternate the preference by round instead of choosing LEFT every time.
- Retain the high weight for credible lethal hits, effective damage, attack cost, and Ultimate conservation. Recognize Stoneblood, Dragon Scale, Second Chance, Crystalhide, Vanquisher's Resolve, active immunity, and whether a Racial Token remains available.
- Do not inspect or guess the PLAYER's hidden Hand for Defense cards. Attack, target, MELEE/RANGE, Taunt, and Skill legality are unchanged. Gameplay damage, OSA authority, cards, artwork, responsive UI, and desktop layout are unchanged.

QA: AI targeting tests **17/17 PASS** (`docs/qa/rc34/RC34_AI_TARGET_PRIORITY_QA_RESULTS.json`), existing RC34 engine regression **20/20 PASS**. No completed hosted/live browser match or Android hardware validation was performed for this AI change. File name remains `Grandis_Legacy_VS_AI_Season0_v1.0_RC34_2026-11-08.zip` by project convention; internal game version is **RC34.3**.

## RC34.2 - Mobile Lobby visual update (internal revision)

RC34.2 keeps all gameplay and desktop visuals unchanged. On touch phones, the existing desktop Lobby layout and official art are fitted into one landscape canvas. If the phone is held portrait with autorotation locked, the Lobby canvas itself is rotated 90 degrees by CSS (without changing device orientation). It can be played by physically turning the phone. The opening coin-flip follows the same stage, while the existing battlefield orientation handling remains unchanged. The outer ZIP filename remains RC34, as requested.

QA: controlled Chromium layout fixture 9/9 PASS; Lobby-to-coin transition 2/2 PASS; portrait-landscape-portrait live resize 3/3 PASS; prior engine regression 20/20 PASS. This is not a hosted Android device verification, a full natural match, or Firefox QA. See `docs/qa/rc34/RC34_MOBILE_LOBBY_QA_2026-11-08.md`.

# Grandis Legacy VS AI Season 0 — v1.0 RC34 (2026-11-08)

**RC34 — Release Candidate siap dicoba (playable), menggantikan build RC34 sebelumnya.** Paket ini berisi aplikasi lengkap seperti RC33, dengan pembenahan gameplay F01/F02/F03/F06–F12, hover Hand Limit F13, dan urutan Card Played terbaru di atas/kiri (maksimum 6 kartu). Full Card History juga terbaru dulu, **Battle Log tetap terbaru di bawah**, dan Active Card menggunakan aksi resolved terbaru pada fase aktif.

Ruling desainer tetap berlaku: **F04 dan F05 bukan bug** (Item tetap boleh digunakan saat Stun; bonus 10 damage Burn tidak diterapkan untuk Burn yang baru di-inflict oleh serangan yang sama). Damage positif adalah kelipatan 10 (minimum 10); Dragon Scale tetap self-only. Sumber kartu, artwork, dan audio tidak diubah.

**QA:** Regresi engine terarah 20/20 PASS; hover Hand Limit Chromium 3/3 PASS; Card Played Chromium 8→9 event dan tiga ukuran layar PASS. Ini **bukan klaim full natural match atau Firefox selesai diverifikasi**. Rincian ada di `docs/qa/rc34/RC34_PATCH_NOTES_2026-11-08.md` dan `docs/qa/rc34/RC34_CARD_PLAYED_QA.md`.

**Menjalankan game:** ekstrak ZIP, buka `index.html` seperti RC33 (untuk hasil paling konsisten, layani folder melalui static HTTP server). Tidak perlu menginstal patch terpisah.

# Grandis Legacy VS AI Season 0 — v1.0 RC33 (2026-11-08)

Part 5 adds optional Tavern Quest looping music with Music/SFX panel; replaced Heads/Tails coin/token graphics and race/class/legacy Hero action artwork while retaining RC32 click/tooltip/visibility; resolves confirmed Primal Strike AI Response handoff and adds targeted Saint Purify continuation and WAAPI presentation completion guards. **RELEASE CANDIDATE — NOT FINAL**. See `docs/qa/rc33/RC33_RELEASE_NOTES.md` for test evidence and remaining limitations.

# Grandis Legacy VS AI Season 0 — RC32 (Rulebook v3.0 Card Review descriptions, 2026-11-07)

Same-version **v1.0 RC32** presentation-only update: Card Review Keyword/Status descriptions checked against the official Player Rulebook **v3.0**, pp. 13–14. Corrected **REFLECT** (hit trigger), **MANA STEAL** (up to X and take as many as possible), and **Burn** (played Card or activated Ability). Status descriptions now also appear on Hero Review popups that reference Statuses. All other 14 Keyword/5 Status descriptions already matched and remain unchanged. Scoped Chromium renderer QA **104/104 PASS** plus **242/242 card render checks PASS**; full natural match/Firefox **NOT VERIFIED**. App gameplay, OSA, card values, existing artwork, sounds and embedded historical v2.9 PDF are unchanged. See `docs/qa/rc32/RC32_RULEBOOK_V3_REVIEW_DESCRIPTIONS_2026-11-07.md`. **RELEASE CANDIDATE — NOT FINAL.**

# Grandis Legacy VS AI Season 0 — v1.0 RC32 (Stun + Color Mana minor update, 2026-11-07)

Same-version RC32 maintenance: Stun now prevents all **activated** Hero Class/Racial actions, including the Draw Review Class Abilities, Primal Strike/Human Ambition, defensive Dragon Scale/Second Chance and Stoneblood. Selecting a matching **2-Mana Color Shard** for an exact payment now deselects other selected **Color Shards first** when possible. No rulebook changes needed: v2.9 already prohibits activated actions under Stun. Browser-executed focused QA **23/23 PASS**; full natural match and Firefox **NOT VERIFIED**. See `docs/qa/rc32/RC32_STUN_COLOR_MANA_MINOR_2026-11-07.md`. **RC32 — RELEASE CANDIDATE, NOT FINAL.**

# Grandis Legacy VS AI Season 0 — v1.0 RC32 (Burn + Primal Strike clarification, 2026-11-07)

Same-version designer ruling: Primal Strike deals **20 Physical damage**, plus **10 Burn damage** if the burned target would take positive damage after Defense. Dodge/complete Block prevents both, partial Block still allows the +10; Primal Strike remains a Racial Trait and does not count as a Skill Card. The complete updated Player Rulebook v2.9 is included in `docs/rulebook/`. See `docs/qa/rc32/RC32_PRIMAL_STRIKE_BURN_2026-11-07.md`. **RC32 — RELEASE CANDIDATE, NOT FINAL.** Full natural match and native Firefox NOT VERIFIED.

# Grandis Legacy VS AI Season 0 — RC32 (final same-number maintenance, 2026-11-07)

This updated **v1.0 RC32** includes the complete RC31→RC32 checklist, Exhausted EXP parity, Full Card History/Battle Log scrolling, selected card spacing, new P.Atk/P.Def audio assets, Stoneblood matching incoming Attack Defense VFX/SFX, Response PASS attention after 30 seconds and accurate Runeforged Burst final zero-HP-damage reasons. All previously packaged RC32 features remain. **RELEASE CANDIDATE — NOT FINAL**: natural complete match, native Firefox and audible device playback NOT VERIFIED. See `docs/qa/rc32/RC31_TO_RC32_COMPLETE_INVENTORY_2026-11-07.md`.

# Grandis Legacy VS AI Season 0 — RC32 (Escape Arrow regression QA corrected)

Same-version maintenance update: the previous Escape Arrow 26/27 result was caused by a **malformed QA fixture**, not a confirmed live-gameplay defect. The embedded test now uses legitimate physical Mana cards and Hero identities; the full focused Unified Discard suite reports **27/27 PASS**. No gameplay rules, AI policies or OSA authority were changed for this correction. Full natural match, hosted browser, native Firefox and audible output remain **NOT VERIFIED**. See `docs/qa/rc32/RC32_ESCAPE_ARROW_REGRESSION_CORRECTION_2026-11-07.md`. **RC32 — NOT FINAL.**

# Grandis Legacy — VS AI Season 0 (v1.0 RC32, same-version update)

RC32 now includes the approved EXP Stack geometry, Unified Discard selection, corrected black/white deck counters with blue +N Mana Regen, updated Poison Vial/Grand Finale Card Review information, seven updated Thief Hero fronts, and Primal Strike Physical Attack VFX/SFX routing. All OSA authority exports remain unmodified. Controlled QA includes a pre-existing Escape Arrow test failure (unresolved); a full natural match, hosted browser validation, native Firefox and audible hardware sound are NOT VERIFIED. **RELEASE CANDIDATE — NOT FINAL.** See `docs/qa/rc32/RC32_SAME_VERSION_UPDATE_2026-11-07.md`.

# Grandis Legacy — VS AI Season 0 (v1.0 RC32, minor update)

Five approved visual/presentation changes have been incorporated into RC32: lobby separator removed; all six R2 Mana Deck fronts updated from `GL_S0_ManaDeck_R2.rar`; Ready EXP bottom aligned; actual Battlefield Mana Regen badge updated; and `RACIAL TRAIT!` duration adjusted to 2.0s matching `COUNTERED!`. No gameplay/AI rules or OSA exports changed. See `docs/qa/rc32/RC32_MINOR5_UPDATE_NOTES.md` and `RC32_MINOR5_QA.json`. **RELEASE CANDIDATE — NOT FINAL**; natural full match and native Firefox remain NOT VERIFIED.

# Grandis Legacy — VS AI Season 0 (v1.0 RC32)

RC32 (2026-11-07): Incorporates the previously approved changes on the RC31 baseline: final 100/200 EXP edge-stack artwork; compact Mana Regen and deck counter visuals with desktop-only +2px adjustments; simple phase underline without diamond/glow; COUNTERED! 2.0s and RACIAL TRAIT! 3.0s notification; AI status-aware Rage Blast / Venom Sovereign and ≥60% effective Heal-value targeting; Ready-only use for Greater Health Potion; updated designer-approved Poison Vial artwork and Skill Physical HP damage trigger with End Phase lifetime; Deflect response legal to PIERCING with independent REFLECT but no BLOCK; and bounded visual hardening for simultaneous Player/AI Taunt and Casting glow. OSA source exports are unchanged; Poison Vial is a documented local designer override pending upstream OSA sync. Targeted QA performed, but full natural Human-vs-AI match and native Firefox are NOT VERIFIED. **RELEASE CANDIDATE — NOT FINAL**. See `docs/qa/rc32/RC32_RELEASE_NOTES.md`.

# Grandis Legacy — VS AI Season 0 (v1.0 RC31)

RC31 (2026-11-07): Released approved UI-001: Surrender button changes to **Match Result** after Game Over, allowing the existing result popup to be reopened repeatedly after CLOSE; no automatic return to Lobby, while **BACK TO LOBBY** remains available. Restored the missing website favicon by referencing the **existing original shared favicon** in `engine/assets/favicon.png` (byte-identical to the website and Deck Builder icon), with no artwork duplication. Retains all RC30 features. Greater Health Potion/Item-Exhaust rules change is **NOT INCLUDED** and remains pending a separately authorized implementation. This is **RELEASE CANDIDATE — NOT FINAL**; see `docs/qa/rc31/RC31_RELEASE_NOTES.md`.

# Grandis Legacy — VS AI Season 0 (v1.0 RC30)

RC30 (2026-11-06): Approved post-RC29 Mana Surge/Arcane Surge payment consistency: selection and spending visibly reflect **MANA 5 / 5 (+1 Mana Surge/Arcane Surge)** rather than 4/4 plus a hidden surcharge. Surge hover now reuses the existing dark navy/gold Class/Racial tooltip instead of the OS-native light popup, with disabled reasons and keyboard support. All RC29 features retained; OSA unchanged. Controlled Chromium QA 22/22 payment, 16/16 previous regression, 19/19 styled tooltip. Native Firefox and full natural match **NOT VERIFIED**. **RELEASE CANDIDATE — NOT FINAL**. See `docs/qa/rc30/RC30_RELEASE_NOTES.md`.

# Grandis Legacy — VS AI Season 0 (v1.0 RC29)

RC29 (2026-11-06): Consolidated the approved Stoneblood central-Hero decision, Spell Blade/Arcane Duelist Mana Surge payment toggle with disabled-state explanations, and contextual Hero-side Class/Racial/Legacy/Response ability hover tooltips. All RC28 gameplay/UI corrections retained. Controlled Chromium QA: Stoneblood/Surge 16/16 PASS, Hero tooltips 23/23 PASS; native Firefox and full natural match **NOT VERIFIED**. Official OSA unchanged. See `docs/qa/rc29/RC29_RELEASE_NOTES.md`. **RELEASE CANDIDATE, NOT FINAL.**

RC28 (2026-11-06): Corrected general Class/Rank effect-row fallback for all hybrid Lineages (11 previously mis-selected rows; full 6,975 Skill×Hero parity audit now reports zero wrong rows) and prevented the idle center-choice renderer from closing generic Replenish/Legacy hover previews every 120 ms. Targeted Chromium QA plus source parity tests passed. No OSA, AI or card modifications; see `docs/qa/rc28/RC28_RELEASE_NOTES.md`. Full normal match and native Firefox verification remain **NOT VERIFIED**. **RELEASE CANDIDATE, NOT FINAL.**

Run `index.html` through a local static web server. Built on VS AI v6.91.9, using OSA Season 0 DEV45 for card authority. OSA source is unchanged.

RC27 (2026-11-06): Single-bug UI patch to the RC26 baseline. Class Ability/Bard card choice hover no longer flickers under the 120ms generic modal renderer; left/right preview layout is unchanged. See `docs/qa/rc27/RC27_RELEASE_NOTES.md`. Controlled Chromium QA 21/21 PASS; native Firefox retest and full match remain **NOT VERIFIED**. **Release Candidate, NOT FINAL.**

RC26 (2026-11-06): Consolidated RC25 staging repairs — all 5 hybrid Dual Class Lineages, universal click-another-card selection, Response PLAY layer, persistent left/right Class Ability hover preview, correct allied-source Holy Barrier/Sacred Bulwark BLOCK and explicit Response source→recipient routing (area/teamwide Defense requires only source), and Taunt self-Attachment Hero glow. Chromium focused QA and source-regression PASS; full normal match and Firefox remain **NOT VERIFIED**. See `docs/qa/rc26/RC26_RELEASE_NOTES.md`. **RELEASE CANDIDATE, NOT FINAL.**

RC25 (2026-11-06): Consolidated seven approved gameplay fixes, designer-corrected MANA STEAL (remove opponent up to X first, then draw own up to the removed count subject to own capacity), temporary Grand Finale 60/90 damage and submitted artwork override (OSA unchanged), and four UI changes: Legacy-style Class Ability card hover preview; responsive Mana Pool geometry; explicit Card Played reaction attribution and resolution badges; committed COUNTERED! notification. Original RC24 archive remains unchanged. See `docs/qa/rc25/RC25_QA.md`. Designer waived full normal GUI terminal match, exhaustive natural defense interactions and Firefox verification; all are **NOT VERIFIED**, not PASS. **Release Candidate, NOT FINAL.**

RC24 (2026-11-05): Keyword/status audit is partitioned into SIX batches, no more than 40 card identities each. Batches 01 (MELEE/RANGE/ALL OPPONENTS, 22 identities) and 02 (PIERCING/SURE HIT/BLOCK/DODGE, 38 identities) completed targeted browser-engine QA. Fixed the source-Hero Rank II Gladiator `Execute` SURE HIT helper incorrectly inheriting Conqueror-only restriction; the actual Rank II PLAY path already offered DODGE. Other four batches are **PENDING**. See `docs/qa/keyword_audit_2026-11-05/RC24_AUDIT_REPORT.md`. This is NOT an all-keyword full gameplay acceptance, nor FINAL. No official data or other apps modified.

RC23 (2026-11-05): Designer-approved repairs to reported Season 0 Ultimate/counter/mana mechanics and follow-up AI tactics. S0 printed `MANA COST +` now applies to the eligible Hero row (notably Paladin Blessing of Divinity 6 Mana; Crusader 4); Arbalest/Grand Arbalest `Draw This Turn` Hero Information is restored with no artificial draw-count cap (Colossal Dreadbolt still caps **base** damage at printed 140); Grand Ranger Divine Edge returns/shuffles 2 random opponent Hand cards on real HP damage; Flame Dragon's Wrath processes ALL OPPONENTS with separate Responses; Venom Detonation targets poisoned opponents with their respective Poison multipliers and removes Poison after their Response choice. AI sequences Poison Vial into a same-Hero Physical Attack when feasible, uses Freeze Bomb only with a reachable same-turn Attack follow-up, and evaluates Warp Scroll swaps for safer positions/attack coverage instead of wasting it. Existing Double Casting Elementalist/Elemental Lord behavior (3/1 Mana, same-turn 2 attacks) is preserved. See `docs/qa/rc23/RC23_QA.md`. No changes to OSA, official card data, other applications, or UI adjustments from RC22. Full normal browser Human-vs-AI match to Win/Loss/Draw and Firefox field QA remain open: **RELEASE CANDIDATE, NOT FINAL**.

RC22 (2026-11-05): Three UI-only fixes based on designer feedback: one-line same-height right-side Hero action buttons (shrink label font, do not enlarge one-line buttons); more space between the single Quick Reload / Rapid Chamber card and its buttons; working mouse-wheel scroll in tall Lobby Hero Review (Rank I–III). See `docs/qa/rc22/RC22_UI_QA.md`. All game engine/card authority unchanged. Full Firefox normal-match QA remains open.

RC21 (2026-11-05): Lobby Hero Review now uses the Deck Builder v1.58 review with interactive HERO LINEAGES (Rank I–III) thumbnail footer; long upper-right Hero Skill labels shrink inside a fixed action button; target Hero HP gets a higher visual response stacking priority; Arbalest/Grand Arbalest Draw Review now shows only the drawn card at center (not clickable) with KEEP CARD and SHUFFLE & REDRAW. Engine gameplay unchanged. **New:** `docs/DEV_NOTES_01-20.md` documents 20 source-grounded development topics and approved rules, including the Poison Vial Physical Attack subtype boundary. See `docs/qa/rc21/RC21_QA.md`. Native Firefox full-match QA remains open.

RC20 (2026-11-05): Scoped UI fixes only. Removed the extra gray Card Review frame/corners and bottom strip (actual iframe canvas color-scheme was also contributing); verified real Event, Skill, Hero, Item, and Legacy review renders across four viewport sizes. Simultaneous Casting targets and source Attachments have matched, stable violet/teal/amber highlights. Event/Utility arrows now follow designer-approved target zones (Begin Anew has no arrow). See docs/qa/rc20/RC20_UI_QA.md. No engine/card data changes; native Firefox full-match validation remains open.

RC19: Targeted UI and card subtype corrections — Magic Compass 3-row vertical capacity; card review 1120px content-fit without extra gray surface; AI Mana frontmost-left stack; HP overlay visible through Rank transitions; Poison Vial restricted to Skill subtype Physical Attack; Defense Skill/Item arrows target the protected Hero. Targeted Chromium + existing engine regression; see docs/qa/rc19/RC19_QA.md. Full normal Firefox match is still unverified.

RC17: Source-backed audit of all S0 printed Swap cards: mandatory Warrior Charge/Heroic Charge/Shield Charge automatically swap after legal connected resolution; Soul Blast Shot forced reposition cannot be skipped; optional Thief swaps remain optional. Viewport-root overlay/VFX/animation fix for scaled-body seam and off-center attack effects. Verified Chromium inline geometry and 40 targeted Swap checks; native Firefox full-match visual verification remains open. Details: docs/qa/rc17/RC17_SWAP_AND_VIEWPORT_QA.md.

RC16: Seven grouped presentation fixes — single borderless Deck Builder card-review surface with consistent art sizes; +25% from RC14 top-right buttons/Status without Hero overlap; true full-screen center-choice veil for Hand/Mana/footer and scroll-safe dialogs; Bard/Maestro single-click replacement with no Hand UNDO; static gold Response/Reaction glow; v6.91.9 Hero-anchor-based P/M Attack/Defense VFX with clipped centered Defense; twin diagonal Poison/Burn icons rising like Healing. Targeted Chromium layout and S0 engine regression QA: docs/qa/rc16/RC16_UI_QA.md. The complete normal-match/Firebase Firefox rendering remains unverified.

RC15: UI and import update. Deck Builder v1.58 Season 0 JSON import, Bard/Maestro center-screen exchange, STATUS/Attachment visual behavior, top-right Hero/Legacy buttons, responsive Shard Pool, Ultimate Tactical response guard, arrows and centered Battle effects. See docs/qa/rc15/RC15_UI_QA.md for tests and limitations. Six-stage RC14 gameplay repairs retained. A full normal Human-vs-AI UI match through Game Over remains unverified.

RC13: Deck Builder v1.58 Card/Hero Review composition now uses the exact Deck Builder review renderer as a single visible modal, without the earlier outer VS AI Card Review container. OSA data/engine unchanged.

RC12: Bard/Maestro inline `CONFIRM` / `CANCEL` Class Ability selection with 65% focus dimming and Hand Discard buttons; committed Discard → Main Deck ghost animations now play in the visible Battlefield UI, not the suppressed legacy renderer.

Full details and limitations: `docs/TAKEOVER_NOTE.md` and `docs/qa/rc12/RC12_QA.md`.

**Release Candidate, not FINAL:** a complete normal Human-vs-AI browser match remains unverified.


## RC33 Part 5 — Supplement (2026-11-08)

- Hero-side Racial, Class, and Legacy artwork buttons increased from 30×30 to 36×36 px, preserving the top-right placement and original tooltip/interactions. Passive Stoneblood has no added button.
- Opponent Mana hover now uses the topmost battlefield floating card preview below the opponent Mana Pool; Player Mana hover remains above the Player Mana Pool.
- The transient Mana preview clears when its hovered shard disappears on a Mana Pool rerender (including AI Mana spending), even if no mouseleave event occurs.
- All primary floating card preview overlays are above shadow/focus overlays while remaining pointer-transparent.
- Stoneblood on lethal Poison **already spends 1 Racial Token in the inspected engine path**. The controlled Rank II test passed (AI 2→1 tokens, HP 5→30, displayed Heads/Heads→Heads/Tails). The reported real-match discrepancy remains **NOT REPRODUCED / NOT VERIFIED**, with no speculative gameplay patch applied.
- This is still RC33 (not RC34). Full natural match and cross-browser verification remain outstanding.


## RC33 — Card Played / Battle Log / Ability Button Revision (2026-11-08)

- Card Played and Full Card History: chronological play order; newest six shown oldest-to-newest. Explicit per-event commit order avoids same-millisecond timestamp ambiguity.
- Clicking a response or NEGATED card opens that card’s own details, not its parent action.
- Battle Log: display earliest at top, newest at bottom; keep scroll position when reviewing history and follow the newest line when already at bottom. Opening the panel jumps to latest.
- Racial, Class, and Legacy action icons restored to their original 30×30px artwork size without altering tooltip behavior or active/passive gating.
- No gameplay mechanics, card text, or OSA data changed. Version remains RC33; full live-match and native Firefox acceptance remain NOT VERIFIED.
