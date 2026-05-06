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
              fontWeight: 700,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
              color: mkt.color.textPrimary,
              margin: '0 0 20px',
            }}
          >
            The graph notices when things{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              stop adding up
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

        {/* Inbox + copy */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
              A coherence inbox, not a report
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
              Findings are grouped by severity, typed by pattern, and linked directly to the
              assets involved. Each finding tells you what&apos;s wrong, why it matters, and which
              assets need attention — without you having to chase it down.
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
              You can resolve findings, defer them, or open a conversation thread directly from
              the inbox. The graph updates as you act.
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
            <InboxMock />
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
              Signals have a lifecycle
            </h3>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                color: mkt.color.textMuted,
                margin: 0,
              }}
            >
              From detection to resolution — every signal is tracked, not just noted.
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
            <SignalLifecycle />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
