'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { OrientMock } from './mocks/OrientMock'

const STEPS = [
  {
    num: '01 / Orient',
    title: 'Where are we?',
    body: 'Pull the current state of the world — signals, market shifts, customer evidence — into a shared frame. No one re-reads the deck.',
  },
  {
    num: '02 / Gather',
    title: 'What do we know?',
    body: 'Collect evidence for and against each premise. Models, quotes, churn data, competitive moves — typed and linked.',
  },
  {
    num: '03 / Confirm',
    title: 'What do we believe?',
    body: 'Convert evidence into a small set of confirmed premises. Disagreement is an asset, not a meeting.',
  },
  {
    num: '04 / Lock',
    title: 'What changes?',
    body: 'Decisions, bets and OKRs get committed and timestamped. The graph carries forward; the team moves.',
  },
]

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.white,
        borderBottom: `1px solid ${mkt.color.hairline}`,
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
          gap: 64,
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
            The loop
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
            Orient.{' '}
            <span style={{ color: mkt.color.textMuted }}>Gather.</span>{' '}
            <span style={{ color: mkt.color.textMuted }}>Confirm.</span>{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400, color: mkt.color.textPrimary }}>Lock.</span>
          </h2>
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: 17,
              lineHeight: '26px',
              color: mkt.color.textSecondary,
              margin: 0,
              maxWidth: '56ch',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Strategy work has a shape. StrategyOS turns it into a four-step loop the team
            actually finishes — instead of a 47-page doc nobody reads.
          </p>
        </motion.div>

        {/* 4 step grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: mkt.color.hairline,
            borderRadius: 12,
            overflow: 'hidden',
            border: `1px solid ${mkt.color.hairline}`,
          }}
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + i * mkt.motion.stagger }}
              style={{
                background: mkt.color.soft,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: mkt.font.mono,
                  fontSize: 11,
                  fontWeight: 600,
                  color: mkt.color.accent,
                  letterSpacing: '0.06em',
                }}
              >
                {s.num}
              </span>
              <h3
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: mkt.color.textPrimary,
                  margin: 0,
                }}
              >
                {s.title}
              </h3>

              <p
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: mkt.color.textSecondary,
                  margin: 0,
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Orient mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          style={{
            borderRadius: 12,
            border: `1px solid ${mkt.color.hairline}`,
            overflow: 'hidden',
            boxShadow: mkt.shadow.window,
          }}
        >
          <OrientMock />
        </motion.div>
      </div>
    </section>
  )
}
