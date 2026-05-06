'use client'

interface DotGridProps {
  opacity?: number
  className?: string
  fadeDirection?: 'bottom' | 'right' | 'both'
}

export function DotGrid({ opacity = 0.05, className = '', fadeDirection = 'bottom' }: DotGridProps) {
  const maskGradient =
    fadeDirection === 'bottom'
      ? 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
      : fadeDirection === 'right'
      ? 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
      : 'radial-gradient(ellipse at 50% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="0.85" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    </div>
  )
}
