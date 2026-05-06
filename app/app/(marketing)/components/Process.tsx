'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { OrientMock } from './mocks/OrientMock'

const STEPS = [
  {
    num: '01',
    title: 'Orient',
    body: 'Build your premise constellation. Capture your core belief, the evidence that supports it, and the signals that would challenge it. This is the foundation the graph reasons from.',
  },
  {
    num: '02',
    title: 'Gather',
    body: 'Connect your intelligence sources. StrategyOS ingests documents, transcripts, market data, and signals — and maps them to the relevant nodes in your graph automatically.',
  },
  {
    num: '03',
    title: 'Confirm',
    body: 'The coherence engine evaluates every asset. Gaps and contradictions surface as findings. The AI synthesises the picture into a tiered briefing: urgent, cross-layer, or noted.',
  },
  {
    num: '04',
    title: 'Lock',
    body: 'Commit your decisions. Lock-time intelligence runs at the moment of commitment — capturing the full strategic context so every decision is auditable and traceable.',
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
            The process
          </p>
          <h2
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.h2,
              fontWeight: 700,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
              color: mkt.color.textOnDark,
              margin: 0,
            }}
          >
            Orient.{' '}
            <span style={{ color: mkt.color.textOnDarkSecondary }}>Gather.</span>{' '}
            <span style={{ color: mkt.color.textOnDarkSecondary }}>Confirm.</span>{' '}
            <span style={{ color: mkt.color.textOnDarkSecondary }}>Lock.</span>
          </h2>
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
