# 준비운동 시스템 — 엔터테이너 에이전트 킷

## Overview
This repository contains a ray-tracing simulation system with an interactive React frontend for energy panel controls and coupling parameter adjustments.

## Components

### Backend (Python)
- **run.py**: Ray tracing simulation runner with configurable parameters
- **tests.py**: Verification tests for the simulation engine
- **plot.py**: Visualization tools for simulation results
- **engine/**: Core ray tracing engine modules

### Frontend (React)
- **CountrysideBlackholeProduction.jsx**: Interactive simulation component with:
  - Energy panel with coupling parameters (α, β, γ, λ)
  - Real-time energy metrics display
  - CSV uploader for baseline calibration
  - Entropy-based efficiency calculations
- See [COMPONENT_README.md](COMPONENT_README.md) for detailed documentation
- See [INTEGRATION.md](INTEGRATION.md) for backend integration guide

### Entertainment Kit
- RUNBOOK.md: 촬영부터 배포까지 전 과정
- mirror_card_template.json: ΔI 로그/해시 스텁 포함
- content_calendar.csv: 4주 플랜(평일)
- scripts/: 예시 대본 및 팟캐스트 인/아웃트로
- auto_chapters.py: 간단 챕터 생성기
- audio_chain_preset.txt: 음향 가이드
- obs_scenes.json: OBS 장면 개요
- youtube_description_template.md: 설명 템플릿
- title_formulas.txt, cue_cards.txt, thumbnail_shorts_prompts.txt

## Quick Start

### Python Simulation
```bash
# Run simulation
python run.py --rays 200 --bounces 120 --out outputs/exp.csv

# Run tests
python tests.py

# Generate plots
python plot.py outputs/exp.csv
```

### React Frontend
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### 사용법 (15분 퍼블리시)
1) content_calendar.csv 오늘 행 선택 → title_seed로 주제 확정
2) scripts/example_youtube_script.md 열고 HPRC만 수정
3) 녹화 후 바로 업로드, 설명 템플릿 붙여넣기
4) RUNBOOK의 로그 절차로 ΔI 기록

## Features

### Energy Panel (현실 연결 α-Coupling)
- **Coupling Parameters**: Interactive sliders for α, β, γ, λ
- **Energy Metrics**: Real-time calculations of:
  - ΔI (Modified Information Delta)
  - Efficiency (η) using Shannon entropy
  - Virtual Energy (Evirt)
  - Real Energy (Ereal)
  - Throughput Gain (G)
  - Latency Reduction (Lred)
- **CSV Upload**: Offline calibration with baseline data (power, QPS, latency)

### Sample CSV Format
```csv
power,qps,latency
100,1000,50
```

See `sample_baseline.csv` for an example.

## Documentation
- [COMPONENT_README.md](COMPONENT_README.md) - Detailed component documentation
- [INTEGRATION.md](INTEGRATION.md) - Backend integration guide
- [RUNBOOK.md](RUNBOOK.md) - Entertainment kit workflow

## Future Enhancements
- ΔI–Entropy scatter plots and histograms
- Real-time backend integration via WebSocket
- Parameter presets and export functionality
- Advanced visualization options
