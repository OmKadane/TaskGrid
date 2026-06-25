<div align="center">

# TaskGrid

**A sleek, production-ready frontend dashboard that connects to an MCP-compatible mock server — built for fast task management with a polished dark-mode UI.**

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5a29e4?style=flat-square&logo=axios&logoColor=white)

</div>

---

## Overview

TaskGrid is a **frontend-only task management dashboard** that communicates with a local MCP-compatible mock server over HTTP. It provides full task lifecycle management — create, search, filter, sort, complete, and delete tasks — with real-time UI updates and a polished dark-mode interface.

The application is designed to demonstrate a clean **Context API + custom hooks** architecture, robust UX state handling, and a component structure ready for production extension.

---

## Features

| Feature | Details |
|---|---|
| 🔌 **Live server status** | Pulsating connection badge with auto-check on load |
| ➕ **Task creation form** | Title + description with char counter, client validation, and server error handling |
| 🔍 **Real-time search** | Filters visible tasks by title or description as you type |
| ↕️ **Sort toggle** | Switch between Newest First / Oldest First instantly |
| ✅ **Complete toggle** | Mark tasks done with visual strikethrough + badge |
| 🗑️ **Delete** | Remove tasks from the local UI list without a page reload |
| 📥 **Export to Markdown** | One-click `.md` report download of all current tasks |
| ⚡ **Auto re-fetch** | Task list refreshes immediately after a successful submission |
| 💀 **Skeleton loaders** | Animated pulse cards during initial data fetch |
| 🌑 **Dark theme** | Custom surface palette (`#0f1419` base, `#1a1f26` raised) |

---

## Tech Stack

- **[React 18](https://react.dev/)** — UI with Context API & custom hooks
- **[Vite 6](https://vitejs.dev/)** — instant HMR dev server and optimised builds
- **[Tailwind CSS 3](https://tailwindcss.com/)** — utility-first dark-mode styling
- **[Axios](https://axios-http.com/)** — HTTP client with timeout & error handling
- **Express** (mock server only) — lightweight local API for development

---

## Project Structure

```
TaskGrid/
├── mock-server.js          # Local Express API (port 8000)
├── .env.example            # Environment variable template
├── src/
│   ├── services/
│   │   └── api.js          # Axios instance + all API calls
│   ├── context/
│   │   └── TaskGridContext.jsx   # Global state provider
│   ├── hooks/
│   │   ├── useServerStatus.js   # Server health hook
│   │   └── useTasks.js          # Task CRUD + fetch hook
│   └── components/
│       ├── AppLayout.jsx         # Page shell + header
│       ├── Header.jsx            # Top nav with connection badge
│       ├── ConnectionBadge.jsx   # Pulsating online/offline badge
│       ├── ServerStatusDashboard.jsx  # Health panel
│       ├── TaskForm.jsx          # Add-task form
│       └── TaskGrid.jsx          # Scrollable card grid
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### 1. Clone the repository

```bash
git clone https://github.com/OmKadane/TaskGrid.git
cd TaskGrid
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment (optional)

```bash
cp .env.example .env
# Edit .env if your mock server runs on a different port
```

### 4. Start both servers

Open **two separate terminal windows**:

**Terminal 1 — Mock API server** *(port 8000)*
```bash
node mock-server.js # Or: npm run mock-server
```

Expected output:
```
Mock server running at http://localhost:8000
```

**Terminal 2 — Vite dev server** *(port 5173)*
```bash
npm run dev
```

Expected output:
```
  VITE v6.x  ready in Xms

  ➜  Local:   http://localhost:5173/
```

### 5. Open the app

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## API Reference

The mock server exposes four endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tools/status` | Returns `{ "status": "online" }` |
| `POST` | `/tools/add-task` | Accepts `{ title, description }` · Returns `201` with the created task |
| `GET` | `/tools/list-tasks` | Returns array of all tasks |
| `DELETE` | `/tools/delete-task/:id` | Deletes a task by ID · Returns `200` with the deleted task |

> **Note:** Tasks are stored in-memory. Restarting the mock server clears all tasks.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

---

<div align="center">
  <sub>Built with ☕ and React · MIT License</sub>
</div>
