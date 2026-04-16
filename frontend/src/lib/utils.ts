import type { ComparePlayerData } from '../types'

export function transformForBar(
  players: ComparePlayerData[],
  statCategories: string[],
) {
  return statCategories.map((stat) => {
    const row: Record<string, string | number> = { stat }
    players.forEach((p) => {
      row[p.name] = p.stats[stat] ?? 0
    })
    return row
  })
}

export function normalizeForRadar(
  players: ComparePlayerData[],
  statCategories: string[],
) {
  return statCategories.map((stat) => {
    const values = players.map((p) => p.stats[stat] ?? 0)
    const max = Math.max(...values, 1)
    const row: Record<string, string | number> = { stat }
    players.forEach((p) => {
      row[p.name] = Math.round(((p.stats[stat] ?? 0) / max) * 100)
    })
    return row
  })
}

export function transformForTrend(
  players: ComparePlayerData[],
  stat: string,
) {
  const allWeeks = new Set<number>()
  players.forEach((p) => p.weekly.forEach((w) => allWeeks.add(w.week)))

  return Array.from(allWeeks)
    .sort((a, b) => a - b)
    .map((week) => {
      const row: Record<string, number> = { week }
      players.forEach((p) => {
        const weekData = p.weekly.find((w) => w.week === week)
        row[p.name] = weekData?.[stat] ?? 0
      })
      return row
    })
}
