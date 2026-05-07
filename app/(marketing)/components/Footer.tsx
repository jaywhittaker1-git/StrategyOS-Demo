'use client'

import Link from 'next/link'
import { mkt } from '../tokens'

const COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Graph', href: '/#how-it-works' },
      { label: 'Coherence inbox', href: '/#coherence' },
      { label: 'Conversational', href: '/#intelligence' },
      { label: 'Asset library', href: '/#assets' },
      { label: 'Integrations', href: '/#mcp' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Manifesto', href: '/learn-more' },
      { label: 'Customers', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Field guide', href: '#' },
      { label: 'Templates', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
  {
    heading: 'Access',
    links: [
      { label: 'Book a demo', href: 'mailto:jaywhittaker1@gmail.com' },
      { label: 'Contact', href: 'mailto:jaywhittaker1@gmail.com' },
      { label: 'Open app →', href: '/workspace/a0000000-0000-4000-8000-000000000001' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: mkt.color.white,
        borderTop: `1px solid ${mkt.color.hairline}`,
        padding: '64px 32px 32px',
      }}
    >
      <div style={{ maxWidth: mkt.layout.siteMax, margin: '0 auto' }}>
        {/* Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            marginBottom: 56,
          }}
        >
          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 15,
                fontWeight: 700,
                color: mkt.color.textPrimary,
                letterSpacing: '-0.01em',
              }}
            >
              StrategyOS
            </span>
            <p
              style={{
                fontFamily: mkt.font.sans,
                fontSize: 13,
                lineHeight: 1.7,
                color: mkt.color.textSecondary,
                margin: 0,
                maxWidth: 280,
              }}
            >
              A continuously adaptive strategic reasoning system for organisations and strategists.
            </p>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: mkt.font.sans,
                fontSize: 11,
                color: mkt.color.textMuted,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22C55E',
                  flexShrink: 0,
                }}
              />
              Early access · 2026
            </span>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: mkt.type.eyebrow,
                  fontWeight: 600,
                  color: mkt.color.textPrimary,
                  letterSpacing: mkt.tracking.eyebrow,
                  textTransform: 'uppercase',
                  opacity: 0.5,
                }}
              >
                {col.heading}
              </span>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    fontFamily: mkt.font.sans,
                    fontSize: 13,
                    color: mkt.color.textSecondary,
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = mkt.color.textPrimary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = mkt.color.textSecondary)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Meta row */}
        <div
          style={{
            borderTop: `1px solid ${mkt.color.hairline}`,
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: mkt.font.sans,
              fontSize: 12,
              color: mkt.color.textMuted,
            }}
          >
            © 2026 StrategyOS, Inc.
          </span>
          <span style={{ display: 'inline-flex', gap: 16 }}>
            {['Privacy', 'Terms', 'Status'].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: mkt.font.sans,
                  fontSize: 12,
                  color: mkt.color.textMuted,
                  opacity: 0.6,
                  textDecoration: 'none',
                }}
              >
                {l}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
