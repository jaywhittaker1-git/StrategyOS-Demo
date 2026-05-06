'use client'

import { mkt } from '../../tokens'

interface EyebrowProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export function Eyebrow({ children, className = '', color }: EyebrowProps) {
  return (
    <span
      className={`block font-medium uppercase ${className}`}
      style={{
        fontSize: mkt.type.eyebrow,
        letterSpacing: mkt.tracking.eyebrow,
        color: color ?? mkt.color.accent,
      }}
    >
      {children}
    </span>
  )
}
