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
import type { ComparePlayerData } from '../../types'
import { transformForBar } from '../../lib/utils'
import { PLAYER_COLORS } from '../../lib/constants'

interface Props {
  players: ComparePlayerData[]
  statCategories: string[]
}

export default function BarComparisonChart({ players, statCategories }: Props) {
  const data = transformForBar(players, statCategories)

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        {players.map((p, i) => (
          <Bar
            key={p.player_id}
            dataKey={p.name}
            fill={PLAYER_COLORS[i]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
