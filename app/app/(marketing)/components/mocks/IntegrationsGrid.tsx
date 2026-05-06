'use client'

import { mkt } from '../../tokens'

type IntegrationStatus = 'live' | 'soon' | 'planned'

interface Integration {
  name: string
  status: IntegrationStatus
  tag: string
  note: string
}

const INTEGRATIONS: Integration[] = [
  {
    name: 'Wikidata',
    status: 'live',
    tag: 'Ontology enrichment',
    note: 'Canonical descriptions · industry classification on locked concepts.',
  },
  {
    name: 'Anthropic',
    status: 'live',
    tag: 'Reasoning',
    note: 'Haiku for high-frequency · Sonnet for synthesis. Prompt caching on every system prompt.',
  },
  {
    name: 'Supabase',
    status: 'live',
    tag: 'Data store',
    note: 'Row-level security on workspace data. Single source of truth for assets, signals, risks.',
  },
  {
    name: 'Semantic Scholar',
    status: 'soon',
    tag: 'Evolution signals',
    note: 'Paper volume as a leading indicator — 2–4 years ahead of commercialisation.',
  },
  {
    name: 'RSS feeds',
    status: 'soon',
    tag: 'Competitive intel',
    note: 'Entity-anchored. A single mention is noise; eight in 30 days is a signal.',
  },
  {
    name: 'Regulatory feeds',
    status: 'soon',
    tag: 'External constraints',
    note: 'ASIC, ACCC, APRA, RBA, ATO. Routes to the Decision Stack, not the general feed.',
  },
  {
    name: 'ABS / BLS',
    status: 'planned',
    tag: 'Financial benchmarks',
    note: 'Calibration for the Financial Model: labour, earnings, industry value-add.',
  },
  {
    name: 'Patent trends',
    status: 'planned',
    tag: 'Evolution signals',
    note: 'Lagging corroboration alongside Semantic Scholar.',
  },
  {
    name: 'Linear · GitHub',
    status: 'planned',
    tag: 'Execution signals',
    note: 'Close the loop between strategic intent and operational reality.',
  },
]

function statusBadgeStyle(status: IntegrationStatus): React.CSSProperties {
  if (status === 'live') {
    return {
      background: mkt.color.successBg,
      color: mkt.color.successFg,
    }
  }
  if (status === 'soon') {
    return {
      background: '#EEF2FF',
      color: '#4F46E5',
    }
  }
  return {
    background: '#F3F4F6',
    color: mkt.color.textMuted,
  }
}

function statusDotColor(status: IntegrationStatus): string {
  if (status === 'live') return mkt.color.successFg
  if (status === 'soon') return '#4F46E5'
  return mkt.color.textMuted
}

function cardStyle(status: IntegrationStatus): React.CSSProperties {
  if (status === 'live') {
    return {
      background: mkt.color.white,
      border: `1px solid ${mkt.color.borderCard}`,
    }
  }
  if (status === 'soon') {
    return {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FBFAFF 100%)',
      border: `1px solid ${mkt.color.borderCard}`,
    }
  }
  return {
    background: '#FBFBFA',
    border: `1px dashed ${mkt.color.borderCard}`,
  }
}

export function IntegrationsGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        fontFamily: mkt.font.sans,
      }}
    >
      {INTEGRATIONS.map(item => (
        <div
          key={item.name}
          style={{
            ...cardStyle(item.status),
            padding: '18px 16px',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minHeight: 144,
          }}
        >
          {/* Top: name + badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: mkt.color.textPrimary,
              }}
            >
              {item.name}
            </span>
            <span
              style={{
                ...statusBadgeStyle(item.status),
                fontFamily: mkt.font.mono,
                fontSize: 10,
                padding: '3px 7px',
                borderRadius: 99,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: statusDotColor(item.status),
                  display: 'inline-block',
                }}
              />
              {item.status}
            </span>
          </div>

          {/* Tag */}
          <span
            style={{
              fontFamily: mkt.font.mono,
              fontSize: 10.5,
              color: mkt.color.textMuted,
            }}
          >
            {item.tag}
          </span>

          {/* Note */}
          <span
            style={{
              fontSize: 12.5,
              lineHeight: '18px',
              color: mkt.color.textSecondary,
              marginTop: 'auto',
            }}
          >
            {item.note}
          </span>
        </div>
      ))}
    </div>
  )
}
