'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { ChatMock } from './mocks/ChatMock'

export default function SectionConversation() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: mkt.color.white,
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
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
                margin: '0 0 16px',
              }}
            >
              Conversation
            </p>
            <h2
              style={{
                fontFamily: mkt.font.sans,
                fontSize: mkt.type.h2,
                fontWeight: 700,
                letterSpacing: mkt.tracking.h2,
                lineHeight: mkt.leading.h2,
                color: mkt.color.textPrimary,
                margin: '0 0 16px',
              }}
            >
              Talk to your strategy{' '}
              <span style={{ fontFamily: mkt.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
                like a colleague
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
              Ask questions in plain language. Explore trade-offs. Run what-if scenarios.
              The assistant answers from your strategy graph — not from a generic knowledge base.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Which bets are most exposed if Q3 revenue misses?',
              'Does our OKR cascade support the Germany decision?',
              'What signals are contradicting our operating plan?',
            ].map((q) => (
              <div
                key={q}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 14px',
                  background: mkt.color.soft,
                  border: `1px solid ${mkt.color.hairline}`,
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: mkt.font.mono,
                    fontSize: 11,
                    color: mkt.color.accent,
                    fontWeight: 600,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  Q
                </span>
                <span
                  style={{
                    fontFamily: mkt.font.sans,
                    fontSize: 13,
                    color: mkt.color.textSecondary,
                    lineHeight: 1.5,
                  }}
                >
                  {q}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['MCP-powered', 'Context-grounded answers', 'Cites source assets'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 12,
                  fontWeight: 500,
                  color: mkt.color.textMuted,
                  background: mkt.color.accentLight,
                  borderRadius: 99,
                  padding: '4px 10px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Chat mock */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          style={{
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
              background: mkt.color.soft,
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
              }}
            >
              strategy conversation
            </span>
          </div>
          <ChatMock />
        </motion.div>
      </div>
    </section>
  )
}
