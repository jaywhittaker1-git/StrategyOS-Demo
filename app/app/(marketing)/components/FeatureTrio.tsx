'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'

// ─── Mini mocks ───────────────────────────────────────────────────────────────

function CoherenceMini() {
  const rows = [
    { barColor: '#EF4444', glyph1: '≈', g1Bg: '#FFF7ED', g1Fg: '#EA580C', glyph2: '◎', g2Bg: '#F0FDF4', g2Fg: '#16A34A', title: 'Churn signal vs NRR forecast', age: '4h' },
    { barColor: '#F59E0B', glyph1: '◆', g1Bg: '#EFF6FF', g1Fg: '#2563EB', glyph2: '△', g2Bg: '#F7FEE7', g2Fg: '#65A30D', title: 'Decision lacks pilot evidence', age: '1d' },
    { barColor: '#94A3B8', glyph1: '○', g1Bg: '#FDF2F8', g1Fg: '#BE185D', glyph2: '◇', g2Bg: '#FAF5FF', g2Fg: '#9333EA', title: 'Bet implies missing capability', age: '5d' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: mkt.font.sans,
        border: `1px solid ${mkt.color.hairline}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: mkt.color.white,
            borderBottom: i < rows.length - 1 ? `1px solid ${mkt.color.hairline}` : undefined,
          }}
        >
          {/* Severity bar */}
          <span
            style={{
              width: 3,
              alignSelf: 'stretch',
              background: r.barColor,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          {/* Glyphs + arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{
              width: 20, height: 20, borderRadius: 4,
              background: r.g1Bg, color: r.g1Fg,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontFamily: 'monospace',
            }}>{r.glyph1}</span>
            <span style={{ fontSize: 10, color: mkt.color.textSubtle }}>→</span>
            <span style={{
              width: 20, height: 20, borderRadius: 4,
              background: r.g2Bg, color: r.g2Fg,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontFamily: 'monospace',
            }}>{r.glyph2}</span>
          </div>
          {/* Title */}
          <span
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 500,
              color: mkt.color.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {r.title}
          </span>
          {/* Age */}
          <span style={{ fontSize: 11, color: mkt.color.textSubtle, flexShrink: 0 }}>
            {r.age}
          </span>
        </div>
      ))}
    </div>
  )
}

function ConversationMini() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        fontFamily: mkt.font.sans,
      }}
    >
      {/* User bubble */}
      <div
        style={{
          background: '#F1F5F9',
          borderRadius: '10px 10px 2px 10px',
          padding: '10px 14px',
          fontSize: 12.5,
          color: mkt.color.textPrimary,
          lineHeight: 1.45,
          alignSelf: 'flex-end',
          maxWidth: '85%',
        }}
      >
        Summarise what changed in the FY26 plan this week.
      </div>

      {/* AI reply */}
      <div
        style={{
          background: mkt.color.white,
          border: `1px solid ${mkt.color.hairline}`,
          borderRadius: '2px 10px 10px 10px',
          padding: '10px 14px',
          fontSize: 12.5,
          color: mkt.color.textPrimary,
          lineHeight: 1.6,
        }}
      >
        Three material moves. The{' '}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#FDF2F8', borderRadius: 4,
          padding: '1px 6px 1px 4px', verticalAlign: 'middle',
        }}>
          <span style={{ fontSize: 11, color: '#BE185D', fontFamily: 'monospace' }}>○</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: mkt.color.textPrimary }}>Vertical agents</span>
        </span>
        {' '}bet was upgraded to high-confidence; a new{' '}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#FFF7ED', borderRadius: 4,
          padding: '1px 6px 1px 4px', verticalAlign: 'middle',
        }}>
          <span style={{ fontSize: 11, color: '#EA580C', fontFamily: 'monospace' }}>≈</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: mkt.color.textPrimary }}>churn signal</span>
        </span>
        {' '}contradicts Q3 NRR; Finance pushed pricing to next cycle.
      </div>
    </div>
  )
}

function OrientationMini() {
  return (
    <div
      style={{
        background: mkt.color.white,
        border: `1px solid ${mkt.color.hairline}`,
        borderRadius: 8,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        fontFamily: mkt.font.sans,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: mkt.font.serif,
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.5,
          color: mkt.color.textPrimary,
        }}
      >
        &ldquo;Mid-market wins are blocked by pricing, not capacity.&rdquo;
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            fontWeight: 500,
            color: '#16A34A',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 99,
            padding: '4px 12px',
          }}
        >
          <span style={{ fontSize: 11 }}>✓</span> 3 supports
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 500,
            color: '#B45309',
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: 99,
            padding: '4px 12px',
          }}
        >
          1 conflicts
        </span>
      </div>
    </div>
  )
}

const MINI_MOCKS = [
  <CoherenceMini key="c" />,
  <ConversationMini key="cv" />,
  <OrientationMini key="o" />,
]

// ─── Section ──────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '⬡',
    iconBg: '#EFF6FF',
    iconFg: '#2563EB',
    title: 'Coherence',
    subtitle: 'The graph knows when things stop adding up',
    body: 'Eighteen deterministic patterns watch the graph for tension — ownership vacuums, silent constraints, capital concentration, dependency shadows. Conflicts surface as a typed inbox you can resolve.',
    pills: ['GCE patterns', 'Signal detection', 'Auto-scoring'],
  },
  {
    icon: '◎',
    iconBg: '#F0FDF4',
    iconFg: '#16A34A',
    title: 'Conversation',
    subtitle: 'Ask your strategy like you\'d ask a colleague',
    body: 'Chat with your strategy. Every answer is grounded in the assets it pulled from — no hallucinated forecasts. Suggested follow-ups become real signals, decisions, or experiments.',
    pills: ['MCP-powered', 'Context-grounded', 'Scenario analysis'],
  },
  {
    icon: '↗',
    iconBg: '#F0FDF4',
    iconFg: '#16A34A',
    title: 'Orientation',
    subtitle: 'From signal to insight to decision, visualised',
    body: 'Walk into any room knowing the bets, the open questions, the latest signal — and what changed since Tuesday. Briefings are assembled, not retyped.',
    pills: ['Four-phase pipeline', 'Tiered briefings', 'Evidence trails'],
  },
]

export default function FeatureTrio() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.white,
        borderBottom: `1px solid ${mkt.color.hairline}`,
        padding: '96px 32px',
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: mkt.layout.siteMax,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center' }}
        >
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.eyebrow,
              fontWeight: 600,
              letterSpacing: mkt.tracking.eyebrow,
              textTransform: 'uppercase',
              color: mkt.color.textMuted,
              margin: '0 0 16px',
            }}
          >
            Three things StrategyOS does
          </p>
          <h2
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.h2,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: mkt.leading.h2,
              color: mkt.color.textPrimary,
              margin: 0,
            }}
          >
            One graph,{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              three superpowers
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * mkt.motion.stagger }}
              style={{
                background: mkt.color.white,
                border: `1px solid ${mkt.color.borderCard}`,
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Text area */}
              <div
                style={{
                  padding: '28px 28px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: f.iconBg,
                    color: f.iconFg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h3
                    style={{
                      fontFamily: mkt.font.sans,
                      fontSize: mkt.type.h3,
                      fontWeight: 700,
                      letterSpacing: mkt.tracking.h3,
                      color: mkt.color.textPrimary,
                      margin: 0,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: mkt.font.sans,
                      fontSize: mkt.type.body,
                      lineHeight: mkt.leading.body,
                      color: mkt.color.textSecondary,
                      margin: 0,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>

              {/* Mini mock */}
              <div
                style={{
                  padding: '16px 20px',
                  background: mkt.color.soft,
                  borderTop: `1px solid ${mkt.color.hairline}`,
                  borderBottom: `1px solid ${mkt.color.hairline}`,
                }}
              >
                {MINI_MOCKS[i]}
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
