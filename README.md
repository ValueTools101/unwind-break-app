# Unwind — a 10-minute stress-relief break app

An Expo/React Native app for anyone who wants a quick, pressure-free break: breathe with
guided patterns and ambient sound, play a calm game, journal or vent out loud, window-shop a
pretend catalog, or read a joke. This README is the honest handoff: what's built and how,
and exactly what's left, in order.

## Why this stack

This mirrors the [`cycle-planner-app`](https://github.com/ValueTools101/cycle-planner-app)
repo's conventions on purpose, for consistency across your Play Store apps: Expo/React
Native, no `@react-navigation` (a small hand-rolled navigation stack in `App.js` instead —
see below), and the same honest-handoff README/PRIVACY_POLICY.md structure. It now also
uses Firebase Auth the same way the cycle planner does, for the same reason: optional
account sign-in so your data can follow you to a new device.

**Important difference from the cycle planner:** signing in is entirely optional here.
Everything (breathing, games, journaling, shopping, jokes) works fully offline with no
account. Only if you choose to sign in does data start leaving the device — see "Data
Safety" below, since that changes the privacy story from the app's original no-backend
design.

## Navigation

Instead of `@react-navigation`, `App.js` keeps a small in-memory navigation **stack**
(array of `{name, params}`), with `push`/`pop`/`replace` functions passed to every screen as
`onNavigate`/`onBack`/`onReplace`. Android's hardware back button is wired to `pop()` via
`BackHandler`, so it now correctly steps back through the stack (Games → Bubble Pop → Games
→ Home) instead of exiting the app from any sub-screen — this was a real reported bug in an
earlier version, fixed by this rewrite.

## A note on "AI-generated audio/video/images, no license required"

You asked for AI-generated media so nothing needs licensing. I don't have access to an AI
audio/video/image generation API from this environment, so I built the same *outcome*
(zero licensing risk, fully original) a different way:

- **Ambient sounds** (`src/utils/audioSynth.js`) are synthesized from scratch with plain
  math — pink/brown noise, filtered rain/wind textures with real transient "droplets" and
  gusts, and layered sine tones — generated once on-device and cached as a `.wav` file.
  Nothing is downloaded, streamed, recorded, or scraped from anywhere.
- **Backgrounds/visuals** (breathing companion character, per-sound animated backdrops, app
  icon) are all React Native `Animated` views or hand-written SVG rasterized with
  `@resvg/resvg-js` — no video files, no stock art, no AI image generator.

If you later want richer, more realistic ambient audio or visuals from an actual AI model
(e.g. ElevenLabs, Suno, Runway, Midjourney), that needs an external account and API key I
don't have — happy to wire in that integration once you have one.

## A note on the Window Shop's look and the "Amazon-like" ask

You asked for a marketplace UI "90% similar to Amazon" without copying it outright. I built
a shop home with a rotating promo banner, a tappable category grid, and Bestsellers/Trending
rows — layout patterns extremely common across marketplace apps generally, not specific to
any one brand — rather than replicating Amazon's actual visual identity (its specific color
scheme, logo, typography, or trade dress). That keeps this on the right side of trademark/
trade-dress risk while still feeling like a "real" shopping app.

## A note on currency

Prices are stored in USD and converted for display using your device's detected currency
(`src/utils/currency.js`) via a **small static, approximate conversion table** — not a live
exchange-rate API — so the app stays fully offline. These rates will drift out of date;
update `RATES_FROM_USD` in that file occasionally, or wire in a real exchange-rate API later
if precise conversion matters for your use case.

## ✅ What's done

- **Breathe & Sounds** — 3 breathing patterns (Box, 4-7-8, Simple), a friendly animated
  breathing companion character (eyes blink, mouth opens/closes with your breath) instead of
  a plain circle, a 5-sound ambient mixer with independently distinct sounds (rain now has
  real droplet transients, wind is airy/gusty, "Deep Hum" is a smooth low swell, and the two
  tones are pitched to actually be audible on small phone speakers), and a matching animated
  background per active sound (falling rain, drifting wind shapes, pulsing waves/glow/
  sparkle) built with `Animated`, no video.
- **Games hub** with 3 games: Bubble Pop (unchanged, scoring-free), **Calm Slide** (a new
  3×3 sliding tile puzzle — the "puzzle-based" game requested), and **Memory Match** (a new
  pairs-matching card game) — both low-pressure, no timer forcing a fail state.
