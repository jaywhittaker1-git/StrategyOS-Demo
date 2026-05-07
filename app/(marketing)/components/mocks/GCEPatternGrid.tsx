'use client'

import { mkt } from '../../tokens'

type PatternCategory = 'structural' | 'health' | 'financial'

interface Pattern {
  id: string
  category: PatternCategory
  name: string
  hint: string
  hot?: boolean
}

const PATTERNS: Pattern[] = [
  { id: 'P1',  category: 'structural', name: 'Resource mirage',          hint: '1 owner · 3+ initiatives · no capacity recorded' },
  { id: 'P2',  category: 'structural', name: 'Timeline trap',             hint: 'Active initiatives against an overdue goal' },
  { id: 'P3',  category: 'structural', name: 'Phantom differentiator',    hint: 'Strategy with no locked assets' },
  { id: 'P4',  category: 'structural', name: 'Ownership vacuum',          hint: 'Initiatives with no assigned owner', hot: true },
  { id: 'P5',  category: 'structural', name: 'Vision drift',              hint: 'All goals marked low priority' },
  { id: 'P6',  category: 'structural', name: 'Reinforcing trap',          hint: 'Multiple initiatives share a single metric' },
  { id: 'P7',  category: 'structural', name: 'Orphaned bet',              hint: 'Initiative not linked to any goal' },
  { id: 'P8',  category: 'structural', name: 'Principle violation',       hint: '1 person spans 2 high-priority goals' },
  { id: 'P9',  category: 'structural', name: 'Silent constraint',         hint: 'Constraint recorded · no initiative addresses it', hot: true },
  { id: 'P10', category: 'structural', name: 'Cascade gap',               hint: 'Goal with no child initiatives' },
  { id: 'P11', category: 'structural', name: 'Dependency shadow',         hint: "Initiative measured by another goal's metric" },
  { id: 'P12', category: 'structural', name: 'Stakeholder blindspot',     hint: 'No stakeholder architecture asset exists' },
  { id: 'P13', category: 'health',     name: 'Missing assumption',        hint: 'Forward-looking goal · no constraints recorded' },
  { id: 'P14', category: 'health',     name: 'Evidence gap',              hint: 'Goal not linked to any analytical asset' },
  { id: 'P15', category: 'health',     name: 'Capability gap',            hint: 'Initiative references a missing capability' },
  { id: 'P16', category: 'financial',  name: 'Capital concentration',     hint: 'Single goal absorbs ≥60% of investment' },
  { id: 'P17', category: 'financial',  name: 'Build vs buy mismatch',     hint: 'Building what the market commoditised' },
  { id: 'P18', category: 'financial',  name: 'Allocation vs ambition',    hint: 'Investment posture contradicts intent' },
]

const CATEGORY_STYLES: Record<PatternCategory, { bg: string; color: string }> = {
  structural: { bg: '#EEF2FF', color: '#4F46E5' },
  health:     { bg: '#DCFCE7', color: '#15803D' },
  financial:  { bg: '#FEF3C7', color: '#B45309' },
}

export function GCEPatternGrid() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: mkt.color.white,
        fontFamily: mkt.font.sans,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          borderBottom: `1px solid ${mkt.color.hairline}`,
          flexWrap: 'wrap',
        }}
      >
        {/* Deterministic badge */}
        <span
          style={{
            fontSize: 10,
            fontFamily: mkt.font.mono,
            background: mkt.color.successBg,
            color: mkt.color.successFg,
            borderRadius: 4,
            padding: '2px 7px',
            fontWeight: 500,
          }}
        >
          deterministic
        </span>

        {/* Title */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: mkt.color.textPrimary,
          }}
        >
          Coherence patterns
        </span>

        {/* Count pill */}
        <span
          style={{
            fontSize: 10.5,
            fontFamily: mkt.font.mono,
            background: mkt.color.amberBg,
            color: mkt.color.amberText,
            borderRadius: 99,
            padding: '2px 8px',
          }}
        >
          18
        </span>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          {(
            [
              { label: 'Structural · 12', category: 'structural' as PatternCategory },
              { label: 'Health · 3', category: 'health' as PatternCategory },
              { label: 'Financial · 3', category: 'financial' as PatternCategory },
            ] as { label: string; category: PatternCategory }[]
          ).map((item) => (
            <div
              key={item.category}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: CATEGORY_STYLES[item.category].bg,
                  border: `1px solid ${CATEGORY_STYLES[item.category].color}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: mkt.color.textMuted,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 1,
          background: mkt.color.hairline,
        }}
      >
        {PATTERNS.map((p) => {
          const catStyle = CATEGORY_STYLES[p.category]
          return (
            <div
              key={p.id}
              style={{
                background: p.hot ? '#FFFBEB' : mkt.color.white,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                minHeight: 92,
                cursor: 'default',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => {
                if (!p.hot) (e.currentTarget as HTMLElement).style.background = '#FAFAF9'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = p.hot
                  ? '#FFFBEB'
                  : mkt.color.white
              }}
            >
              {/* Top row: ID badge + category + hot dot */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span
                  style={{
                    fontSize: 9.5,
                    fontFamily: mkt.font.mono,
                    background: catStyle.bg,
                    color: catStyle.color,
                    borderRadius: 3,
                    padding: '1px 5px',
                    fontWeight: 600,
                  }}
                >
                  {p.id}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: mkt.color.textSubtle,
                  }}
                >
                  {p.category}
                </span>
                {p.hot && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: mkt.color.amber,
                      marginLeft: 'auto',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>

              {/* Name */}
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: mkt.color.textPrimary,
                  lineHeight: 1.25,
                }}
              >
                {p.name}
              </div>

              {/* Hint */}
              <div
                style={{
                  fontSize: 10.5,
                  fontFamily: mkt.font.mono,
                  color: mkt.color.textSubtle,
                  lineHeight: 1.4,
                }}
              >
                {p.hint}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: mkt.color.soft,
          borderTop: `1px solid ${mkt.color.hairline}`,
        }}
      >
        {[
          { value: '2', label: 'firing on this strategy' },
          { value: '0.91', label: 'coherence score' },
          { value: '0', label: 'LLM calls to detect' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: '12px 16px',
              borderRight: i < 2 ? `1px solid ${mkt.color.hairline}` : 'none',
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: mkt.color.textPrimary,
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: mkt.color.textMuted,
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
