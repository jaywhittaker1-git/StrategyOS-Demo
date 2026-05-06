'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { MCPMock } from './mocks/MCPMock'
import { IntegrationsGrid } from './mocks/IntegrationsGrid'

export default function SectionMCP() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="mcp"
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
          gap: 64,
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
            Open by design
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
            Your strategy is{' '}
            <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              an API
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
            Twenty-seven typed tools, served over MCP. Claude, Cursor, your own agents — anything
            that speaks the protocol can read your assets, run a coherence check, or capture a
            signal. Writes are dry-run by default; provenance is recorded on every commit.
          </p>
        </motion.div>

        {/* MCP Mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          style={{
            borderRadius: 12,
            border: `1px solid ${mkt.color.borderCard}`,
            overflow: 'hidden',
            boxShadow: mkt.shadow.window,
          }}
        >
          <MCPMock />
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
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
                Integrations
              </p>
              <h3
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 28,
                  lineHeight: '34px',
                  letterSpacing: '-0.02em',
                  fontWeight: 500,
                  color: mkt.color.textPrimary,
                  margin: 0,
                }}
              >
                Strategy stays alive when{' '}
                <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
                  the world flows in.
                </span>
              </h3>
            </div>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                color: mkt.color.textMuted,
                margin: 0,
                maxWidth: 380,
                lineHeight: '22px',
              }}
            >
              Every integration is entity-anchored. A single mention is noise; eight in thirty
              days, against an asset you locked, is a signal worth surfacing.
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
            <IntegrationsGrid />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
