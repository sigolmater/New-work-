# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A dual-purpose project combining a **Python ray-tracing simulation engine** and a **React frontend** (Create React App) that visualizes energy metrics derived from coupling parameters. There is also an entertainment/content kit for a YouTube/podcast workflow.

## Commands

### React Frontend

```bash
npm install          # install dependencies
npm start            # dev server at localhost:3000
npm test             # run Jest tests (watch mode)
npm run build        # production build to build/
```

To run a single test file:
```bash
npm test -- --watchAll=false --testPathPattern=CountrysideBlackholeProduction
```

### Python Simulation

```bash
python run.py --rays 200 --bounces 120 --out outputs/exp.csv
python tests.py                         # prints "OK: tests passed"
python plot.py outputs/exp.csv          # saves _bounces.png next to the CSV
python auto_chapters.py transcript.txt  # extracts "MM:SS 제목" lines → JSON chapters
```

`run.py` and `plot.py` are wrappers — their comments label them as living under `experiments/`; the actual engine is imported from `engine/ray.py` (not yet in-tree, but expected there). `tests.py` is similarly a wrapper labeled `verification/tests.py`.

## Architecture

### React Layer (`src/`)

`App.js` is a thin shell that mounts a single component:

```
App
└── CountrysideBlackholeProduction   (orchestrator)
    ├── ContentReminder              (content calendar sidebar)
    ├── CouplingControls             (α/β/γ/λ sliders)
    ├── MetricsDisplay               (energy metric cards)
    └── BaselinePanel                (baseline data + CSV upload)
```

**Custom hook** — `src/hooks/useEnergyMetrics.js` owns all simulation state and math:
- `params` (`alpha`, `beta`, `gamma`, `lambda`) and `baseline` (`power`, `qps`, `latency`) are the only inputs
- `compute` (memoized via `useCallback`) recalculates all six metrics whenever either changes via `useEffect`
- `reset` restores both to their hardcoded defaults

**`CountrysideBlackholeProduction.jsx`** is a pure orchestrator: it calls `useEnergyMetrics`, wires up `updateParam` → `CouplingControls`, and passes `metrics` → `MetricsDisplay`, `baseline/setBaseline` → `BaselinePanel`.

**`ContentReminder.jsx`** fetches `/content_calendar.csv` (served from `public/`) on mount and shows the next 5 upcoming schedule items.

**`src/utils/contentCalendarParser.js`** is a pure-function utility (no React) — all CSV parsing and date math lives here.

### Energy Math (in `useEnergyMetrics.js`)

Efficiency η is Shannon entropy of the normalized (α, β, γ, λ) vector divided by log₂(4). All other metrics derive from η:

```
rawΔI      = α·β + γ·λ
modifiedΔI = rawΔI · η
Evirt      = modifiedΔI · power · (1 + α)
Ereal      = Evirt · η · β
G          = qps · (1 + modifiedΔI · γ) · η
Lred       = latency · (1 − modifiedΔI · λ · η)
```

### Python Layer

The engine entry point is `engine/ray.py` exposing `Ray(position, direction)` and `run(ray, bounces) → (_, history)`. `run.py` seeds a `random.Random` for reproducibility (default seed 7) and writes bounce history to CSV.

### CSS Design Tokens

CSS custom properties are defined in `src/index.css` (`:root` block) and referenced throughout `CountrysideBlackholeProduction.css`:
- `--color-primary` / `--color-primary-dark` — blue slider/accent (`#3498db`)
- `--color-success` / `--color-success-dark` — green recalculate button
- `--color-danger` / `--color-danger-dark` — red reset button
- `--shadow-card`, `--radius-sm/md/lg` — shared elevation and border-radius

Component CSS files are co-located with their `.jsx` files. Since CRA injects CSS globally, `CountrysideBlackholeProduction.css` covers all sub-components rendered within it (no need for separate CSS files for `CouplingControls`, `MetricsDisplay`, `BaselinePanel`).

### Backend Integration (not yet implemented)

`INTEGRATION.md` specifies a Flask API (`POST /api/simulate`, `GET /api/health`) at port 5000. The React component currently does all calculations client-side; backend integration would add a "Run Simulation" button calling this API with a `REACT_APP_API_URL` env var.

## Key Conventions

- **Korean UI strings**: Sections of the UI use Korean text (titles, status messages, date indicators like `오늘`, `내일`). This is intentional — do not replace with English.
- **Content calendar CSV format**: `date,format,title_seed,cta` with dates as `YYYY-MM-DD`. The file in `public/` is served statically at runtime; the one in the repo root is the source copy.
- **Baseline CSV format** (for CSV upload in the UI): `power,qps,latency` with a header row; only the first data row is read.
- **`sample_baseline.csv`**: Canonical example for the CSV uploader format.
