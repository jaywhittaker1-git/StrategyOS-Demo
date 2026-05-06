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
        background: mkt.color.dark,
        borderTop: `1px solid ${mkt.color.borderDark}`,
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
              color: mkt.color.accentActive,
              margin: '0 0 16px',
            }}
          >
            The loop
          </p>
          <h2
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.h2,
              fontWeight: 700,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
              color: mkt.color.textOnDark,
              margin: '0 0 20px',
            }}
          >
            Orient.{' '}
            <span style={{ color: mkt.color.textOnDarkSecondary }}>Gather.</span>{' '}
            <span style={{ color: mkt.color.textOnDarkSecondary }}>Confirm.</span>{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400, color: mkt.color.textOnDark }}>Lock.</span>
          </h2>
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.bodyLg,
              lineHeight: mkt.leading.body,
              color: mkt.color.textOnDarkSecondary,
              margin: 0,
              maxWidth: 560,
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
            background: mkt.color.borderDark,
            borderRadius: 12,
            overflow: 'hidden',
            border: `1px solid ${mkt.color.borderDark}`,
          }}
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + i * mkt.motion.stagger }}
              style={{
                background: mkt.color.darkCallout,
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
                  color: mkt.color.accentActive,
                  letterSpacing: '0.06em',
                }}
              >
                {s.num}
              </span>
              <h3
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: mkt.color.textOnDark,
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
                  color: mkt.color.textOnDarkSecondary,
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
            border: `1px solid ${mkt.color.borderDark}`,
            overflow: 'hidden',
          }}
        >
          <OrientMock />
        </motion.div>
      </div>
    </section>
  )
}
