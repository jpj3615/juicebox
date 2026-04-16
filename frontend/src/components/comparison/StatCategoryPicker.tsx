import { useState, useEffect } from 'react'
import type { StatCategory } from '../../types'
import { getStatCategories } from '../../lib/api'
import { MAX_RADAR_AXES } from '../../lib/constants'

interface StatCategoryPickerProps {
  selected: string[]
  onChange: (categories: string[]) => void
  chartType: string
}

export default function StatCategoryPicker({ selected, onChange, chartType }: StatCategoryPickerProps) {
  const [categories, setCategories] = useState<StatCategory[]>([])

  useEffect(() => {
    getStatCategories().then(setCategories).catch(() => {})
  }, [])

  const grouped = categories.reduce<Record<string, StatCategory[]>>((acc, cat) => {
    ;(acc[cat.category_group] ??= []).push(cat)
    return acc
  }, {})

  const maxSelectable = chartType === 'radar' ? MAX_RADAR_AXES : Infinity

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name))
    } else if (selected.length < maxSelectable) {
      onChange([...selected, name])
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
        Stat Categories
        {chartType === 'radar' && (
          <span className="ml-1 normal-case">(max {MAX_RADAR_AXES})</span>
        )}
      </label>
      {Object.entries(grouped).map(([group, cats]) => (
        <div key={group}>
          <div className="mb-1 text-xs font-semibold capitalize text-text-secondary">
            {group}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cats.map((cat) => {
              const isSelected = selected.includes(cat.name)
              return (
                <button
                  key={cat.name}
                  onClick={() => toggle(cat.name)}
                  className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                    isSelected
                      ? 'bg-lime text-black'
                      : 'bg-bg-input text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {cat.display_name}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
