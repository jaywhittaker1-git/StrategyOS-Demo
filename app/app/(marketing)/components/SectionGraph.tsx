'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { BigGraph } from './mocks/BigGraph'

export default function SectionGraph() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="how-it-works"
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
          alignItems: 'center',
          gap: 56,
        }}
      >
        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', maxWidth: 640 }}
        >
          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.eyebrow,
              fontWeight: 600,
              letterSpacing: mkt.tracking.eyebrow,
              textTransform: 'uppercase',
              color: mkt.color.accent,
              margin: '0 0 16px',
            }}
          >
            The graph model
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
            Strategy is a graph,{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              not a document
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
            Every bet, decision, OKR, signal, and stakeholder is a typed node.
            Every relationship is an edge. The graph knows when your OKR no longer supports your bet,
            or when a signal contradicts your operating plan.
          </p>
        </motion.div>

        {/* Graph window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
          style={{
            width: '100%',
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
              background: mkt.color.white,
              borderBottom: `1px solid ${mkt.color.hairline}`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 14px',
            }}
          >
            {['#F87171', '#FBBF24', '#4ADE80'].map((c) => (
              <span
                key={c}
                style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0 }}
              />
            ))}
            <span
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: mkt.font.mono,
                fontSize: 11,
                color: mkt.color.textMuted,
                letterSpacing: '0.02em',
              }}
            >
              strategy graph · Aurelius Global
            </span>
          </div>

          {/* Graph canvas */}
          <div style={{ background: mkt.color.graph, padding: 0 }}>
            <BigGraph />
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.24 }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            'Auto-discovered links',
            '18 typed asset nodes',
            'Live coherence scoring',
            'Signal propagation',
            'Structured entity layer',
          ].map((pill) => (
            <span
              key={pill}
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 12,
                fontWeight: 500,
                color: mkt.color.textSecondary,
                background: mkt.color.white,
                border: `1px solid ${mkt.color.hairline}`,
                borderRadius: 99,
                padding: '5px 12px',
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
