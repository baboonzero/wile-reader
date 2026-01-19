---
description: How to deploy Wile Reader to Netlify without caching issues
---

# Netlify Deployment Workflow for Wile Reader PWA

## Pre-Deployment Checklist

1. **Increment service worker cache version** in `public/sw.js` if you made significant changes:

   ```javascript
   const CACHE_NAME = "wile-reader-v3"; // Increment version number
   ```

2. **Build the production bundle**:

   ```bash
   npm run build
   ```

3. **Commit and push to GitHub**:
   ```bash
   git add -A
   git commit -m "feat: your commit message"
   git push origin main
   ```

## Key Files for Deployment

| File                | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `netlify.toml`      | Build settings + cache headers (ensures sw.js is never cached) |
| `public/sw.js`      | Service worker with network-first strategy for HTML/JS/CSS     |
| `public/_redirects` | SPA routing fallback                                           |

## Service Worker Strategy

- **Network-first** for HTML, JS, CSS → Always gets fresh content on deploy
- **Cache-first** for static assets (images, fonts) → Fast loading

## If White Screen Issue Occurs

1. User needs to hard refresh (Ctrl+Shift+R)
2. OR clear browser cache and service worker:
   - DevTools → Application → Service Workers → Unregister
   - DevTools → Application → Storage → Clear site data

## Cache Headers in netlify.toml

- `sw.js`: `no-cache, no-store, must-revalidate` (never cached)
- `/assets/*`: Immutable, 1 year cache (Vite handles cache busting)
- `/*.png`: 1 week cache
