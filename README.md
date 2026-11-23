# The life of a How2 prompt

A click-through talk about the How2To composer for Vision Pro. Plain HTML, CSS and JS: no build step.

- **Run:** `python3 -m http.server 4317` in this folder, then open http://localhost:4317
  (or the `how2-composer` entry in `../.claude/launch.json`).
- **Change the words or order:** edit `beats.js` only. One beat is one press.
- **Change colours, sizes, timing:** the token block at the top of `styles.css`.
- **Keys:** → / Space next · ← back · O all beats · F full screen · R restart. Click (left fifth goes back) or swipe also works.
- **Link to a beat:** `#12` opens beat 12.

Assets in `assets/` were exported from the How2To Vision Pro Figma file (Components section).
Fonts: SF Pro on Apple devices via the system font; Inter elsewhere.
