import { useCompare } from '../../hooks/useCompare'
import PlayerSearch from '../search/PlayerSearch'
import PlayerChip from '../search/PlayerChip'
import StatCategoryPicker from './StatCategoryPicker'
import ChartTypePicker from './ChartTypePicker'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { PLAYER_COLORS, MAX_COMPARE_PLAYERS } from '../../lib/constants'

export default function ComparisonBuilder() {
  const { selectedPlayers, statCategories, chartType, season, dispatch, runComparison } =
    useCompare()

  const canCompare = selectedPlayers.length >= 2 && statCategories.length > 0

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Players ({selectedPlayers.length}/{MAX_COMPARE_PLAYERS})
        </label>
        <PlayerSearch
          onSelect={(player) => dispatch({ type: 'ADD_PLAYER', player })}
          disabled={selectedPlayers.length >= MAX_COMPARE_PLAYERS}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedPlayers.map((player, i) => (
            <PlayerChip
              key={player.id}
              player={player}
              color={PLAYER_COLORS[i]}
              onRemove={() => dispatch({ type: 'REMOVE_PLAYER', playerId: player.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Season
        </label>
        <Select
          value={season}
          onChange={(e) =>
            dispatch({ type: 'SET_SEASON', season: Number(e.target.value) })
          }
          options={[
            { value: 2024, label: '2024' },
            { value: 2023, label: '2023' },
          ]}
          className="w-full"
        />
      </div>

      <ChartTypePicker
        value={chartType}
        onChange={(type) => dispatch({ type: 'SET_CHART_TYPE', chartType: type })}
      />

      <StatCategoryPicker
        selected={statCategories}
        onChange={(cats) => dispatch({ type: 'SET_STAT_CATEGORIES', categories: cats })}
        chartType={chartType}
      />

      <Button onClick={runComparison} disabled={!canCompare} className="w-full" size="lg">
        Compare
      </Button>
    </div>
  )
}
