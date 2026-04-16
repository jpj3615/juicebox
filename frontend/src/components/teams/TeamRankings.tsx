import { useState, useEffect } from 'react'
import type { Team } from '../../types'
import { getTeamStats } from '../../lib/api'
import Card from '../ui/Card'
import Spinner from '../ui/Spinner'
import { DEFAULT_SEASON } from '../../lib/constants'

interface TeamRank {
  team: Team
  value: number
}

interface Props {
  teams: Team[]
}

const RANKABLE_STATS = [
  { value: 'wins', label: 'Wins' },
  { value: 'points_scored', label: 'Points Scored' },
  { value: 'points_allowed', label: 'Points Allowed' },
]

export default function TeamRankings({ teams }: Props) {
  const [stat, setStat] = useState('wins')
  const [rankings, setRankings] = useState<TeamRank[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all(teams.map((t) => getTeamStats(t.id, DEFAULT_SEASON)))
      .then((results) => {
        const ranked = results
          .map((r) => ({ team: r.team, value: r.stats[stat] ?? 0 }))
          .sort((a, b) => (stat === 'points_allowed' ? a.value - b.value : b.value - a.value))
        setRankings(ranked)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [teams, stat])

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Rankings</h3>
        <select
          value={stat}
          onChange={(e) => setStat(e.target.value)}
          className="rounded-lg border border-border bg-bg-input px-3 py-1 text-sm text-text-primary outline-none focus:border-border-focus"
        >
          {RANKABLE_STATS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-1">
          {rankings.map((r, i) => {
            const maxVal = rankings[0]?.value || 1
            const pct = (r.value / maxVal) * 100
            return (
              <div key={r.team.id} className="flex items-center gap-2 text-sm">
                <span className="w-6 text-right text-text-muted">{i + 1}</span>
                {r.team.logo_url && (
                  <img src={r.team.logo_url} alt="" className="h-5 w-5" />
                )}
                <span className="w-10 text-text-secondary">{r.team.abbreviation}</span>
                <div className="flex-1">
                  <div
                    className="h-4 rounded-sm bg-lime"
                    style={{ width: `${pct}%`, opacity: 0.4 + (1 - i / rankings.length) * 0.6 }}
                  />
                </div>
                <span className="w-12 text-right font-medium text-text-primary">{r.value}</span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
