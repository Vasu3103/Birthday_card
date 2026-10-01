# A birthday website, made with love

## Run locally

Install Node.js, then open a terminal in this folder:

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if scripts are disabled.
Open the local URL printed by Vite.

## Make it personal

Edit `src/content.js` to change her name, your signature, the letter, photo captions, and birthday wish.
Place your photos in `public/photos/`. Set each memory's `src` to `/photos/your-photo.jpg`. Empty or missing photos show decorative placeholders. Photos must be included in the project before building so they appear for everyone who opens the website.

## Build and share

### GitHub Pages

This project is configured for `https://vasu3103.github.io/Birthday_card/`.
Upload the project files, including `.github/workflows/deploy.yml`, `public`, and `src`, to the `main` branch of `Vasu3103/Birthday_card`. Do not upload `node_modules` or `dist`.
In the repository's Settings → Pages, set Source to **GitHub Actions**. The Deploy birthday website workflow builds and publishes the site on every push to `main`. If the first run happened before Pages was enabled, rerun it from the Actions tab.
Photo and music URLs use Vite's configured base path so they also work on GitHub Pages. Change `base` in `vite.config.js` if the repository name changes.

```sh
npm run build
```

The `dist` folder is the finished website. Upload it to your static hosting service to get a shareable link. The website needs no backend. Google Fonts are optional; built-in fonts appear if offline.

## Birthday journey

The website now has five separate hash routes: welcome, memories, love notes, letter, and wish. Next/Back buttons and the numbered navigation move between screens; browser Back and Forward work too. Photos appear one at a time. Tap hearts to reveal messages, open the letter and read it in short pieces, then blow out the candle. Start again resets all surprises.

## Mobile experience

Each page has its own pastel color theme. Phone navigation stays at the bottom, with safe-area spacing for iPhone home indicators. Swipe photos horizontally or use the arrows/dots. Love notes reveal on tap. Animations respect reduced-motion settings.

Verified in headless Chrome at 320x568, 360x640, 390x844, 430x932, and landscape 844x390. Navigation, photo swipe, love notes, letter pagination, candle/confetti, browser history, and restart passed. Preview screenshots are in `artifacts/`.

## Nickname surprise and eight photos

The start buttons ask "What do I lovingly call you?" The answer is `Dayan` (case-insensitive; surrounding spaces are ignored), configured by `unlockAnswer` in `src/content.js`. Other journey links also ask the question until it is answered. Refreshing starts the question again.

Add your eight real photos in `public/photos/` as `photo-1.jpeg` through `photo-8.jpeg`, or change their paths in `src/content.js`. Each has its own caption. Until supplied, decorative placeholders are shown.

## More little surprises

Returning to the birthday card (including browser Back or Start again) resets the nickname answer. Starting the journey again asks the question again with an empty input. Wrong answers cycle through three cute messages.

Tap a photo to flip it and read its secret note, configured by each memory's `note`. Send a heart to a memory for a little heart animation. Swipe and arrow navigation still work. The finale includes repeatable party poppers, confetti, sparkle bursts, and a final gift note configured by `finalNote`. Reduced-motion settings hide particle effects.

Repeated gate, wrong answers, flips, hearts, swipes, party effects, final gift, browser history, restart, and 320/360/390/430px layouts were checked in Chrome. `artifacts/mobile-party.png` shows the updated finale.

## Background music

Copy your chosen audio file into `public/music.mp3` (an actual MP3 file, not a renamed video). The music button in the header starts/pauses it. Music loops and continues as she moves between pages. It starts automatically when she submits the correct nickname, directly from that tap or Enter press for phone browser compatibility. Wrong answers do not start music. The header button can still pause or resume playback. Default volume is 35%.

To use a different filename or format, change `musicSrc` in `src/content.js`, for example `/my-song.m4a`, and put that file in `public/`. Include the audio before running `npm run build` so it is copied into the published website. Without the file, the website still works and the music button reports that it could not play.
