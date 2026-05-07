'use client'

import { mkt } from '../../tokens'

interface CalloutBlockProps {
  variant: 'light' | 'dark'
  children: React.ReactNode
  className?: string
}

export function CalloutBlock({ variant, children, className = '' }: CalloutBlockProps) {
  const styles =
    variant === 'light'
      ? {
          border: `1px solid ${mkt.color.borderLight}`,
          background: '#F8FAFC',
        }
      : {
          border: `1px solid ${mkt.color.borderDark}`,
          background: mkt.color.darkCallout,
        }

  return (
    <div
      className={`p-5 ${className}`}
      style={{ ...styles, borderRadius: 0 }}
    >
      {children}
    </div>
  )
}
