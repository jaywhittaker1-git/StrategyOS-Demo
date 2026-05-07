'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { PipelineMock } from './mocks/PipelineMock'

export default function SectionPipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="intelligence"
      style={{
        background: mkt.color.soft,
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
            Under the hood
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
              maxWidth: 640,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Intelligence is orchestration,{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              not a single prompt.
            </span>
          </h2>
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: 17,
              lineHeight: '26px',
              color: mkt.color.textSecondary,
              margin: '0 auto',
              maxWidth: '56ch',
            }}
          >
            StrategyOS runs specialised analysis across your strategic assets — generating signals,
            detecting tensions, surfacing risks and synthesising recommendations through a structured
            reasoning pipeline.
          </p>
        </motion.div>

        {/* Pipeline mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
          style={{
            borderRadius: 12,
            border: `1px solid ${mkt.color.hairline}`,
            overflow: 'hidden',
            boxShadow: mkt.shadow.window,
          }}
        >
          <PipelineMock />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.24 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: mkt.color.hairline,
            borderRadius: 10,
            overflow: 'hidden',
            border: `1px solid ${mkt.color.hairline}`,
          }}
        >
          {[
            { label: 'Signal detectors', value: '14 per asset type' },
            { label: 'Briefing tiers', value: 'Urgent · Cross-layer · Noted' },
            { label: 'Triggered by', value: 'Asset commit only' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: mkt.color.white,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  color: mkt.color.textMuted,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: mkt.font.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  color: mkt.color.textPrimary,
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
