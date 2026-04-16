import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ComparePlayerData } from '../../types'
import { transformForTrend } from '../../lib/utils'
import { PLAYER_COLORS } from '../../lib/constants'

interface Props {
  players: ComparePlayerData[]
  statCategories: string[]
}

export default function TrendChart({ players, statCategories }: Props) {
  const [selectedStat, setSelectedStat] = useState(statCategories[0] ?? '')
  const data = transformForTrend(players, selectedStat)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-text-muted">Stat:</span>
        <select
          value={selectedStat}
          onChange={(e) => setSelectedStat(e.target.value)}
          className="rounded-lg border border-border bg-bg-input px-3 py-1 text-sm text-text-primary outline-none focus:border-border-focus"
        >
          {statCategories.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="week"
            tick={{ fill: '#a3a3a3', fontSize: 12 }}
            label={{ value: 'Week', position: 'bottom', fill: '#666' }}
          />
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
          {players.map((p, i) => (
            <Line
              key={p.player_id}
              type="monotone"
              dataKey={p.name}
              stroke={PLAYER_COLORS[i]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
