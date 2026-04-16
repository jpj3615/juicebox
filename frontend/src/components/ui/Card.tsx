import type { HTMLAttributes } from 'react'

export default function Card({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg-card p-4 ${className}`}
      {...props}
    />
  )
}
