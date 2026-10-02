# Duckhut

**Built by Lopez_INC** — part of the Lopez_INC project portfolio.

[Play Duckhut](https://rogeliolopez2405-cloud.github.io/duckhut/) · [Suggest an idea](https://github.com/rogeliolopez2405-cloud/duckhut/issues/new/choose)

[Play V2: Afterglow](https://rogeliolopez2405-cloud.github.io/duckhut/?edition=modern) — smooth artwork, a dusk marsh, lighting, a new dog, and wave/time indicators. The classic edition remains available from the edition selector.

## Slower controller aiming

Default maximum stick speed is now 144 canvas pixels/second, down from 420. Gentle stick movements use a curved response for fine aiming. The 18% deadzone filters drift, and diagonal movement is normalized. Use the aim-speed slider or LB/RB to adjust between 20% and 100%; the setting saves on your device. Hold LT for 45% precision speed. These controls work in both editions.

## App shortcut and offline play

On Xbox, use Edge → Favorites → Add this page to favorites. This avoids typing the address each time; it still opens in Edge. Native Xbox app installation is not provided by this project.

On a supported phone or desktop browser, use **Install / shortcut**. The Install button appears when the browser offers installation. Safari users can use Share → Add to Home Screen. Each edition has a web app manifest with its own start URL. After the initial online load and service-worker installation, the game files are available offline. External fonts may fall back to system fonts. Updates wait for existing game windows to close and use the network when available.

Controller logic is tested using simulated gamepads. Browser rendering is checked separately; confirm the sensitivity on your physical controller.

A little arcade nostalgia, playable in a browser. An independent Duck Hunt-inspired prototype with original pixel art and synthesized sounds. No Nintendo assets, music, or affiliation.

## Play locally

Open `index.html` in your browser. For a local web server, run `python -m http.server 8000` in this folder, then open http://localhost:8000.

## How to play

- Click or tap a flying duck. Keyboard players can aim with arrow keys and shoot with Space.
- Rounds 1–2: two ducks and three shots per wave. Rounds 3–5: three ducks and four shots. Round 6 onward: four ducks and five shots.
- Five waves make a round. Hit 60% to advance: 6/10, 9/15, or 12/20. Flight speed gradually rises to a cap; larger flocks get extra time and always one spare shot.
- Each hit earns 100 × the current round. Ducks get faster as you advance.
- Press P to pause. The game also pauses when you leave the tab.
- Sound is optional. Your best score stays on your device if browser storage is available.

## Publish on GitHub Pages

1. Push this folder to a public GitHub repository.
2. In repository Settings → Pages, select **GitHub Actions** as the source.
3. Run the included **Deploy game to Pages** workflow (or push to `main`).
4. Put the repository URL in `repo.json` to connect the game's idea link to GitHub Issues.

## Contribute

Ideas, bug reports, artwork improvements, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Use the issue templates to suggest a feature or report a problem.

## Project structure

- `index.html` — game interface
- `style.css` — responsive arcade cabinet
- `game.js` — canvas rendering, gameplay, keyboard/touch input, audio
- `repo.json` — public repository link
- `.github/` — deployment workflow and community issue templates

No build step or package installation is required. Google Fonts is optional; system fonts work offline. Everything else runs locally in the browser. Prototype scope: one game mode, local high scores, no accounts or online leaderboard.

## License

MIT. See [LICENSE](LICENSE).

## The dog and TV controls

A custom cream-colored, shaggy companion inspired by the owner's dog pops up after every wave, wearing his blue-gray folded paper sailor hat. Classic uses pixel art and Afterglow uses smooth canvas artwork. He holds your catches, wags his tail, and chuckles when both ducks escape. Reduced-motion preferences disable his bouncing and shot flashes.

Select **TV / Fullscreen** for the big-screen layout. Connect a standard-mapped controller and press A to register it with the browser, then press A to start. Left stick or D-pad aims; A or RT fires once per press; Menu pauses; A resumes or advances. Disconnecting a controller pauses an active game.

Open the play link in Microsoft Edge on a supported Xbox. Enable game controls if the browser offers that option. Smart TV browsers vary: arrow keys and Enter/OK can work when the canvas has focus, or use a supported mouse. A computer connected to the TV by HDMI is another option. Physical Xbox and smart TV compatibility must be checked on the actual device; this project is a browser game, not a native console app.

### Phone play

Both editions fill the available phone viewport with a responsive playfield. Menu holds sound, installation help, and controller sensitivity. Rotate for a wider field. On iPhone, use Safari → Share → Add to Home Screen and enable Open as Web App if shown; launch that icon to remove browser chrome. Browser tabs retain their own address bar.


Phone and touch targets now scale with the visible field: a 390px-wide phone shows Classic ducks at about 70 × 48 CSS pixels (previously 25 × 17) and Afterglow ducks at about 89 × 44 (previously 31 × 16, excluding animated wings). Tap areas scale with the artwork and cover the wings. Desktop artwork, round rules, ammo, scoring and controller sensitivity stay the same.

### Local regression checks

No dependencies or build step are required. With Node installed, run:

```sh
node tests/game.cjs
node tests/game.cjs --modern
node tests/offline.cjs
node tests/companion.cjs
```

These exercise gameplay, simulated controllers, portrait/landscape touch mapping, enlarged target edges and offline cache handling. Actual iPhone Safari and physical controller checks remain separate device tests.

The companion blinks, wags, fetches and chuckles, with motion disabled when reduced motion is requested. Phone layouts enlarge him for visibility. Only original canvas artwork ships with the game; the private reference photograph is not included.
