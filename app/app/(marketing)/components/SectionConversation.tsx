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
              Conversational
            </p>
            <h2
              style={{
                fontFamily: mkt.font.sans,
                fontSize: mkt.type.h2,
                fontWeight: 500,
                letterSpacing: '-0.03em',
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
              Ask anything — across decisions, plans, signals and people. Every answer cites the
              underlying assets and offers concrete next moves: re-run a model, loop a stakeholder,
              open a decision.
            </p>
          </div>

          <p
            style={{
              fontFamily: mkt.font.sans,
              fontSize: mkt.type.body,
              lineHeight: mkt.leading.body,
              color: mkt.color.textSecondary,
              margin: 0,
            }}
          >
            <span style={{ color: mkt.color.textMuted }}>@-mention</span> any asset to ground the
            conversation. Replies become drafts you can promote — into a task, a decision memo, or
            an experiment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Citations on every answer — no hallucinated strategy.',
              'Suggestions are typed: a Decision draft is a real Decision asset.',
              'Audit trail of who asked what, and what got changed.',
            ].map((item) => (
              <div
                key={item}
                style={{ display: 'flex', gap: 10, fontSize: 14, color: mkt.color.textSecondary }}
              >
                <svg
                  width="14" height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ flexShrink: 0, marginTop: 3, color: mkt.color.successFg }}
                >
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {item}
              </div>
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
              Strategy chat · FY26 Plan
            </span>
          </div>
          <ChatMock />
        </motion.div>
      </div>
    </section>
  )
}
