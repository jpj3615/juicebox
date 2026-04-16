export interface PlayerSearchResult {
  id: number
  name: string
  display_name: string | null
  position: string | null
  team_abbreviation: string | null
  headshot_url: string | null
}

export interface PlayerStatsResponse {
  player: PlayerSearchResult
  season: number
  season_totals: Record<string, number>
  weekly: WeeklyStats[]
}

export interface WeeklyStats {
  week: number
  [stat: string]: number
}

export interface Team {
  id: number
  name: string
  abbreviation: string
  conference: string | null
  division: string | null
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
}

export interface TeamStatsResponse {
  team: Team
  season: number
  stats: Record<string, number>
  roster: RosterPlayer[]
}

export interface RosterPlayer {
  id: number
  name: string
  display_name: string | null
  position: string | null
  jersey_number: number | null
  headshot_url: string | null
}

export interface CompareRequest {
  player_ids: number[]
  stat_categories: string[]
  season: number
}

export interface ComparePlayerData {
  player_id: number
  name: string
  display_name: string | null
  position: string | null
  team_abbreviation: string | null
  headshot_url: string | null
  stats: Record<string, number>
  weekly: WeeklyStats[]
}

export interface CompareResponse {
  season: number
  stat_categories: string[]
  players: ComparePlayerData[]
}

export interface StatCategory {
  name: string
  display_name: string
  category_group: string
}

export interface Season {
  id: number
  year: number
  season_type: string
}

export interface MatchupResponse {
  player_name: string
  player_id: number
  opponent_team: string
  season: number
  matchup_games: WeeklyStats[]
  matchup_averages: Record<string, number>
  season_averages: Record<string, number>
}

export type ChartType = 'bar' | 'radar' | 'trend'
