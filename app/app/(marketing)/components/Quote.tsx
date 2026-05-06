'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'

const STATS = [
  { value: '18', label: 'Strategy asset types' },
  { value: '27', label: 'MCP tools exported' },
  { value: '9×', label: 'GCE coherence patterns' },
  { value: '<2s', label: 'Signal detection latency' },
]

export default function Quote() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.soft,
        borderTop: `1px solid ${mkt.color.hairline}`,
        borderBottom: `1px solid ${mkt.color.hairline}`,
        padding: '80px 32px',
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: mkt.layout.siteMax,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 64,
        }}
      >
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            maxWidth: 680,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: mkt.font.serif,
              fontSize: 'clamp(22px, 2.2vw, 30px)',
              fontStyle: 'italic',
              lineHeight: 1.45,
              color: mkt.color.textPrimary,
              margin: '0 0 24px',
            }}
          >
            "For the first time, I can see our whole strategy in one place — not a
            deck, not a wiki, but a living graph that tells me when something stops
            making sense."
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 13,
                fontWeight: 600,
                color: mkt.color.textPrimary,
              }}
            >
              Sarah Chen
            </span>
            <span
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 12,
                color: mkt.color.textMuted,
              }}
            >
              Chief Strategy Officer, Parallax Systems
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: mkt.color.hairline,
            border: `1px solid ${mkt.color.hairline}`,
            borderRadius: 12,
            overflow: 'hidden',
            width: '100%',
            maxWidth: 680,
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: mkt.color.white,
                padding: '24px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: mkt.font.mono,
                  fontSize: 28,
                  fontWeight: 600,
                  color: mkt.color.accent,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 11,
                  color: mkt.color.textMuted,
                  lineHeight: 1.4,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
