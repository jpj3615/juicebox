import { useCompare } from '../../hooks/useCompare'
import BarComparisonChart from '../charts/BarComparisonChart'
import RadarComparisonChart from '../charts/RadarComparisonChart'
import TrendChart from '../charts/TrendChart'
import ExportableChart from '../charts/ExportableChart'
import EmptyChartState from '../charts/EmptyChartState'
import Spinner from '../ui/Spinner'

export default function ComparisonPanel() {
  const { data, loading, error, chartType } = useCompare()

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-80 items-center justify-center text-red-400">
        {error}
      </div>
    )
  }

  if (!data || data.players.length === 0) {
    return <EmptyChartState />
  }

  const chart = (() => {
    switch (chartType) {
      case 'bar':
        return (
          <BarComparisonChart
            players={data.players}
            statCategories={data.stat_categories}
          />
        )
      case 'radar':
        return (
          <RadarComparisonChart
            players={data.players}
            statCategories={data.stat_categories}
          />
        )
      case 'trend':
        return (
          <TrendChart
            players={data.players}
            statCategories={data.stat_categories}
          />
        )
    }
  })()

  return <ExportableChart filename="juicebox-comparison">{chart}</ExportableChart>
}
