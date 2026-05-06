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
            MCP integration
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
            StrategyOS exposes 27 MCP tools so any compatible AI agent — Claude, Cursor,
            your own scripts — can read, traverse, and write to your strategy graph programmatically.
            No API keys required. Just connect and query.
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
          <div style={{ textAlign: 'center' }}>
            <h3
              style={{
                fontFamily: mkt.font.sans,
                fontSize: mkt.type.h3,
                fontWeight: 700,
                letterSpacing: mkt.tracking.h3,
                color: mkt.color.textPrimary,
                margin: '0 0 8px',
              }}
            >
              Integrations
            </h3>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 14,
                color: mkt.color.textMuted,
                margin: 0,
              }}
            >
              Connect your existing tools. More coming soon.
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
