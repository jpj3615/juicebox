import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MatchupResponse } from '../../types'
import ExportableChart from '../charts/ExportableChart'

interface Props {
  data: MatchupResponse
}

export default function MatchupChart({ data }: Props) {
  const stats = Object.keys(data.matchup_averages)
  if (stats.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center text-text-muted">
        No matchup data found. The player may not have faced this team.
      </div>
    )
  }

  const chartData = stats.map((stat) => ({
    stat,
    [`vs ${data.opponent_team}`]: Number((data.matchup_averages[stat] ?? 0).toFixed(1)),
    'Season Avg': Number((data.season_averages[stat] ?? 0).toFixed(1)),
  }))

  return (
    <ExportableChart filename={`juicebox-matchup-${data.player_name}-vs-${data.opponent_team}`}>
      <h3 className="mb-4 text-lg font-semibold text-text-primary">
        {data.player_name} vs {data.opponent_team} ({data.season})
      </h3>
      <p className="mb-4 text-sm text-text-secondary">
        {data.matchup_games.length} game{data.matchup_games.length !== 1 ? 's' : ''} played
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="stat" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
          <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              color: '#f5f5f5',
            }}
          />
          <Legend />
          <Bar dataKey={`vs ${data.opponent_team}`} fill="#CCFF00" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Season Avg" fill="#666666" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ExportableChart>
  )
}
