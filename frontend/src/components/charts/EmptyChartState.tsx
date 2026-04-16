export default function EmptyChartState() {
  return (
    <div className="flex h-80 flex-col items-center justify-center text-text-muted">
      <div className="mb-3 text-4xl">📊</div>
      <p className="text-lg">Select players and stats to compare</p>
      <p className="text-sm">Add 2–4 players, pick stat categories, then hit Compare</p>
    </div>
  )
}
