import type { ChartType } from '../../types'

interface ChartTypePickerProps {
  value: ChartType
  onChange: (type: ChartType) => void
}

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'radar', label: 'Radar' },
  { value: 'trend', label: 'Trend' },
]

export default function ChartTypePicker({ value, onChange }: ChartTypePickerProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
        Chart Type
      </label>
      <div className="flex rounded-lg border border-border">
        {chartTypes.map((ct) => (
          <button
            key={ct.value}
            onClick={() => onChange(ct.value)}
            className={`flex-1 px-3 py-1.5 text-sm transition-colors first:rounded-l-lg last:rounded-r-lg ${
              value === ct.value
                ? 'bg-lime text-black font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {ct.label}
          </button>
        ))}
      </div>
    </div>
  )
}
