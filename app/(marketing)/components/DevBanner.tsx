import { mkt } from '../tokens'

export default function DevBanner() {
  return (
    <div
      style={{
        background: mkt.color.amberBg,
        borderBottom: `1px solid ${mkt.color.amber}30`,
        padding: '0 32px',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 48,
        zIndex: 40,
      }}
    >
      <p
        style={{
          fontFamily: mkt.font.sans,
          fontSize: 12,
          color: mkt.color.amberText,
          letterSpacing: '0.01em',
          textAlign: 'center',
          margin: 0,
        }}
      >
        <span style={{ fontWeight: 600 }}>Development preview</span>
        {' — '}
        This site and app are under active development. Some screens and functions shown are illustrative examples and may not reflect the current product.
      </p>
    </div>
  )
}
