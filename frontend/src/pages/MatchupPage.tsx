import { useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import MatchupBuilder from '../components/matchup/MatchupBuilder'
import MatchupChart from '../components/matchup/MatchupChart'
import { getMatchup } from '../lib/api'
import type { MatchupResponse } from '../types'

export default function MatchupPage() {
  const [data, setData] = useState<MatchupResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (playerId: number, opponentTeamId: number, season: number) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getMatchup(playerId, opponentTeamId, season)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load matchup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">Matchup Analysis</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full shrink-0 lg:w-80">
          <div className="rounded-xl border border-border bg-bg-card p-4">
            <MatchupBuilder onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
        <div className="flex-1">
          {error && (
            <div className="flex h-80 items-center justify-center text-red-400">{error}</div>
          )}
          {data && !loading && <MatchupChart data={data} />}
          {!data && !loading && !error && (
            <div className="flex h-80 flex-col items-center justify-center text-text-muted">
              <div className="mb-3 text-4xl">🏈</div>
              <p className="text-lg">Select a player and opponent team</p>
              <p className="text-sm">See how they perform in head-to-head matchups</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
