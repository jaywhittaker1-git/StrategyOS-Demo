'use client'

import { mkt } from '../../tokens'
import { ObjIcon, ObjType } from './ObjIcon'

type Severity = 'high' | 'med' | 'low'

const SEVERITY_COLOR: Record<Severity, string> = {
  high: '#DC2626',
  med: '#D97706',
  low: '#9CA3AF',
}

interface InboxItem {
  severity: Severity
  from: ObjType
  to: ObjType
  title: string
  body: string
  age: string
}

const ITEMS: InboxItem[] = [
  {
    severity: 'high',
    from: 'signal',
    to: 'okr',
    title: 'Q3 NRR forecast contradicts churn signal',
    body: 'Plan assumes 118% NRR; 3 mid-mkt accounts trending to churn would land at 109%.',
    age: '4h',
  },
  {
    severity: 'med',
    from: 'decision',
    to: 'experiment',
    title: 'Decision lacks experiment evidence',
    body: 'Usage-based pricing decision approved without referenced pilot results.',
    age: '1d',
  },
  {
    severity: 'med',
    from: 'okr',
    to: 'okr',
    title: 'Two OKRs share the same key result',
    body: "Logo growth and Pipeline both claim 'New mid-mkt logos +40%' as KR.",
    age: '1d',
  },
  {
    severity: 'low',
    from: 'task',
    to: 'narrative',
    title: "Narrative hasn't been updated",
    body: 'Pricing rationale still references pilot status from 3 weeks ago.',
    age: '3d',
  },
  {
    severity: 'low',
    from: 'bets',
    to: 'capability',
    title: 'Bet implies missing capability',
    body: "Vertical agents bet requires 'on-prem inference' which isn't on the capability map.",
    age: '5d',
  },
]

export function InboxMock() {
  return (
    <div style={{
      background: mkt.color.white,
      borderRadius: 12,
      border: `1px solid ${mkt.color.hairline}`,
      boxShadow: mkt.shadow.window,
      overflow: 'hidden',
      fontFamily: mkt.font.sans,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        borderBottom: `1px solid ${mkt.color.hairline}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: mkt.color.textPrimary }}>Coherence inbox</span>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: mkt.color.amberText,
            background: mkt.color.amberBg,
            borderRadius: 99,
            padding: '2px 8px',
          }}>7 conflicts</span>
        </div>
        <div style={{ display: 'flex' }}>
          {['Today', 'Week', 'All'].map((tab, i) => (
            <div
              key={tab}
              style={{
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? mkt.color.accent : mkt.color.textMuted,
                background: i === 0 ? mkt.color.accentLight : 'transparent',
                border: `1px solid ${mkt.color.hairline}`,
                borderLeft: i > 0 ? 'none' : `1px solid ${mkt.color.hairline}`,
                borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : 0,
                cursor: 'pointer',
              }}
            >{tab}</div>
          ))}
        </div>
      </div>

      <div>
        {ITEMS.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '4px auto 1fr auto',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px 14px 0',
              borderBottom: idx < ITEMS.length - 1 ? `1px solid ${mkt.color.hairline2}` : 'none',
            }}
          >
            <div style={{
              width: 4,
              alignSelf: 'stretch',
              background: SEVERITY_COLOR[item.severity],
              borderRadius: '0 2px 2px 0',
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              border: `1px solid ${mkt.color.hairline}`,
              borderRadius: 99,
              background: mkt.color.soft,
              flexShrink: 0,
            }}>
              <ObjIcon type={item.from} size={14} />
              <span style={{ fontSize: 11, color: mkt.color.textMuted }}>↔</span>
              <ObjIcon type={item.to} size={14} />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: mkt.color.textPrimary, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: mkt.color.textMuted, lineHeight: 1.4 }}>
                {item.body}
              </div>
            </div>

            <div style={{
              fontSize: 11,
              color: mkt.color.textSubtle,
              fontFamily: mkt.font.mono,
              flexShrink: 0,
            }}>
              {item.age}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