- **Laugh It Out** — a new tab with ~50 original jokes (written for this app, not scraped,
  so there's nothing to attribute or license), tap-to-reveal punchline, "Next Joke."
- **Journal & Vent** — unchanged Write/Speak tabs; journal entries now also sync to the
  cloud when signed in (see Auth below). Voice recordings stay device-only either way.
- **Window Shop redesign** — a shop home with an auto-rotating promo banner, a 10-category
  grid (was 4), Bestsellers/Trending rows with randomized picks each visit, then a full
  per-category catalog screen with search. Catalog grew from 16 to 80 items. Prices show in
  your local currency (see note above). The "no real checkout" flow is unchanged.
- **Optional accounts (Firebase Auth)** — email/password and Google sign-in, mirroring the
  cycle planner's pattern (`src/context/AuthContext.js`, `src/config/firebaseConfig.js`).
  When signed in, journal entries, cart, and your all-time relaxed-minutes stat sync to
  Firestore (`src/utils/cloudSync.js`) — a simple one-document-per-user sync, not
  fine-grained, chosen deliberately to minimize merge-bug surface area at this data size.
  **Voice recordings are NOT synced** — that needs Firebase Storage (file upload), a
  separate, larger piece of work I didn't want to bundle in silently.
- **Visual redesign** — richer color/shadow/typography tokens in `src/theme.js`, elevated
  cards throughout, a branded Home header with an account button, and a completely new app
  icon/adaptive icon/splash screen (a bold gradient "breath wisp" crescent mark with two
  accent sparks, replacing the earlier pale concentric-circles version) — see
  `assets/source/README.md`.

## ⚠️ What I could not do from here (needs your own accounts, or a real device)

I don't have an Expo/Android build environment or a device/emulator in this session, so
**none of this has been run** — only written and carefully reasoned through, and every file
was syntax- and import-checked with `esbuild`. Please:

1. **Install and run it first.** `cd unwind-break-app && npm install && npx expo install --fix`
   (aligns dependency versions to the Expo SDK), then `npx expo start` — scan the QR code
   with Expo Go on your phone. Test every mode — especially the new games, the ambient
   sound/background pairing, and sign-in — on a real device before building anything.
2. **Set up Firebase** (only needed if you want sign-in/sync to actually work — everything
   else works without it):
   - Create a **new** [Firebase project](https://console.firebase.google.com) — separate
     from Cycle Planner's, so the two apps' users and data stay independent (or add Unwind
     as a second "app" inside the same Firebase project if you'd rather manage one console;
     either works, just keep the Firestore data model in mind if you share a project).
   - Add a Web app to get your config values → paste into `src/config/firebaseConfig.js`
     (currently all `REPLACE_ME` placeholders).
   - Enable **Email/Password** and **Google** under Authentication → Sign-in method.
   - Enable **Firestore** (Native mode) under Build → Firestore Database.
   - For Google sign-in specifically: create an OAuth 2.0 Web application Client ID in
     [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and paste it
     into `GOOGLE_WEB_CLIENT_ID`; also create an Android OAuth client ID for
     `GOOGLE_ANDROID_CLIENT_ID`. This is the fiddliest part — launch with email/password
     only first if you want to move faster, exactly like the cycle planner's own notes say.
   - Set Firestore security rules so a user can only read/write their own document, e.g.:
     ```
     match /users/{userId} {
       allow read, write: if request.auth != null && request.auth.uid == userId;
     }
     ```
3. **Create an [Expo/EAS account](https://expo.dev)** (free) and run `eas init` in this
   folder to fill in the real `projectId` in `app.json`.
4. **Fill in the `[FILL IN...]` placeholders** in `PRIVACY_POLICY.md` — your name/company,
   contact email, and today's date.
5. **Register a [Google Play Developer account](https://play.google.com/console/signup)**
   — $25 one-time fee, if you haven't already from the cycle planner app.
6. **Host `PRIVACY_POLICY.md` at a public URL** (GitHub Pages is free) — Play Console
   requires a live link.
7. **Build the release bundle:**
   ```bash
   npm install -g eas-cli
   eas login
   eas build --platform android --profile production
   ```
   (Use `--profile preview` first for a directly-installable `.apk` to sideload and test.)
8. **Create the Play Console listing** — title, description, screenshots, content rating,
   and the Data Safety form (see below).
9. **Closed testing first**, same as any new personal developer account: 20+ testers for
   14 days before Google grants production access.

## Data Safety form — how to answer it

This now depends on whether you ship sign-in enabled:

- **If you never set up Firebase** (placeholders left as-is, sign-in buttons will just show
  a "not configured" error): the app behaves exactly like before — data collected is
  user-generated content (journal text, voice recordings) stored **on-device only**, not
  shared with third parties, not used for advertising.
- **If you configure Firebase and ship sign-in**: for signed-in users, journal entries, cart
  contents, and your relaxed-minutes stat are also stored on Google's Firebase servers
  (Firestore), scoped to that user's account, used only to sync their own data across their
  own devices — not shared with third parties, not used for advertising. Voice recordings
  remain on-device only regardless of sign-in status. Update `PRIVACY_POLICY.md` explicitly
  to disclose Firebase/Google as a data processor if you enable this — Google actively
  audits Data Safety form answers against actual app behavior.
- Data deletion: user-initiated, in-app (delete any entry/recording; the Profile screen's
  "Delete Account" removes the sign-in account); uninstalling clears all local data.

## Monetization — not wired in

Two realistic options, consistent with the cycle planner's approach:
- **Google Play Billing** for a one-time "extra sound packs" or "remove ads" unlock —
  `react-native-iap`.
- **AdMob** (`react-native-google-mobile-ads`) — if you go this route, keep ads off the
  Journal & Vent screen specifically, since that's where the most personal content lives.

## Project structure

```
App.js                            — navigation stack (push/pop/replace) + BackHandler + AuthProvider
src/
  theme.js                        — colors, spacing, radii, typography scale, shadow presets
  config/firebaseConfig.js         — YOUR Firebase project credentials go here
  context/AuthContext.js           — Firebase Auth: email/password, Google, reset, delete
  data/
    constants.js                  — breathing patterns, sound presets (+ visual mapping),
                                     shop categories/catalog/banners, moods
    jokes.js                      — original joke list for Laugh It Out
  utils/
    storage.js                    — AsyncStorage read/write (journal, cart, rants, stats)
    cloudSync.js                  — Firestore push/pull-and-merge, only active when signed in
    audioSynth.js                  — procedural sound synthesis + WAV encoding + on-device caching
    currency.js                   — device-currency price formatting (static approximate rates)
  components/                     — Header, ModeCard, PrimaryButton, BreathingCircle (companion),
                                     AmbientBackground, SoundTile, Bubble, ProductCard, CartButton
  screens/
    HomeScreen.js                  — branded header + account button + mode picker + stat card
    BreatheScreen.js               — breathing companion + ambient mixer + backgrounds
    VentScreen.js                  — Write (journal) + Speak (voice rant) tabs
    LaughScreen.js                 — joke of the moment
    AboutScreen.js                 — philosophy blurb + privacy policy link
    ProfileScreen.js                — signed-in account info, sign out, delete account
    auth/                          — LoginScreen, SignUpScreen, ForgotPasswordScreen
    games/                         — GamesHomeScreen, BubblePopScreen, SlidingPuzzleScreen,
                                     MemoryMatchScreen
    shop/                          — ShopHomeScreen (banner/categories/bestsellers),
                                     ShopCategoryScreen (full catalog + search), CartScreen
assets/
  icon.png, adaptive-icon.png, splash.png  — generated app icon/splash (see source/README.md)
  source/                          — the SVGs + script that generated the above
```

## Known limitations

- **Not yet run on a device or emulator** — see item 1 above. Every file was syntax- and
  import-checked with `esbuild`, including a full bundle of `App.js`, but that doesn't catch
  runtime-only issues (native module behavior, real audio playback, actual Firebase network
  calls). Treat it as "should work" rather than "confirmed working" until you test it.
- **Ambient loops aren't perfectly seamless** — noise-based sounds use a short fade at the
  loop point rather than a true crossfade, so there may be a very faint click every 8
  seconds.
- **Cloud sync is simple by design** — one Firestore document per user, re-written in full
  on every local change. Fine at this app's data size (a personal journal + a pretend cart),
  but not built to scale to thousands of journal entries efficiently.
- **No `@react-navigation`** — see "Navigation" above for why and how the hand-rolled stack
  works; it's a drop-in-shaped API (`push`/`pop`) if you want to swap it in later.
- **`expo-av`** is used for audio/recording, which Expo has been migrating away from in
  newer SDKs in favor of `expo-audio`/`expo-video`. This project pins Expo ~51, where
  `expo-av` is still supported — budget time to migrate if you later upgrade the SDK.
- **Currency conversion is static/approximate** — see the currency note above.
