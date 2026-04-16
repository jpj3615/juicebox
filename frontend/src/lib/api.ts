import type {
  PlayerSearchResult,
  PlayerStatsResponse,
  CompareRequest,
  CompareResponse,
  Team,
  TeamStatsResponse,
  Season,
  StatCategory,
  MatchupResponse,
} from '../types'

const BASE = '/api'

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export function searchPlayers(query: string): Promise<PlayerSearchResult[]> {
  return fetchJSON(`${BASE}/players/search?q=${encodeURIComponent(query)}`)
}

export function getPlayerStats(playerId: number, season: number): Promise<PlayerStatsResponse> {
  return fetchJSON(`${BASE}/players/${playerId}/stats?season=${season}`)
}

export function comparePlayers(req: CompareRequest): Promise<CompareResponse> {
  return fetchJSON(`${BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export function getTeams(): Promise<Team[]> {
  return fetchJSON(`${BASE}/teams`)
}

export function getTeamStats(teamId: number, season: number): Promise<TeamStatsResponse> {
  return fetchJSON(`${BASE}/teams/${teamId}/stats?season=${season}`)
}

export function getSeasons(): Promise<Season[]> {
  return fetchJSON(`${BASE}/seasons`)
}

export function getStatCategories(): Promise<StatCategory[]> {
  return fetchJSON(`${BASE}/stats/categories`)
}

export function getMatchup(
  playerId: number,
  opponentTeamId: number,
  season: number,
): Promise<MatchupResponse> {
  return fetchJSON(
    `${BASE}/matchup?player_id=${playerId}&opponent_team_id=${opponentTeamId}&season=${season}`,
  )
}
