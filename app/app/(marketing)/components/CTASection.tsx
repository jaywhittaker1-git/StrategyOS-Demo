'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.dark,
        borderTop: `1px solid ${mkt.color.borderDark}`,
        padding: '120px 32px 80px',
      }}
    >
      <div style={{ maxWidth: mkt.layout.siteMax, margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
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
              margin: '0 0 24px',
            }}
          >
            Early access
          </p>

          <h2
            style={{
              fontFamily: mkt.font.sans,
              fontSize: 'clamp(36px, 4vw, 56px)',
              fontWeight: 700,
              letterSpacing: mkt.tracking.h2,
              lineHeight: 1.06,
              color: mkt.color.textOnDark,
              margin: '0 auto 24px',
              maxWidth: 700,
            }}
          >
            Run strategy like a system,{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              not a slide
            </span>
          </h2>

          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.bodyLg,
              lineHeight: mkt.leading.body,
              color: mkt.color.textOnDarkSecondary,
              margin: '0 auto 48px',
              maxWidth: 540,
            }}
          >
            StrategyOS is in private preview with mid-market and enterprise teams. Book a demo
            to see your own plan as a graph.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="mailto:jaywhittaker1@gmail.com"
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                fontWeight: 600,
                color: mkt.color.white,
                background: mkt.color.accent,
                padding: '12px 28px',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Book a demo
            </a>
            <a
              href="/learn-more"
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                color: mkt.color.textOnDarkSecondary,
                textDecoration: 'none',
              }}
            >
              Read the manifesto →
            </a>
            <a
              href="https://www.linkedin.com/in/jaywhittaker1/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                color: mkt.color.textOnDarkSecondary,
                textDecoration: 'none',
              }}
            >
              Say hello on LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
