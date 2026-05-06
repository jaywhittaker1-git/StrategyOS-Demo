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
            The graph notices{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              when things stop adding up.
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
            A deterministic coherence engine evaluates every committed asset against 18 structural
            and health patterns. Gaps, contradictions, and staleness are surfaced as findings —
            not buried in dashboards.
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
              Eighteen deterministic patterns watch the graph: ownership vacuums, silent
              constraints, dependency shadows, capital concentration. They run in milliseconds,
              against structured data — no LLM, no slop, no false positives that don&apos;t replicate.
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
              Every finding cites the two assets in tension, why they conflict, and the smallest
              change that would resolve it. The AI layer reads these findings; it doesn&apos;t invent them.
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
                Findings have a life.{' '}
                <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
                  Resolved closes the loop.
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
                Every signal moves through three states. The team can add context, challenge the
                finding with evidence, or commit to an action. Nothing rots in a backlog — either
                it changes the strategy, or it gets explicitly closed with a reason.
              </p>
            </div>
            <SignalLifecycle />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
