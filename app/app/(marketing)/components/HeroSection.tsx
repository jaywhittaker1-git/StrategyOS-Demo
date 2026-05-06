'use client'

import { motion } from 'framer-motion'
import { mkt } from '../tokens'
import { DotGrid } from './ui/DotGrid'
import { HeroMock } from './mocks/HeroMock'

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 48 + 40, // nav + dev banner
        background: mkt.color.white,
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-label="Hero"
    >
      {/* Background dot grid */}
      <DotGrid opacity={mkt.dotGrid.heroOpacity} />

      {/* Above-fold content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: mkt.layout.siteMax,
          width: '100%',
          padding: '72px 32px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 28,
        }}
      >
        {/* Pill announcement */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: mkt.font.sans,
              fontSize: 12,
              fontWeight: 600,
              color: mkt.color.accentText,
              background: mkt.color.accentLight,
              border: `1px solid rgba(37,99,235,0.2)`,
              borderRadius: 99,
              padding: '5px 14px',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: mkt.color.accent,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                background: mkt.color.accent,
                color: mkt.color.white,
                borderRadius: 4,
                padding: '1px 6px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              New
            </span>
            MCP server · your strategy is now an API
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          style={{
            fontFamily: mkt.font.sans,
            fontSize: mkt.type.hero,
            fontWeight: 700,
            letterSpacing: mkt.tracking.hero,
            lineHeight: mkt.leading.hero,
            color: mkt.color.textPrimary,
            margin: 0,
            maxWidth: 780,
          }}
        >
          The operating system for{' '}
          <span
            style={{
              fontFamily: mkt.font.serif,
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            living strategy.
          </span>
        </motion.h1>

        {/* Lede */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          style={{
            fontFamily: mkt.font.sans,
            fontSize: mkt.type.bodyLg,
            lineHeight: mkt.leading.body,
            color: mkt.color.textSecondary,
            margin: 0,
            maxWidth: 560,
          }}
        >
          Plans, decisions, bets and signals — held together by a graph
          that notices when they stop adding up. Built for teams who run
          strategy as a system, not a slide deck.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.22 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a
            href="mailto:jaywhittaker1@gmail.com"
            style={{
              fontFamily: mkt.font.sans,
              fontSize: 14,
              fontWeight: 600,
              color: mkt.color.white,
              background: mkt.color.accent,
              padding: '10px 24px',
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
              color: mkt.color.textSecondary,
              textDecoration: 'none',
            }}
          >
            How it works →
          </a>
        </motion.div>
      </div>

      {/* Hero app shell — full width */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.3 }}
        style={{
          width: '100%',
          maxWidth: 1320,
          padding: '0 32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            borderRadius: '12px 12px 0 0',
            border: `1px solid ${mkt.color.borderCard}`,
            borderBottom: 'none',
            overflow: 'hidden',
            boxShadow: mkt.shadow.hero,
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
              flexShrink: 0,
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
              StrategyOS · Aurelius Global
            </span>
          </div>

          <HeroMock />
        </div>
      </motion.div>
    </section>
  )
}
