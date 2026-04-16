import type { PlayerSearchResult } from '../../types'

interface PlayerChipProps {
  player: PlayerSearchResult
  color: string
  onRemove: () => void
}

export default function PlayerChip({ player, color, onRemove }: PlayerChipProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
      style={{ borderColor: color, color }}
    >
      {player.headshot_url && (
        <img src={player.headshot_url} alt="" className="h-5 w-5 rounded-full" />
      )}
      <span>{player.name}</span>
      {player.position && (
        <span className="text-xs opacity-60">{player.position}</span>
      )}
      <button
        onClick={onRemove}
        className="ml-1 text-xs opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </span>
  )
}
