import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { PlayerSearchResult, CompareResponse, ChartType } from '../types'
import { DEFAULT_SEASON } from '../lib/constants'

interface ComparisonState {
  selectedPlayers: PlayerSearchResult[]
  statCategories: string[]
  chartType: ChartType
  season: number
  data: CompareResponse | null
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'ADD_PLAYER'; player: PlayerSearchResult }
  | { type: 'REMOVE_PLAYER'; playerId: number }
  | { type: 'SET_STAT_CATEGORIES'; categories: string[] }
  | { type: 'SET_CHART_TYPE'; chartType: ChartType }
  | { type: 'SET_SEASON'; season: number }
  | { type: 'SET_LOADING' }
  | { type: 'SET_DATA'; data: CompareResponse }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' }

const initialState: ComparisonState = {
  selectedPlayers: [],
  statCategories: [],
  chartType: 'bar',
  season: DEFAULT_SEASON,
  data: null,
  loading: false,
  error: null,
}

function reducer(state: ComparisonState, action: Action): ComparisonState {
  switch (action.type) {
    case 'ADD_PLAYER':
      if (state.selectedPlayers.length >= 4) return state
      if (state.selectedPlayers.some((p) => p.id === action.player.id)) return state
      return { ...state, selectedPlayers: [...state.selectedPlayers, action.player] }
    case 'REMOVE_PLAYER':
      return {
        ...state,
        selectedPlayers: state.selectedPlayers.filter((p) => p.id !== action.playerId),
      }
    case 'SET_STAT_CATEGORIES':
      return { ...state, statCategories: action.categories }
    case 'SET_CHART_TYPE':
      return { ...state, chartType: action.chartType }
    case 'SET_SEASON':
      return { ...state, season: action.season }
    case 'SET_LOADING':
      return { ...state, loading: true, error: null }
    case 'SET_DATA':
      return { ...state, loading: false, data: action.data }
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const ComparisonContext = createContext<{
  state: ComparisonState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ComparisonContext.Provider value={{ state, dispatch }}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const ctx = useContext(ComparisonContext)
  if (!ctx) throw new Error('useComparison must be used within ComparisonProvider')
  return ctx
}
