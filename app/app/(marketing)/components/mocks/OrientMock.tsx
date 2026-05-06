'use client'

import { mkt } from '../../tokens'

export function OrientMock() {
  const dotGridBg =
    'radial-gradient(circle, #E8E8E8 1px, transparent 1px)'

  const phases = [
    { label: 'Orient', done: true },
    { label: 'Gather', done: true },
    { label: 'Confirm', active: true },
    { label: 'Lock', pending: true },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: mkt.color.white,
        fontFamily: mkt.font.sans,
      }}
    >
      {/* Stage */}
      <div
        className="orient-stage"
        style={{
          position: 'relative',
          height: 380,
          background: mkt.color.soft,
          backgroundImage: dotGridBg,
          backgroundSize: '18px 18px',
          overflow: 'hidden',
        }}
      >
        {/* SVG arcs */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 880 360"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="orient-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={mkt.color.accent} stopOpacity="0.12" />
              <stop offset="100%" stopColor={mkt.color.accent} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="orient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mkt.color.accent} stopOpacity="0" />
              <stop offset="60%" stopColor={mkt.color.accent} stopOpacity="0.6" />
              <stop offset="100%" stopColor={mkt.color.accent} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Glow behind premise */}
          <circle cx="660" cy="180" r="160" fill="url(#orient-glow)" />

          {/* Concentric rings */}
          <circle
            cx="660"
            cy="180"
            r="92"
            fill="none"
            stroke={mkt.color.accent}
            strokeWidth="1"
            strokeOpacity="0.18"
          />
          <circle
            cx="660"
            cy="180"
            r="68"
            fill="none"
            stroke={mkt.color.accent}
            strokeWidth="1"
            strokeOpacity="0.30"
          />

          {/* Arc 1 — top evidence → premise */}
          <path
            d="M 130,72 C 320,72 450,140 660,180"
            fill="none"
            stroke="url(#orient-line)"
            strokeWidth="1.5"
          />
          {/* Arc 2 — middle evidence → premise */}
          <path
            d="M 110,180 C 320,180 460,180 660,180"
            fill="none"
            stroke="url(#orient-line)"
            strokeWidth="1.5"
          />
          {/* Arc 3 — bottom evidence → premise */}
          <path
            d="M 130,288 C 320,288 450,220 660,180"
            fill="none"
            stroke="url(#orient-line)"
            strokeWidth="1.5"
          />
          {/* Arc 4 — dashed partial evidence */}
          <path
            d="M 240,40 C 380,40 500,120 660,180"
            fill="none"
            stroke={mkt.color.accent}
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />
        </svg>

        {/* Phase markers */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 18,
            alignItems: 'center',
          }}
        >
          {phases.map((p) => (
            <div
              key={p.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  background: p.done
                    ? mkt.color.accent
                    : p.active
                    ? mkt.color.accentLight
                    : mkt.color.hairline,
                  color: p.done
                    ? mkt.color.white
                    : p.active
                    ? mkt.color.accentText
                    : mkt.color.textMuted,
                  border: p.active ? `1.5px solid ${mkt.color.accentActive}` : 'none',
                }}
              >
                {p.done ? '✓' : p.pending ? '⌛' : '3'}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: p.active ? mkt.color.accentText : mkt.color.textMuted,
                  fontWeight: p.active ? 600 : 400,
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* Evidence chip 1 — Signal */}
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 60,
            display: 'flex',
            gap: 9,
            alignItems: 'flex-start',
            background: mkt.color.white,
            border: `1px solid ${mkt.color.borderCard}`,
            borderRadius: 8,
            padding: '8px 10px',
            boxShadow: mkt.shadow.node,
          }}
        >
          <span style={{ fontSize: 13, color: mkt.color.accent, marginTop: 1 }}>≈</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary }}>
              Pricing caps · 3 mid-mkt
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontFamily: mkt.font.mono,
                color: mkt.color.textSubtle,
              }}
            >
              Salesforce · 30d
            </span>
          </div>
        </div>

        {/* Evidence chip 2 — Financial */}
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 168,
            display: 'flex',
            gap: 9,
            alignItems: 'flex-start',
            background: mkt.color.white,
            border: `1px solid ${mkt.color.borderCard}`,
            borderRadius: 8,
            padding: '8px 10px',
            boxShadow: mkt.shadow.node,
          }}
        >
          <span style={{ fontSize: 13, color: mkt.color.accent, marginTop: 1 }}>$</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary }}>
              Sales productivity ↑ 12%
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontFamily: mkt.font.mono,
                color: mkt.color.textSubtle,
              }}
            >
              Finance · v4
            </span>
          </div>
        </div>

        {/* Evidence chip 3 — Competitive */}
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 276,
            display: 'flex',
            gap: 9,
            alignItems: 'flex-start',
            background: mkt.color.white,
            border: `1px solid ${mkt.color.borderCard}`,
            borderRadius: 8,
            padding: '8px 10px',
            boxShadow: mkt.shadow.node,
          }}
        >
          <span style={{ fontSize: 13, color: mkt.color.accent, marginTop: 1 }}>⊕</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary }}>
              2 competitors moved usage
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontFamily: mkt.font.mono,
                color: mkt.color.textSubtle,
              }}
            >
              Brief · this week
            </span>
          </div>
        </div>

        {/* Evidence chip 4 — Stakeholder (dashed, with conflicts badge) */}
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 26,
            display: 'flex',
            gap: 9,
            alignItems: 'flex-start',
            background: mkt.color.white,
            border: `1px solid ${mkt.color.borderCard}`,
            borderRadius: 8,
            padding: '8px 10px',
            boxShadow: mkt.shadow.node,
            opacity: 0.7,
          }}
        >
          <span style={{ fontSize: 13, color: mkt.color.textMuted, marginTop: 1 }}>◐</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary }}>
              We&apos;re capacity constrained
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: mkt.font.mono,
                  color: mkt.color.textSubtle,
                }}
              >
                Sales VP · 9d
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: mkt.font.mono,
                  background: mkt.color.amberBg,
                  color: mkt.color.amberText,
                  borderRadius: 4,
                  padding: '1px 5px',
                }}
              >
                conflicts
              </span>
            </div>
          </div>
        </div>

        {/* Premise card */}
        <div
          style={{
            position: 'absolute',
            right: 28,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 280,
            background: mkt.color.white,
            border: `1.5px solid ${mkt.color.accentActive}`,
            borderRadius: 14,
            padding: 18,
            boxShadow: '0 12px 28px -12px rgba(37,99,235,0.18)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: mkt.font.mono,
              color: mkt.color.accentText,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 10,
            }}
          >
            PREMISE · FORMING
          </div>
          <p
            style={{
              fontFamily: mkt.font.serif,
              fontSize: 22,
              fontStyle: 'italic',
              color: mkt.color.textPrimary,
              lineHeight: 1.3,
              margin: '0 0 14px 0',
            }}
          >
            Mid-market wins are blocked by pricing, not by sales capacity.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: mkt.font.mono,
                background: mkt.color.successBg,
                color: mkt.color.successFg,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              3 support
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: mkt.font.mono,
                background: mkt.color.amberBg,
                color: mkt.color.amberText,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              1 conflicts
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: mkt.font.mono,
                background: mkt.color.soft,
                color: mkt.color.textSubtle,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              confidence 0.82
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '14px 18px',
          borderTop: `1px solid ${mkt.color.hairline}`,
        }}
      >
        <button
          style={{
            fontSize: 13,
            fontFamily: mkt.font.sans,
            color: mkt.color.textSecondary,
            background: mkt.color.white,
            border: `1px solid ${mkt.color.borderCard}`,
            borderRadius: 7,
            padding: '7px 14px',
            cursor: 'pointer',
          }}
        >
          Disagree with the read
        </button>
        <button
          style={{
            fontSize: 13,
            fontFamily: mkt.font.sans,
            color: mkt.color.white,
            background: mkt.color.accent,
            border: 'none',
            borderRadius: 7,
            padding: '7px 14px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Lock as premise
        </button>
      </div>
    </div>
  )
}
