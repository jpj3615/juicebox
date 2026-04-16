import { Link } from 'react-router-dom'
import type { Team } from '../../types'
import Card from '../ui/Card'

interface Props {
  team: Team
}

export default function TeamCard({ team }: Props) {
  return (
    <Link to={`/teams/${team.id}`}>
      <Card className="flex items-center gap-3 transition-colors hover:border-lime">
        {team.logo_url && (
          <img src={team.logo_url} alt={team.name} className="h-10 w-10" />
        )}
        <div>
          <div className="font-semibold text-text-primary">{team.abbreviation}</div>
          <div className="text-xs text-text-secondary">{team.name}</div>
        </div>
      </Card>
    </Link>
  )
}
