# Duckhut

[Play Duckhut](https://rogeliolopez2405-cloud.github.io/duckhut/) · [Suggest an idea](https://github.com/rogeliolopez2405-cloud/duckhut/issues/new/choose)

A little arcade nostalgia, playable in a browser. An independent Duck Hunt-inspired prototype with original pixel art and synthesized sounds. No Nintendo assets, music, or affiliation.

## Play locally

Open `index.html` in your browser. For a local web server, run `python -m http.server 8000` in this folder, then open http://localhost:8000.

## How to play

- Click or tap a flying duck. Keyboard players can aim with arrow keys and shoot with Space.
- Two ducks appear in each wave. You have three shots per wave.
- Five waves make a round. Hit at least six of ten ducks to advance.
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

An original animated marsh retriever pops up after every wave. He holds your catches, wags his tail, and chuckles when both ducks escape. Reduced-motion preferences disable his bouncing and shot flashes.

Select **TV / Fullscreen** for the big-screen layout. Connect a standard-mapped controller and press A to register it with the browser, then press A to start. Left stick or D-pad aims; A or RT fires once per press; Menu pauses; A resumes or advances. Disconnecting a controller pauses an active game.

Open the play link in Microsoft Edge on a supported Xbox. Enable game controls if the browser offers that option. Smart TV browsers vary: arrow keys and Enter/OK can work when the canvas has focus, or use a supported mouse. A computer connected to the TV by HDMI is another option. Physical Xbox and smart TV compatibility must be checked on the actual device; this project is a browser game, not a native console app.
