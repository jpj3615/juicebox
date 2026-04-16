import { useRef, type ReactNode } from 'react'
import Button from '../ui/Button'
import { exportChartAsPng } from '../../lib/export'

interface Props {
  children: ReactNode
  filename?: string
}

export default function ExportableChart({ children, filename }: Props) {
  const chartRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (chartRef.current) {
      await exportChartAsPng(chartRef.current, filename)
    }
  }

  return (
    <div>
      <div ref={chartRef} className="rounded-xl bg-bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-lime">JUICEBOX</span>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            Export PNG
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
