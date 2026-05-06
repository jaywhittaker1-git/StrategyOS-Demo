import { mkt } from '../tokens'

const LOGOS = [
  'NORTHWIND',
  'PARALLAX',
  'Lighthouse',
  'cipher.io',
  'Foundry & Co',
  'Meridian Health',
]

export default function Logos() {
  return (
    <div
      style={{
        borderTop: `1px solid ${mkt.color.hairline}`,
        borderBottom: `1px solid ${mkt.color.hairline}`,
        padding: '20px 32px',
        background: mkt.color.white,
      }}
    >
      <div
        style={{
          maxWidth: mkt.layout.siteMax,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: mkt.font.sans,
            fontSize: mkt.type.eyebrow,
            color: mkt.color.textSubtle,
            letterSpacing: mkt.tracking.eyebrow,
            textTransform: 'uppercase',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          Used by teams at
        </span>
        {LOGOS.map((name) => (
          <span
            key={name}
            style={{
              fontFamily: name.includes('.') || name.includes('&') ? mkt.font.sans : mkt.font.mono,
              fontSize: name.length > 10 ? 12 : 13,
              fontWeight: 600,
              color: mkt.color.textSubtle,
              letterSpacing: name === name.toUpperCase() ? '0.08em' : '0.02em',
              userSelect: 'none',
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
