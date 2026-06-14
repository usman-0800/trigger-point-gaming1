# Trigger Point Gaming

A 100% static FPS gaming blog and tools site, ready for GitHub Pages deployment.

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `triggerpointgaming`)
2. Upload ALL files inside this `public/` folder to the **root** of your repository (not a subfolder — the `index.html` must be at the root of the repo)
3. Go to your repo → Settings → Pages → Source: **Deploy from branch** → Branch: `main` → Folder: `/ (root)` → Save
4. Your site will be live at `https://yourusername.github.io/triggerpointgaming/`

## IMPORTANT: Custom Domain (Recommended)

For AdSense approval, use a custom domain. In GitHub Pages settings, add your custom domain (e.g. `triggerpointgaming.com`). Create a `CNAME` file in the repo root containing just your domain name.

## Adding Google AdSense

Search all HTML files for `[ SYSTEM_AD_UNIT_0` — replace these placeholder divs with your actual AdSense `<ins>` tags. The placeholder divs have fixed min-heights already set to prevent Cumulative Layout Shift (CLS) when ads load.

## File Structure

```
public/
├── index.html              ← Homepage (blog grid + hero)
├── style.css               ← All styles (single file)
├── tools.js                ← All 4 tool logic (single file)
├── tools.html              ← Tools hub page
├── about.html
├── privacy-policy.html
├── terms.html
├── disclaimer.html
├── contact.html
├── 404.html                ← GitHub Pages 404 fallback
├── README.md
├── categories/
│   ├── aim-sensitivity.html
│   ├── hardware-gear.html
│   ├── system-performance.html
│   └── display-monitor.html
└── blog/
    ├── perfect-mouse-sensitivity-fps.html
    ├── what-is-edpi-calculate.html
    ├── best-mouse-grip-styles.html
    ├── best-budget-gaming-mouse-under-50.html
    ├── mechanical-keyboard-switches-guide.html
    ├── how-to-clean-gaming-mousepad.html
    ├── reduce-input-lag-windows-11.html
    ├── increase-fps-pc-games.html
    ├── optimal-monitor-settings-competitive.html
    └── why-144hz-matters-competitive.html
```

## Performance Notes

- Zero external CSS frameworks or JS libraries
- All fonts are system fonts (no Google Fonts requests)
- All images are CSS placeholder divs (add your own images via `src` attributes)
- AdSense slots have fixed min-heights → Zero Cumulative Layout Shift (CLS)
- All scripts use `defer` attribute
- Single `style.css` and `tools.js` — minimal HTTP requests

## Adding Real Images

Replace the placeholder div elements like:
```html
<div class="card-thumb" role="img" aria-label="...">[ IMG 16:9 ]</div>
```
with:
```html
<img src="../images/your-image.jpg" alt="Your descriptive alt text" class="card-thumb" loading="lazy" width="800" height="450">
```
