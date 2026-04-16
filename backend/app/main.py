from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import players, teams, compare, seasons, stats, matchup

app = FastAPI(title="Juicebox API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players.router, prefix="/api")
app.include_router(teams.router, prefix="/api")
app.include_router(compare.router, prefix="/api")
app.include_router(seasons.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(matchup.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
