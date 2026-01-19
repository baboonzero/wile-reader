# 🐺 Wile Reader

**Catch every word** — A modern speed reading app using RSVP technology with Optimal Recognition Point (ORP) highlighting.

![Status](https://img.shields.io/badge/Status-PWA%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-purple)

---

## ✨ Features

### Reading Experience

- **RSVP Display** — Words appear one at a time at a fixed focal point
- **ORP Highlighting** — Red character marks the optimal recognition point
- **Dynamic Pacing** — Automatic slowdown for punctuation and long words
- **Speed Control** — Adjustable 100-900 WPM with presets
- **Responsive Design** — Optimized word positioning for mobile, tablet, and desktop

### Input Methods

- **Text** — Paste or type directly
- **Markdown** — Upload `.md` files
- **PDF** — Upload `.pdf` files (max 1MB)

### Progressive Web App

- **Installable** — Add to home screen on mobile/desktop
- **Offline Ready** — Works without internet after first load
- **Persistent Settings** — WPM preference saved locally
- **Resume Reading** — Pick up where you left off

### Controls

| Key    | Action                      |
| ------ | --------------------------- |
| Space  | Play/Pause                  |
| ← / →  | Skip 10 words               |
| ↑ / ↓  | Adjust speed                |
| Escape | Show/hide controls          |
| Tap    | Show/hide controls (mobile) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the project
cd wile-reader

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
wile-reader/
├── src/
│   ├── components/
│   │   ├── Controls.tsx      # Speed slider, playback controls
│   │   ├── ProgressBar.tsx   # Top progress indicator
│   │   ├── TextInput.tsx     # Input screen with tabs
│   │   ├── WordDisplay.tsx   # RSVP display with ORP
│   │   ├── ResumePrompt.tsx  # Resume reading prompt
│   │   └── ReadingComplete.tsx
│   ├── hooks/
│   │   ├── useReader.ts      # Core reading state machine
│   │   └── useLocalStorage.ts # Persistent state hook
│   ├── utils/
│   │   ├── fileParser.ts     # PDF and Markdown parsing
│   │   ├── orp.ts            # ORP calculation
│   │   ├── storage.ts        # Session persistence
│   │   └── textParser.ts     # Text tokenization
│   ├── App.tsx
│   ├── main.tsx              # Entry + service worker registration
│   └── index.css
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── icon-192.png          # App icon (small)
│   ├── icon-512.png          # App icon (large)
│   └── pdf.worker.min.mjs    # Local PDF.js worker
└── index.html
```

---

## 🧠 The Science

### RSVP (Rapid Serial Visual Presentation)

Displays text sequentially at a single focal point, eliminating eye movement and allowing faster processing.

### ORP (Optimal Recognition Point)

Each word has an optimal character where the eye naturally focuses:

| Word Length | ORP Position  | Example           |
| ----------- | ------------- | ----------------- |
| 1-3 chars   | 1st character | **r**un           |
| 4-5 chars   | 2nd character | s**p**eed         |
| 6-9 chars   | 3rd character | re**a**ding       |
| 10+ chars   | length/3      | com**p**rehension |

---

## 📱 PWA Installation

### Mobile (iOS/Android)

1. Open the app in your browser
2. Tap Share → "Add to Home Screen"
3. The app now works offline!

### Desktop (Chrome/Edge)

1. Look for the install icon in the address bar
2. Click "Install"
3. App opens in its own window

---

## 🎨 Credits

- Inspired by Spritz, Reedy, and Kindle Word Runner
- Icon: ACME Book Co. (Looney Tunes homage)
- Built with React, TypeScript, Vite, and Tailwind CSS

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
