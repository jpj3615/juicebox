import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[]
}

export default function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`rounded-lg border border-border bg-bg-input px-3 py-2 text-sm text-text-primary outline-none focus:border-border-focus ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
