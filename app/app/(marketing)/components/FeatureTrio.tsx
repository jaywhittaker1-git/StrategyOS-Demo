'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'

const FEATURES = [
  {
    icon: '⬡',
    iconBg: '#EFF6FF',
    iconFg: '#2563EB',
    title: 'Coherence',
    subtitle: 'The graph knows when things stop adding up',
    body: 'Every time an asset is updated, StrategyOS re-evaluates all connected nodes. It surfaces gaps, contradictions, and drift before they become misalignment. No manual cross-referencing.',
    pills: ['GCE patterns', 'Signal detection', 'Auto-scoring'],
  },
  {
    icon: '◎',
    iconBg: '#F0FDF4',
    iconFg: '#16A34A',
    title: 'Conversation',
    subtitle: 'Ask your strategy like you\'d ask a colleague',
    body: 'Talk to your strategy in plain language. Run scenarios, stress-test assumptions, explore dependencies. The AI answers from your graph — not from the internet.',
    pills: ['MCP-powered', 'Context-grounded', 'Scenario analysis'],
  },
  {
    icon: '↗',
    iconBg: '#FFF7ED',
    iconFg: '#EA580C',
    title: 'Orientation',
    subtitle: 'From signal to insight to decision, visualised',
    body: 'The intelligence pipeline runs continuously: detect signals, synthesise insights, classify by tier, and surface them as a briefing. You always know what changed and why it matters.',
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
        borderTop: `1px solid ${mkt.color.hairline}`,
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
            What it does
          </p>
          <h2
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.h2,
              fontWeight: 700,
              letterSpacing: mkt.tracking.h2,
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
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
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

              {/* Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                    fontSize: 13,
                    fontWeight: 500,
                    color: mkt.color.textMuted,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {f.subtitle}
                </p>
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

              {/* Pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                {f.pills.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontFamily: mkt.font.mono,
                      fontSize: 11,
                      color: mkt.color.textMuted,
                      background: mkt.color.soft,
                      border: `1px solid ${mkt.color.hairline}`,
                      borderRadius: 4,
                      padding: '3px 7px',
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
