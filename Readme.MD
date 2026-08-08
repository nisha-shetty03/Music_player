# Turntable — Music Player

A browser-based music player built with plain HTML, CSS, and JavaScript. No frameworks, no build step — open it and it works.

![status](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-e8b34c)

## Features

- ▶️ Play, pause, next, and previous controls
- 🎵 Live display of song title, artist, and duration
- ⏱️ Draggable/clickable progress (seek) bar
- 🔊 Volume slider
- 📃 Clickable playlist with an active-track indicator
- 🔁 Autoplay toggle — automatically advances to the next track when one ends
- ⌨️ Spacebar toggles play/pause
- 🎨 A spinning vinyl disc with a tonearm that lifts and drops as you play/pause
- ♿ Visible keyboard focus states and `prefers-reduced-motion` support

## File structure

```
music-player/
├── index.html          # Markup
├── style.css            # All styling
├── script.js             # Player logic (playback, playlist, progress, volume)
├── audio/
│   ├── golden-hour.wav
│   ├── night-drive.wav
│   ├── static-bloom.wav
│   └── paper-weather.wav
└── README.md
```

## Getting started

1. Keep all files and the `audio/` folder together in the same structure shown above — the player loads tracks using relative paths (e.g. `audio/golden-hour.wav`).
2. Open `index.html` in a browser.
   - Double-clicking the file works in most browsers.
   - If your browser blocks local audio loading, serve the folder instead:
     ```bash
     cd music-player
     python3 -m http.server 8000
     ```
     then visit `http://localhost:8000`.

## About the demo tracks

The four songs included (`Golden Hour`, `Night Drive`, `Static Bloom`, `Paper Weather`) are short original synthesized melodies generated for this project — not real recordings — so the player has something to actually play out of the box, with no licensing concerns.

## Using your own songs

Open `script.js` and edit the `tracks` array near the top:

```js
const tracks = [
  { title: "Your Song Title", artist: "Artist Name", src: "audio/your-file.mp3" },
  // add as many as you like
];
```

- `src` can point to a local file in `audio/` or to a full URL.
- Supported formats depend on the browser but MP3 and WAV both work everywhere.
- Durations and playlist entries update automatically — no other code changes needed.

## Customizing the look

All design tokens (colors, fonts) are defined as CSS custom properties at the top of `style.css`:

```css
:root{
  --gold:#e8b34c;   /* accent color */
  --surface:#211b33; /* card background */
  --text:#f3efe7;    /* primary text */
  ...
}
```

Change these values to re-theme the whole player without touching any other rule.

## Browser support

Works in current versions of Chrome, Firefox, Safari, and Edge. Uses the standard HTML5 `<audio>` element and CSS custom properties — no polyfills required.