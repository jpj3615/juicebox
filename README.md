# JUICEBOX

NFL data visualization app. Compare players, explore teams, analyze matchups, and export charts.

## Quick Start

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.data_ingestion.ingest   # one-time data load
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:8000/docs`.
