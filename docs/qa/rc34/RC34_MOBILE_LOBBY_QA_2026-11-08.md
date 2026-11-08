# VS AI RC34.2 - Mobile Lobby display QA (2026-11-08)

## Scope and version

Internal revision: RC34.2. Outer downloadable file: `Grandis_Legacy_VS_AI_Season0_v1.0_RC34_2026-11-08.zip`.

Only the active VS AI Lobby presentation and its associated opening coin-flip / Lobby review overlays are adapted. No gameplay, AI, rule, card, audio, or desktop UI logic was changed.

## Behavior

- Desktop: original Lobby layout and assets are unchanged.
- Mobile landscape: both Player and AI deck panels retain the existing desktop-derived side-by-side arrangement. All six actual card images, swap arrows, import selectors, Rank selectors, and Start Match stay accessible.
- Mobile portrait: exactly the same landscape canvas is CSS-rotated 90 degrees within the browser viewport, even when the physical device has autorotation locked. The user can tilt the handset to read it. No native orientation lock is used, and no message requiring autorotation is shown.
- On starting the match, the coin flip preserves this presentation. After closing it, the pre-existing battlefield orientation management takes over.
- Changes are opt-in based on handset-like touch input and viewport size. Tablets/desktops are not reskinned.

## Files changed or added

1. `shared-ui/battlefield-ui.css` - appended rules scoped to the mobile Lobby / Coin classes.
2. `shared-ui/mobile-landscape-lobby.js` - new viewport measurement, responsive scaling, CSS rotation, and overlay state tracking; no gameplay writes.
3. `index.html` - includes the new script after the existing runtime.
4. `README.md` - adds RC34.2 revision notes.
5. This QA document.

## Testing performed

- Controlled Chromium UI DOM fixture using the production CSS/JS and original art from this build: 9/9 PASS, covering touch 360x800, 393x852, 412x915, 800x360, 852x393, 915x412, 740x320, and non-touch desktop 1440x900 and 1280x720. All tested image assets loaded. Decks stayed next to each other in the logical canvas and tested controls remained within screen bounds and clickable.
- Lobby-to-opening-coin-flip and return to ordinary display: 2/2 PASS (360x800 portrait, 800x360 landscape).
- Dynamic resize while the Lobby is open, portrait to landscape back to portrait: 3/3 PASS (360x800, 800x360, 393x852), including control clicks after each resize.
- Existing RC34 engine regression: 20/20 PASS.
- JavaScript syntax: `node --check` PASS.
- ZIP contents and changed-file verification: validated during packaging.

## Test limitations

The Chromium tests were controlled DOM fixture tests with production style/script and original images, not a natural hosted mobile browser game session. Full-match end-to-end browser gameplay, actual Android hardware, audio playback and native Firefox were not retested for this visual update. The active game runtime implementation itself remains unchanged.

## Notes

The original desktop background/logo/cards/swap assets are reused without any art substitutions. The hidden engine deck-setup DOM is not styled; `.gl-lobby-overlay` is the active Lobby in this build. The existing package is replaced in place and remains named RC34 without a filename subrevision.
