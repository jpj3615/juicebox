import { useState } from 'react'
import PlayerSearch from '../search/PlayerSearch'
import PlayerChip from '../search/PlayerChip'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { useTeams } from '../../hooks/useTeams'
import type { PlayerSearchResult } from '../../types'
import { PLAYER_COLORS, DEFAULT_SEASON } from '../../lib/constants'

interface Props {
  onSubmit: (playerId: number, opponentTeamId: number, season: number) => void
  loading: boolean
}

export default function MatchupBuilder({ onSubmit, loading }: Props) {
  const [player, setPlayer] = useState<PlayerSearchResult | null>(null)
  const [opponentTeamId, setOpponentTeamId] = useState<number | null>(null)
  const [season, setSeason] = useState(DEFAULT_SEASON)
  const { teams } = useTeams()

  const canSubmit = player && opponentTeamId && !loading

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Player
        </label>
        {player ? (
          <div className="flex flex-wrap gap-2">
            <PlayerChip
              player={player}
              color={PLAYER_COLORS[0]}
              onRemove={() => setPlayer(null)}
            />
          </div>
        ) : (
          <PlayerSearch onSelect={setPlayer} />
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Opponent Team
        </label>
        <Select
          value={opponentTeamId ?? ''}
          onChange={(e) => setOpponentTeamId(Number(e.target.value))}
          options={[
            { value: '', label: 'Select a team...' },
            ...teams.map((t) => ({ value: t.id, label: `${t.abbreviation} — ${t.name}` })),
          ]}
          className="w-full"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Season
        </label>
        <Select
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          options={[
            { value: 2024, label: '2024' },
            { value: 2023, label: '2023' },
          ]}
          className="w-full"
        />
      </div>

      <Button
        onClick={() => canSubmit && onSubmit(player!.id, opponentTeamId!, season)}
        disabled={!canSubmit}
        className="w-full"
        size="lg"
      >
        {loading ? 'Loading...' : 'Analyze Matchup'}
      </Button>
    </div>
  )
}
