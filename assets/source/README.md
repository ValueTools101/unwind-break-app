# Asset source files

`icon.png`, `adaptive-icon.png`, and `splash.png` (one level up) were generated from the
`.svg` files here — a bold crescent-and-sparks "breath wisp" mark on a rich two-tone
gradient, built from the app's own color palette (`src/theme.js`). No stock art, no AI
image generator, no license to track.

`icon.svg` uses a reliable "crescent via circle subtraction" trick: a solid white circle
with a second circle punched out of it, filled with the *same* gradient definition
(`url(#bg)`) as the background rect — since both reference the same coordinate-space
gradient, the cutout seamlessly matches whatever the background looks like at that exact
position, with no visible seam. `adaptive-icon.svg` does the same trick but with the
cutout filled as a flat color matching `app.json`'s `android.adaptiveIcon.backgroundColor`
(`#5B7FE6`) instead of a gradient, since Android composites a flat color behind the
foreground layer, not a gradient.

To regenerate after editing an `.svg`:

```bash
npm install @resvg/resvg-js
node generate.js
```

This writes `icon.png`, `adaptive-icon.png`, and `splash.png` into this `source/` folder —
copy them up to `assets/` afterward. Feel free to replace these entirely with your own
branding later; nothing else in the app depends on this specific design.
