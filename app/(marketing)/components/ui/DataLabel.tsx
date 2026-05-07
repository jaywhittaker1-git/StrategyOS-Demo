'use client'

import { mkt } from '../../tokens'

interface DataLabelProps {
  children: React.ReactNode
  className?: string
  onDark?: boolean
}

export function DataLabel({ children, className = '', onDark = false }: DataLabelProps) {
  return (
    <span
      className={`font-mono ${className}`}
      style={{
        fontSize: mkt.type.mono,
        color: onDark ? mkt.color.textMono : mkt.color.textMono,
      }}
    >
      {children}
    </span>
  )
}
