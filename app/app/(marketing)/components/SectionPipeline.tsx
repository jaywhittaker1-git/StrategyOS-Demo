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
        background: mkt.color.dark,
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
              color: mkt.color.accentActive,
              margin: '0 0 16px',
            }}
          >
            Intelligence pipeline
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
              maxWidth: 640,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Intelligence is a pipeline,{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              not a prompt
            </span>
          </h2>
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.bodyLg,
              lineHeight: mkt.leading.body,
              color: mkt.color.textOnDarkSecondary,
              margin: '0 auto',
              maxWidth: 560,
            }}
          >
            Every committed asset triggers a structured four-phase process: signal detection,
            insight synthesis, cross-layer evaluation, and briefing assembly. The result is a
            tiered intelligence feed — not a chat response.
          </p>
        </motion.div>

        {/* Pipeline mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
          style={{
            borderRadius: 12,
            border: `1px solid ${mkt.color.borderDark}`,
            overflow: 'hidden',
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
            background: mkt.color.borderDark,
            borderRadius: 10,
            overflow: 'hidden',
            border: `1px solid ${mkt.color.borderDark}`,
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
                background: mkt.color.darkCallout,
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
                  color: mkt.color.textOnDarkSecondary,
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
                  color: mkt.color.textOnDark,
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
