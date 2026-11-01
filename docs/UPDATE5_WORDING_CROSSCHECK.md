# Grandis Legacy Season 0 — Update5 wording cross-check
**25 October 2026 · Reference: user supplied 24 Skill WEBPs, Ice Block revision, approved Maestro hero art, Player Rulebook v2.7.5 EN, Engine Implementation Specification v1.2 EN.**

**STATUS: REVIEW, NOT FINAL PRINT APPROVAL.** The v1.33.0 Deck Builder displays original user-supplied WEBP text, not the suggestions in this report. These proposals are not automatically engine rules. Melody's Class Ability remains **DRAFT / NOT LOCKED**. Bromir's abilities are also not locked.

## New rules agreed in conversation — do not re-interpret

1. TURN = one player's turn; ROUND = both players' turns.
2. **Every Casting Time counter starts at 0, increments +1 on the CASTING OWNER's Draw Phase**, never decrements and never increments during the opponent's Draw Phase. Casting-card release timing is specified individually. A counter tied to *successful card Draw* (Aura Infusion Bolt) is a distinct readiness counter rather than universal Casting Time.
3. **Runeforged Burst**: charging starts 0; +1 on each Bromir Draw Phase, cap 3. Being *attacked* marks **mandatory release during Bromir's next Battle Phase**, but **does not stop the next Draw Phase increment**. If never attacked, release at 3 on Bromir's Battle Phase. Example: cast 0 → self Draw 1 → enemy attacks Bromir → self Draw 2 → mandatory release for **40×2 = 80 Magical**. Enemy's Attack on another hero does not trigger the early-release clause.
4. **Provoke**: at the *opponent's End Phase*, if the opponent played no Physical, Magical or Area Attack Card during that turn, remove **2 physical Shard cards** from their Shard Pool (return to bottom of owner's Shard Deck under general rule). Attack counts as *played* even if subsequently BLOCKed/DODGEd/NEGATEd, provided the Attack Card play was committed. Casting Attack inclusion not yet confirmed, do not assume.
5. **Resonance Burst**: return **exactly one Zol and exactly one Vae** from Discard to Deck; search/shuffle rule applies.
6. **Charge Attack**, **Heroic Charge** and new **Shield Charge**: same ordering and effect. After Response, attempt mandatory *effect-based* two-occupant SWAP **before Attack damage**. SWAP can involve Active ↔ Legacy. If source is already directly opposite the attacked target, or status prevents swap, no swap; Attack remains legal and can deal damage. No elective skip if swap legal. Outcome of a card fully Negated follows normal response logic.
7. **Grand Finale**: INVINCIBLE applies only to its own user, not the team; lasting duration uses an Attachment slot.
8. **Shield Blast** uses Shield Bash's pattern of persistent reduction on the Attack user until start of owner's next turn; Rank II Physical -20, Rank III Physical/Magical -20.
9. **Inflict** follows other attacks: a successful connected Attack can apply status even when BLOCK reduces damage to 0; successful DODGE or NEGATE prevents it; INVINCIBLE prevents new opponent status. All six statuses incl Sleep stack durations to 6.
10. Melody Rank III Class is **MAESTRO**, not Minstrel. Melody's and Bromir's **Class Abilities are not approved/locked**.

## Essential printed-wording corrections — suggested replacement only

| ID | Card | Issue | Proposed English copy / action |
|---|---|---|---|
| S0-ARC-031 | **Resonance Burst** | Current printed condition does not specify quantity. | **CONDITION: Return 1 “Zol” card and 1 “Vae” card from your discard pile to your deck.** Retain each Rank's 30/50 SURE HIT Area Magical Attack. |
| S0-MAG-027 | **Runeforged Burst** | Printed “stop the casting” contradicts approved continuous Draw Phase counter increment. | **Multiply this card's damage by its Casting Time (max 3). If this Hero is attacked, release this Attack during your next Battle Phase. Otherwise, release it when fully charged.** Casting Time initial 0, +1 per owner's Draw Phase must be stated once in shared rules. |
| S0-MAG-028 | **Provoke** | Current “if your opponent does not attack” lacks End Phase checkpoint and exact Attack Card types. | **Until the start of your second turn after playing this card, at the end of each opponent's turn, if they played no Physical, Magical, or Area Attack Card that turn, remove 2 Shards from their Shard Pool.** Note: wording assumes a penalty at *each* applicable End Phase; number of affected opponent turns requires final read/approval. |
| S0-CLE-031 | **Grand Finale** | “gain INVINCIBLE” can be misread as team-wide. | **This Hero gains INVINCIBLE until the start of your next turn. Draw 3 cards.** Keep original Zol+Lun+Vae CONDITION and 80/120 damage. |
| S0-WAR-030 | **Shield Charge** | Swapping before damage and legal non-swap cases are missing from raw text. | Prefer retaining identical printed wording to Charge Attack/Heroic Charge and specifying the shared Charge Swap resolution in the Rulebook/engine specification rather than changing only this card. |

