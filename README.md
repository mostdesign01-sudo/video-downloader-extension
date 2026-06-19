# 🛸 Video Downloader

<p align="center">
  <img src="public/icons/icon128.png" alt="Video Downloader" width="128" height="128" />
</p>

<p align="center">
  <strong>Detect and download video streams from any website.</strong><br/>
  A powerful Chrome extension built with Manifest V3 + React + TypeScript.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#development">Development</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#website">Website</a> •
  <a href="#license">License</a>
</p>

---

## Features

- **Universal Video Detection** — Automatically scans pages for `<video>` elements, HLS/DASH streams, m3u8 playlists, and MP4 sources
- **One-Click Download** — Download detected videos with a single click from the popup panel
- **Multi-Format Support** — MP4, WebM, MKV, MOV, and m3u8 to MP4 conversion
- **Quality Selection** — Choose from 360p to 4K (when available from source)
- **Batch Download** — Download multiple videos from a page simultaneously
- **TV Casting** — Stream downloaded videos to Chromecast, Smart TV, or DLNA devices
- **Cloud Backup** — Secure cloud storage to keep your video library safe
- **Privacy First** — No data collection, no tracking, all processing happens locally

## Installation

### From Chrome Web Store

> *Coming soon — the extension is currently under review.*

### Developer Mode (Manual)

1. Clone this repository:
   ```bash
   git clone https://github.com/mostdesign01-sudo/video-downloader-extension.git
   cd video-downloader-extension
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Open Chrome and navigate to `chrome://extensions/`

4. Enable **Developer mode** (toggle in top-right corner)

5. Click **Load unpacked** and select the `dist/` directory

## Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
video-downloader-extension/
├── src/
│   ├── manifest.json              # Chrome Manifest V3 config
│   ├── background/                # Service worker
│   │   ├── index.ts               # Entry point
│   │   ├── stream-detector.ts     # HLS/DASH stream detection
│   │   ├── download-manager.ts    # Download orchestration
│   │   ├── m3u8-parser.ts         # m3u8 playlist parser
│   │   ├── message-router.ts      # Cross-context message routing
│   │   └── storage.ts             # chrome.storage wrapper
│   ├── content/                   # Content scripts (injected into pages)
│   │   ├── index.ts               # Entry point
│   │   ├── video-scanner.ts       # DOM video element scanner
│   │   └── mutation-observer.ts   # Dynamic content detection
│   ├── popup/                     # Extension popup UI (React)
│   │   ├── main.tsx               # React entry
│   │   ├── App.tsx                # Main app component
│   │   ├── hooks/                 # Zustand state hooks
│   │   ├── components/            # UI components
│   │   └── styles/                # Popup styles
│   ├── offscreen/                 # Offscreen document (segment download)
│   │   ├── index.ts               # Entry point
│   │   ├── segment-downloader.ts  # TS segment fetcher
│   │   └── ts-remuxer.ts         # TS → MP4 remuxing (mux.js)
│   └── shared/                    # Shared utilities
│       ├── types.ts               # TypeScript interfaces
│       ├── constants.ts           # Configuration constants
│       └── utils.ts               # Helper functions
├── public/icons/                  # Extension icons (16/48/128)
├── website/                       # Marketing landing page
│   └── src/components/            # React components
├── vite.config.ts                 # Vite + @crxjs/vite-plugin
├── tsconfig.json
└── package.json
```

## Website

The marketing landing page is located in the `website/` directory.

```bash
cd website
npm install
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build → website/dist/
```

Built with React + TypeScript + Tailwind CSS v4 + Framer Motion. Deploy the `website/dist/` directory to any static hosting (GitHub Pages, Cloudflare Pages, Vercel, Netlify).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite + @crxjs/vite-plugin |
| State | Zustand |
| Remuxing | mux.js |
| Extension API | Chrome Manifest V3 |
| Website | React 19 + Tailwind v4 + Framer Motion |

## License

MIT © 2025 Video Downloader