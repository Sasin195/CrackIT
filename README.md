# 45-Day DSA Placement Prep

A modern, responsive **DSA Placement Preparation** web app for final-year BTech students preparing for coding interviews and placements.

Build DSA confidence for placements — one day at a time.

## Features

- **Home Dashboard** — current progress, today's plan, quick stats, streak tracking
- **45-Day Roadmap** — Arrays → Strings → Hashing → Two Pointers → Sliding Window → Binary Search → Linked List → Stack → Queue → Recursion → Backtracking → Trees → BST → Heap → Greedy, with revision days built in
- **Daily Plans** — problems per day with difficulty, LeetCode links, solve/review status and auto-saved personal notes
- **Duplicate problem handling** — progress keyed by `dayN-problemM`, so repeated problems (Two Sum, Valid Palindrome, Move Zeroes, etc.) are tracked independently per day
- **Progress Dashboard** — days completed, problems solved, difficulty stats, topic-wise progress bars, weak topics, streak
- **Revision System** — revision days automatically surface problems you flagged *Needs Review*
- **Weak Topic Detection** — computed from unsolved/review problems and placement-simulation mistakes
- **Placement Simulation** — 1 Easy + 2 Medium with a live timer, score, accuracy, time taken, weak-topic analysis and history
- **Streak System** — current/longest streak, derived from real completion dates; missing a day never deletes progress
- **Offline & private** — no sign-in, no backend. All progress is saved in each browser's `localStorage`.
- **Themes** — Light / Dark / System

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React 18, React Router DOM, React Icons, Vite |
| Local server | Node.js (stdlib only, no dependencies) — `serve.cjs` |
| Database  | None — progress lives in browser `localStorage` |

Data model: the entire app state is saved to `localStorage` on every change (instant, offline). The content (roadmap/topics) is bundled into the build at compile time from `data/dsa-app-data.json`. There is no account, no server database, and nothing is sent to any remote server.

## Project Structure

```text
dsa-placement-app/
│
├── data/
│   └── dsa-app-data.json   # app content (roadmap/topics) — bundled at build time
├── src/
│   ├── components/         # reusable UI components
│   ├── context/            # global state (AppContext)
│   ├── data/               # roadmap loader (reads data/dsa-app-data.json)
│   ├── hooks/              # theme hook
│   ├── pages/              # route pages
│   ├── styles/             # global CSS with light/dark themes
│   ├── utils/              # progress logic, storage, helpers, toasts
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vercel.json             # SPA rewrites (all routes → index.html)
├── vite.config.js          # aliases @appdata → data
├── serve.cjs               # local static server: serves the built site (npm start)
├── package.json
└── README.md
```

## The Data File (`data/dsa-app-data.json`)

This file holds the **app content**:

| Field             | What it is |
| ----------------- | ---------- |
| `topics`          | Topic names used for stats/weak-topic analysis |
| `topicColors`     | Color per topic |
| `difficultyColors`, `difficultyOrder` | Difficulty colors + sort order |
| `roadmap`         | The 45-day plan (days, problems, LeetCode slugs, difficulty) |

It is read at build time and bundled into the site. Your **progress** is stored only in your browser's `localStorage` (per device/browser, no accounts).

> Editing the **content** (roadmap/problems) requires a one-time `npm run build` afterwards. There is no server-side progress file anymore.

## Getting Started

Requirements: Node.js 18+.

### 1. Install (only needed the first time)

```bash
cd dsa-placement-app
npm install
```

### 2. Build once (only needed the first time)

```bash
npm run build
```

### 3. Start the website (every time you use it)

```bash
npm start
```

This starts a tiny local server and opens the website in your browser at `http://127.0.0.1:5173`. Keep that window open while you use it, and press `Ctrl+C` to stop it.

> **Note:** Progress is saved in each browser's `localStorage` — it stays on that browser/device and never leaves it.

## Data

- Every change auto-saves to `localStorage` in your browser.
- Settings → *Reset Current 45-Day Plan* clears the plan. Settings → *Reset All Progress* clears everything including simulation history.
- Resets are protected by a confirmation dialog.

## Deploy to Vercel

This is a static site — no backend. Each visitor's progress is saved in their own browser's `localStorage`, so the deployed site works exactly like the local one.

Vercel auto-detects everything — no custom settings needed:

- **Root Directory:** (repo root — leave empty)
- **Framework Preset:** Vite (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `dist` (default)
- SPA routing is handled by `vercel.json` (all routes rewritten to `index.html`)

Import the GitHub repository in the [Vercel dashboard](https://vercel.com) and accept all defaults.

> **Note:** Content edits (`data/dsa-app-data.json`) require a rebuild/redeploy. Progress never touches the server.

## Production Build

```bash
npm run build    # builds into dist/
npm start        # serves the built site locally
```
