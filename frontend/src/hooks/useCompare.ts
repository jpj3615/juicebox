import { useComparison } from '../context/ComparisonContext'
import { comparePlayers } from '../lib/api'

export function useCompare() {
  const { state, dispatch } = useComparison()

  const runComparison = async () => {
    if (state.selectedPlayers.length < 2 || state.statCategories.length === 0) return

    dispatch({ type: 'SET_LOADING' })
    try {
      const data = await comparePlayers({
        player_ids: state.selectedPlayers.map((p) => p.id),
        stat_categories: state.statCategories,
        season: state.season,
      })
      dispatch({ type: 'SET_DATA', data })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: e instanceof Error ? e.message : 'Comparison failed' })
    }
  }

  return { ...state, dispatch, runComparison }
}