## Print copy: already clear or minor optional English improvements (do NOT silently rewrite)

| Card | Verdict |
|---|---|
| **Zol** | 10 Magical (Archer I), 20 Magical (Bard II); clear. |
| **Sleeping Dart** | 20/30 Physical, inflict Sleep 1; clear with global Inflict/Status rule. |
| **Midnight Lullaby** | Return exactly 1 Zol + 1 Lun; Area Magical 20, Sleep 1 then Draw 2. **Shuffle returned cards before Draw** under Rulebook. Wording acceptable. |
| **Swift Movement** | 1 Lun return CONDITION, DODGE then Draw 1; acceptable. |
| **Crimson Crescendo** | Return 1 or more Zol, multiply printed damage (20/30) by the count returned. Clear. |
| **Lun** | BLOCK 20 (Magical at Cleric I; Physical/Magical at Bard II); clear. |
| **Vae** | HEAL 20/30 to one of own Heroes; clear. |
| **Blessing of Accuracy** | CONDITION 1 Vae, BUFF single allied Hero, grant SURE HIT on Physical/Magical Attacks this turn, Draw 2; plural “Attacks” is grammatically preferable to “Attack.” Check that BUFF's attachment/lifespan behavior follows the Rulebook. |
| **Tune Up** | Add any combination of 2 named cards Zol/Lun/Vae from Main Deck to Hand, then shuffle per global rule; clear. |
| **Blooming Harmony** | CONDITION 1 Lun + 1 Vae, HEAL all active Heroes 30/50 (skip ineligible), clear. |
| **Arcane Disruption** | Printed 40/50 Magical; clear as provided. |
| **Arcane Shockwave** | Area Magical 30/50; clear. |
| **Invincible Stance** | Rank II additional Mana Cost +1; lasting INVINCIBLE until owner's next turn, needs Attachment Slot. Clear as supplied. |
| **Absolute Defense** | REFLECT full incoming pre-prevention amount, independent of BLOCK; Rank III additionally INVINCIBLE this turn. Clear with spec v1.2. |
| **Skull Crush** | PIERCING Physical 40/50, clear. |
| **Colossal Bash** | Physical 40/60, inflict Stun 1; clear with shared Inflict rule. |
| **Weapon Throw** | RANGE Physical 50/60, clear. |
| **Runic Guard** | BLOCK 50, higher Rank also REFLECT 30, independent of BLOCK success; clear. |
| **Shield Blast** | Physical 60/80 + persistent reduction 20 as specified; clear, analogous to Shield Bash. |

## Unresolved edge conditions — ask only when needed for final wording/gameplay

- **Provoke duration:** “until the start of your second turn” can mean different checkpoints to a reader; proposed text assumes opponent End Phase checked on each of their turns until expiry. Confirm how many End Phase checks were intended. Also confirm if Casting Attack Card declaration satisfies the demand; current approved list names Physical/Magical/Area only.
- **Runeforged Burst interruption:** printed “if this Hero is attacked” implies an Attack affecting Bromir, *not necessarily a damaging hit*. Should Area Attacks including Bromir count? Existing general target/exchange interpretation suggests yes; mark for specific test.
- **Charge family:** shared-before-damage ordering after Response is agreed; interleaving with specialized redirected multi-target Response still needs dedicated engine test.
- **Owner-wide Casting Time:** Player Rulebook v2.7.5 p.13 and Engine Spec v1.2 p.11 still describe **decreasing at Battle Phase**. This contradicts approved new **0-based increasing at own Draw Phase** model. Both official documents require separately approved updates before calling source/engine aligned.

## Builder / OSA delineation

- Deck Builder v1.33.0 uses all 24 artworks **as supplied**, revised Ice Block art and Maestro Rank III art; it does not implement card effect resolution. No Starter Deck preset is included.
- Old OSA Engine v5.2.1 has runtime code for 163 older Main cards, not the newly introduced 24, and still has old time-based Casting counters. Previous **163/163** bounded coverage becomes **163/187** against the expanded Update5 Main Deck catalog until those 24 are implemented. This is *not* a 187/187 certification.
- OSA and VS AI must not silently treat draft Hero Class Abilities as locked.
