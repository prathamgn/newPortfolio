# Portfolio Site

A vanilla HTML/CSS/JS portfolio — no frameworks, no build step, no npm
packages. All personal content lives in `data/profile.json`; the HTML
files are shells that fetch and render it.

## Structure

```
.
├── index.html                    # main portfolio page (shell only)
├── resume.html                   # printable résumé view (optional, shell only)
├── .nojekyll                     # tells GitHub Pages not to run Jekyll on this repo
├── assets/
│   ├── css/
│   │   ├── styles.css            # theme tokens, layout, glass cards, animations
│   │   └── resume.css            # extra styling + print rules for resume.html
│   ├── js/
│   │   ├── main.js               # loads profile.json, renders index.html sections
│   │   └── resume.js             # loads profile.json, renders resume.html
│   └── resume/
│       └── resume.pdf            # <-- put your résumé PDF here
├── data/
│   └── profile.json              # <-- all personal content lives here
└── README.md
```

## 1. Content

`data/profile.json` is already filled in. If you ever need to change
wording, add a job, or update links, edit that file only — never edit
personal details directly in the HTML, since the HTML has none hardcoded.

To make the "Download PDF" button work, add your résumé PDF at
`assets/resume/resume.pdf` (or change `meta.resumeFile` in
`profile.json` if you use a different path/name).

## 2. Open it locally

Both pages `fetch()` `data/profile.json`, and browsers block `fetch()`
against `file://` URLs. So don't just double-click `index.html` —
serve the folder over a local HTTP server instead:

```bash
# Python 3 (built in on macOS/Linux, and on Windows if Python is installed)
cd path/to/this/folder
python3 -m http.server 8000

# or, if you have Node.js:
npx serve .
```

Then open:
- `http://localhost:8000/` for the portfolio
- `http://localhost:8000/resume.html` for the printable résumé

Stop the server with `Ctrl+C` when you're done.

## 3. Put it on GitHub Pages

1. Create a GitHub repository (or reuse one) and push this folder's
   contents to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. On GitHub, open the repo and go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a
   branch**.
4. Set branch to `main` and folder to `/ (root)`, then click **Save**.
5. Wait 1–2 minutes, then visit:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```
   If your repo is named exactly `<your-username>.github.io`, it's
   served at the root instead: `https://<your-username>.github.io/`.
6. Every future push to `main` redeploys automatically. If pages ever
   404 on refresh or CSS/JS look unstyled, double-check `.nojekyll` is
   present at the repo root (it already is in this project) — it stops
   GitHub Pages from ignoring folders that start with `_` and from
   otherwise processing the site through Jekyll.

## Notes

- Theme (dark/light) is remembered per browser via `localStorage`.
- `#summary` is an anchor alias inside the About section, so both
  `#about` and `#summary` scroll to the same place.
- All animations respect `prefers-reduced-motion`.
- `resume.html` has a "Print / Save as PDF" button that uses the
  browser's native print dialog — handy if you don't want to maintain
  a separate PDF file by hand.
