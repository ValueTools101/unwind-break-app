# Asset source files

`icon.png`, `adaptive-icon.png`, and `splash.png` (one level up) were generated from the
`.svg` files here — a simple breathing-circle-and-bubbles mark in the app's own color
palette (`src/theme.js`). No stock art, no AI image generator, no license to track.

To regenerate after editing an `.svg`:

```bash
npm install @resvg/resvg-js
node generate.js
```

This writes `icon.png`, `adaptive-icon.png`, and `splash.png` into this `source/` folder —
copy them up to `assets/` afterward. Feel free to replace these entirely with your own
branding later; nothing else in the app depends on this specific design.
