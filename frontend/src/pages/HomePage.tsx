import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'

const actions = [
  {
    to: '/compare',
    title: 'Compare Players',
    description: 'Head-to-head stat comparison with bar, radar, and trend charts.',
  },
  {
    to: '/teams',
    title: 'Explore Teams',
    description: 'Browse all 32 NFL teams, view rosters and team stats.',
  },
  {
    to: '/matchup',
    title: 'Matchup Lens',
    description: 'See how a player performs against a specific opponent.',
  },
]

export default function HomePage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center py-16 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          <span className="text-lime">NFL Data</span>, Visualized
        </h1>
        <p className="mb-12 max-w-lg text-lg text-text-secondary">
          Compare players, explore teams, and analyze matchups with interactive charts.
          Export as PNG to share your analysis.
        </p>
        <div className="grid w-full max-w-3xl gap-4 md:grid-cols-3">
          {actions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="h-full transition-colors hover:border-lime">
                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {action.title}
                </h3>
                <p className="text-sm text-text-secondary">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
