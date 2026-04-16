import PageContainer from '../components/layout/PageContainer'
import TeamCard from '../components/teams/TeamCard'
import TeamRankings from '../components/teams/TeamRankings'
import Spinner from '../components/ui/Spinner'
import { useTeams } from '../hooks/useTeams'

export default function TeamsPage() {
  const { teams, loading } = useTeams()

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </PageContainer>
    )
  }

  const grouped = teams.reduce<Record<string, typeof teams>>((acc, team) => {
    const key = `${team.conference} - ${team.division}`
    ;(acc[key] ??= []).push(team)
    return acc
  }, {})

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold">Teams</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          {Object.entries(grouped).map(([division, divTeams]) => (
            <div key={division}>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-muted">
                {division}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {divTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full shrink-0 lg:w-96">
          <TeamRankings teams={teams} />
        </div>
      </div>
    </PageContainer>
  )
}
