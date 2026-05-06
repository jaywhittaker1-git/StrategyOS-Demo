'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'

const STATS = [
  { value: '60min → 10min', label: 'Monday strategic review' },
  { value: '3.4×', label: 'More decisions logged with evidence' },
  { value: '0', label: 'Slide decks of record' },
  { value: '120%', label: 'Avg NRR across pilot customers' },
]

export default function Quote() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.white,
        borderTop: `1px solid ${mkt.color.hairline}`,
        borderBottom: `1px solid ${mkt.color.hairline}`,
        padding: '80px 32px',
      }}
    >
      <div
        ref={ref}
        style={{ maxWidth: mkt.layout.siteMax, margin: '0 auto' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* Quote card */}
          <div
            style={{
              border: `1px solid ${mkt.color.hairline}`,
              borderRadius: 12,
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <p
              style={{
                fontFamily: mkt.font.serif,
                fontSize: 'clamp(18px, 1.8vw, 24px)',
                fontStyle: 'italic',
                lineHeight: 1.5,
                color: mkt.color.textPrimary,
                margin: 0,
              }}
            >
              &ldquo;Our Monday review went from a 60-minute slide-walk to a 10-minute look at
              the Coherence inbox. The conversation we actually need to have is what&apos;s left.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  background: '#FDF2F8',
                  color: '#DB2777',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                NK
              </span>
              <div>
                <div style={{ fontFamily: mkt.font.sans, fontWeight: 600, fontSize: 13, color: mkt.color.textPrimary }}>
                  Nadia Kaur
                </div>
                <div style={{ fontFamily: mkt.font.sans, fontSize: 12, color: mkt.color.textMuted }}>
                  Chief of Staff · Northwind
                </div>
              </div>
            </div>
          </div>

          {/* Stats side */}
          <div>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: mkt.type.eyebrow,
                fontWeight: 600,
                letterSpacing: mkt.tracking.eyebrow,
                textTransform: 'uppercase',
                color: mkt.color.textMuted,
                margin: '0 0 12px',
              }}
            >
              Skim test
            </p>
            <h2
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 32,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                fontWeight: 500,
                color: mkt.color.textPrimary,
                margin: '0 0 16px',
              }}
            >
              Walk into Monday knowing{' '}
              <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
                what changed.
              </span>
            </h2>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 15,
                lineHeight: '24px',
                color: mkt.color.textSecondary,
                margin: '0 0 24px',
                maxWidth: '44ch',
              }}
            >
              Strategy doesn&apos;t fail in slide decks. It fails in the gap between Tuesday&apos;s signal
              and Friday&apos;s decision. StrategyOS closes that gap.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
                maxWidth: 440,
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: mkt.font.sans,
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: mkt.color.textPrimary,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: mkt.font.sans,
                      fontSize: 12,
                      color: mkt.color.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
