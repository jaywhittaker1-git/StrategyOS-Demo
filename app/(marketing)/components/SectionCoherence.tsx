'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { InboxMock } from './mocks/InboxMock'
import { GCEPatternGrid } from './mocks/GCEPatternGrid'
import { SignalLifecycle } from './mocks/SignalLifecycle'

export default function SectionCoherence() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.soft,
        borderTop: `1px solid ${mkt.color.hairline}`,
        padding: '96px 32px',
        overflow: 'hidden',
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: mkt.layout.siteMax,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 72,
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}
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
            Coherence engine
          </p>
          <h2
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.h2,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: mkt.leading.h2,
              color: mkt.color.textPrimary,
              margin: '0 0 20px',
            }}
          >
            Detect strategic drift{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              before the organisation feels it.
            </span>
          </h2>
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.bodyLg,
              lineHeight: mkt.leading.body,
              color: mkt.color.textSecondary,
              margin: 0,
            }}
          >
            StrategyOS continuously evaluates committed assets for structural conflicts, execution
            risk, dependency fragility and strategic drift. Findings surface immediately — not
            months later through reporting lag.
          </p>
        </motion.div>

        {/* Inbox + copy (window left, copy right — matching design) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${mkt.color.borderCard}`,
              overflow: 'hidden',
              boxShadow: mkt.shadow.window,
            }}
          >
            {/* Window chrome */}
            <div
              style={{
                height: 40,
                background: mkt.color.soft,
                borderBottom: `1px solid ${mkt.color.hairline}`,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 14px',
              }}
            >
              {['#F87171', '#FBBF24', '#4ADE80'].map((c) => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0 }} />
              ))}
              <span style={{ flex: 1, textAlign: 'center', fontFamily: mkt.font.mono, fontSize: 11, color: mkt.color.textMuted }}>
                Coherence · 7 findings
              </span>
            </div>
            <InboxMock />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: mkt.type.body,
                lineHeight: mkt.leading.body,
                color: mkt.color.textSecondary,
                margin: 0,
              }}
            >
              Deterministic checks run against the structured graph to detect ownership vacuums,
              hidden constraints, fragile dependencies and concentration risk.
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
              These checks run in seconds against structured state — deterministic, explainable
              and reproducible. AI synthesis builds on verified system findings instead of
              generating unsupported conclusions.
            </p>
          </div>
        </motion.div>

        {/* GCE Pattern Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3
              style={{
                fontFamily: mkt.font.sans,
                fontSize: mkt.type.h3,
                fontWeight: 700,
                letterSpacing: mkt.tracking.h3,
                color: mkt.color.textPrimary,
                margin: '0 0 8px',
              }}
            >
              18 deterministic coherence patterns
            </h3>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                color: mkt.color.textMuted,
                margin: 0,
              }}
            >
              No hallucinations. Every finding traces to an explicit, named pattern.
            </p>
          </div>
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${mkt.color.borderCard}`,
              overflow: 'hidden',
              boxShadow: mkt.shadow.window,
            }}
          >
            <GCEPatternGrid />
          </div>
        </motion.div>

        {/* Signal Lifecycle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.4fr)',
              gap: 48,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: mkt.type.eyebrow,
                  fontWeight: 600,
                  letterSpacing: mkt.tracking.eyebrow,
                  textTransform: 'uppercase',
                  color: mkt.color.textMuted,
                  margin: 0,
                }}
              >
                Signal lifecycle
              </p>
              <h3
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 28,
                  lineHeight: '34px',
                  letterSpacing: '-0.02em',
                  fontWeight: 500,
                  color: mkt.color.textPrimary,
                  margin: 0,
                }}
              >
                Signals stay operational{' '}
                <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
                  until resolved.
                </span>
              </h3>
              <p
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 15,
                  lineHeight: '24px',
                  color: mkt.color.textSecondary,
                  margin: 0,
                }}
              >
                Every finding moves through a defined lifecycle: open, challenged, resolved. Teams
                can attach evidence, dispute assumptions, assign ownership or commit to action.
                Signals do not disappear into dashboards or backlog debt. Every resolution leaves
                a traceable strategic record.
              </p>
            </div>
            <SignalLifecycle />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
