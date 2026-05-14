# @alenopova — Personal Site

Modern, mobile-first link-in-bio website for Elena Popova, mirroring the structure of the original Notion page but with a custom design built for GitHub Pages.

## Structure

```
.
├── index.html        # Main landing page (Russian)
├── amex.html         # AMEX referral page
├── legal.html        # Impressum + Datenschutzerklärung (German)
└── assets/
    ├── styles.css    # All site styles
    └── avatar.jpg    # ← Add Alena's profile photo here
```

## Customize

1. **Add a profile photo**: drop a square image at `assets/avatar.jpg` (recommended 400×400 px).
2. **Update social links** in `index.html` — search for `instagram.com/alenopova` and `tiktok.com/@alenopova` and replace with the real handles.
3. **Edit any text** directly in the HTML files. Content is in Russian on the main/AMEX pages and German on the legal page (matches the original).

## Publish to GitHub Pages

1. Push this folder to a GitHub repo.
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch** → `main` → `/ (root)`.
4. Site goes live at `https://<username>.github.io/<repo>/`.

GitHub Pages automatically serves `index.html` from the root.

## Design

- Soft pastel gradient background with floating blur blobs
- Glassmorphism link cards with fade-in animation
- Inter font from Google Fonts
- Fully responsive, light-mode optimized
- No build step or dependencies — just static HTML/CSS
