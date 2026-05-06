'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { mkt } from '../tokens'

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Assets', href: '/#assets' },
  { label: 'Intelligence', href: '/#intelligence' },
  { label: 'MCP', href: '/#mcp' },
  { label: 'Learn more', href: '/learn-more' },
]

export default function NavBar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${mkt.color.hairline}`,
        fontFamily: mkt.font.sans,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: mkt.color.textPrimary,
          }}
        >
          StrategyOS
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 99,
            background: mkt.color.accentLight,
            color: mkt.color.accentText,
            letterSpacing: '0.03em',
          }}
        >
          Early Access
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{
              fontSize: 13,
              color: mkt.color.textMuted,
              textDecoration: 'none',
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <a
          href="mailto:jaywhittaker1@gmail.com"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: mkt.color.white,
            background: mkt.color.accent,
            padding: '6px 16px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Book a demo
        </a>
        <Link
          href="/workspace/a0000000-0000-4000-8000-000000000001"
          style={{
            fontSize: 11,
            fontFamily: mkt.font.mono,
            color: mkt.color.textMuted,
            background: mkt.color.soft,
            border: `1px solid ${mkt.color.hairline}`,
            padding: '5px 10px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
          title="Open app workspace"
        >
          Open app →
        </Link>
      </div>
    </motion.nav>
  )
}
