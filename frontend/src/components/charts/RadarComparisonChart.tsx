import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ComparePlayerData } from '../../types'
import { normalizeForRadar } from '../../lib/utils'
import { PLAYER_COLORS } from '../../lib/constants'

interface Props {
  players: ComparePlayerData[]
  statCategories: string[]
}

export default function RadarComparisonChart({ players, statCategories }: Props) {
  const data = normalizeForRadar(players, statCategories)

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#2a2a2a" />
        <PolarAngleAxis dataKey="stat" tick={{ fill: '#a3a3a3', fontSize: 11 }} />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: '#666', fontSize: 10 }}
        />
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
          <Radar
            key={p.player_id}
            name={p.name}
            dataKey={p.name}
            stroke={PLAYER_COLORS[i]}
            fill={PLAYER_COLORS[i]}
            fillOpacity={0.15 + i * 0.05}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}
