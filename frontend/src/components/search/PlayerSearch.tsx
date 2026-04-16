import { useState, useRef, useEffect } from 'react'
import type { PlayerSearchResult } from '../../types'
import { usePlayerSearch } from '../../hooks/usePlayerSearch'
import Badge from '../ui/Badge'

interface PlayerSearchProps {
  onSelect: (player: PlayerSearchResult) => void
  disabled?: boolean
}

export default function PlayerSearch({ onSelect, disabled }: PlayerSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, loading } = usePlayerSearch(query)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        placeholder="Search players..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        disabled={disabled}
        className="w-full rounded-lg border border-border bg-bg-input px-4 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-border-focus disabled:opacity-50"
      />
      {open && query.length >= 2 && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-bg-card shadow-lg">
          {loading ? (
            <div className="px-4 py-3 text-sm text-text-muted">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-text-muted">No results found</div>
          ) : (
            results.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  onSelect(player)
                  setQuery('')
                  setOpen(false)
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-bg-card-hover"
              >
                {player.headshot_url && (
                  <img
                    src={player.headshot_url}
                    alt=""
                    className="h-8 w-8 rounded-full bg-bg-input"
                  />
                )}
                <div className="flex-1">
                  <span className="text-text-primary">{player.name}</span>
                  {player.team_abbreviation && (
                    <span className="ml-2 text-text-muted">{player.team_abbreviation}</span>
                  )}
                </div>
                {player.position && (
                  <Badge className="bg-bg-input text-text-secondary">{player.position}</Badge>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
