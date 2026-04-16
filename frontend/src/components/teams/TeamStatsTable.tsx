import Card from '../ui/Card'

interface Props {
  stats: Record<string, number>
}

const STAT_LABELS: Record<string, string> = {
  wins: 'Wins',
  losses: 'Losses',
  ties: 'Ties',
  points_scored: 'Points Scored',
  points_allowed: 'Points Allowed',
}

export default function TeamStatsTable({ stats }: Props) {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-semibold">Season Stats</h3>
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(stats).map(([key, value]) => (
            <tr key={key} className="border-b border-border last:border-0">
              <td className="py-2 text-text-secondary">{STAT_LABELS[key] ?? key}</td>
              <td className="py-2 text-right font-medium text-text-primary">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
