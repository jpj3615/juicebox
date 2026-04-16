import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import TeamStatsTable from '../components/teams/TeamStatsTable'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import Select from '../components/ui/Select'
import { getTeamStats } from '../lib/api'
import type { TeamStatsResponse } from '../types'
import { DEFAULT_SEASON } from '../lib/constants'

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [season, setSeason] = useState(DEFAULT_SEASON)
  const [data, setData] = useState<TeamStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getTeamStats(Number(id), season)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [id, season])

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </PageContainer>
    )
  }

  if (!data) {
    return (
      <PageContainer>
        <p className="text-text-muted">Team not found.</p>
      </PageContainer>
    )
  }

  const { team, roster } = data

  return (
    <PageContainer>
      <div className="mb-6 flex items-center gap-4">
        {team.logo_url && (
          <img src={team.logo_url} alt={team.name} className="h-16 w-16" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-text-secondary">
            {team.conference} &middot; {team.division}
          </p>
        </div>
        <div className="ml-auto">
          <Select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            options={[
              { value: 2024, label: '2024' },
              { value: 2023, label: '2023' },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TeamStatsTable stats={data.stats} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <h3 className="mb-3 text-lg font-semibold">Roster</h3>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-text-muted">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Player</th>
                    <th className="pb-2">Pos</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="py-1.5 text-text-muted">{p.jersey_number ?? '—'}</td>
                      <td className="py-1.5">
                        <Link
                          to={`/compare`}
                          className="text-text-primary hover:text-lime"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-1.5">
                        {p.position && (
                          <Badge className="bg-bg-input text-text-secondary">
                            {p.position}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
