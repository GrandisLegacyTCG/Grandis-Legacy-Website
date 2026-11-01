# Grandis Legacy Deck Builder v1.54 — Card / Hero Review Refinements

**Release:** 1 November 2026  
**Baseline:** v1.53  
**Scope:** Card Review / Hero Review only, shared by Style 1 and Style 2.

## Changes

1. **Hero name eyebrow:** explicitly use `font-weight: 700` rather than 900 in both styles. No changes to the displayed Hero's name, other font sizes, or Noto Sans typography.
2. **BUFF keyword explanation:** display only the sentence "Using this Skill or Event does not change the Hero's Ready or Exhausted state." The underlying card/rules engine and BUFF restrictions are not changed.
3. **Keyword badges:** use a shared set of borderless display assets in `assets/keywords-review/` with the pale gray outline removed. Original `assets/keywords/` is retained unchanged. Badges are centered relative to inline effect text and explanation rows in both styles.
4. **Keyword placement:** use recorded positions in card effect text; for `S0-WAR-005` (Taunt), apply the artwork-verified display correction: `BUFF Until the start of your 2nd turn, ALL OPPONENTS can only target this Hero for attacks. (During this time, they cannot use Area Attacks.)` This is strictly a Card Review presentation override; the source card metadata is unchanged.
5. **Dual Class Hero Review:** display a warm gray-brown Dual Class panel directly above the existing Race/Racial Traits section for Heroes with a printed Dual Class field. Existing Race, Class, Rank, Ability, Bonus, and Lineage layouts are unchanged. No empty panel for ordinary Heroes.
6. **Short-screen Hero artwork:** on desktop/tablet layouts with viewport height at most 800px, constrain Hero artwork height proportionally while retaining its original 5:7 aspect ratio and keeping the existing two-column Review layout. Only scroll when content does not fit; no font-size changes. Both styles share the same rule.

## QA performed

- `npm run check` passed (Season 0 syntax, R3.4 artwork authority/printed data, and 242/242 artwork references in each style).
- Headless Chromium inline-source tests at 1600×950, 1400×730, 900×700 and 390×844 for Style 1 and Style 2: Card Review keyword token order, BUFF glossary wording, borderless badge CSS, Dual Class placement, no Dual Class panel for ordinary Heroes, Hero Name font weight 700, and responsive Hero artwork dimensions all passed.
- The two styles generated identical reviewed markup behavior for tested cards. Screenshots in QA working folder were generated with manually injected test images due sandbox navigation restrictions; they are not bundled into the deployed archive.

**Not changed:** game rules, card numbers, class/lineage eligibility, deck validation, preset decks, import/export, actual card artwork, or other popup behaviors. The original keyword images remain available and unmodified for other consumers.
