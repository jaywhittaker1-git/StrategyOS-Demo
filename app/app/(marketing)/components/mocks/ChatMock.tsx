'use client'

import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'

export function ChatMock() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: mkt.color.white,
      height: 460,
      fontFamily: mkt.font.sans,
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${mkt.color.hairline}`,
      boxShadow: mkt.shadow.window,
    }}>
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ fontSize: 11, color: mkt.color.textMuted }}>You · 11:42</div>
          <div style={{
            background: '#F3F4F6',
            borderRadius: '12px 12px 2px 12px',
            padding: '10px 14px',
            fontSize: 13,
            color: mkt.color.textPrimary,
            maxWidth: 360,
          }}>
            What&apos;s blocking the{' '}
            <span style={{
              background: mkt.color.accentLight,
              color: mkt.color.accentText,
              padding: '1px 6px',
              borderRadius: 4,
              fontWeight: 500,
            }}>@Q3 pricing decision</span>
            ?
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#7C3AED', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: mkt.color.textMuted }}>StrategyOS · cited 4 assets</span>
          </div>
          <div style={{
            background: mkt.color.soft,
            borderRadius: '2px 12px 12px 12px',
            padding: '10px 14px',
            fontSize: 13,
            color: mkt.color.textPrimary,
            lineHeight: 1.6,
            maxWidth: 460,
          }}>
            <div style={{ marginBottom: 8 }}>Three things:</div>
            <ol style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                Finance hasn&apos;t signed off on the{' '}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle' }}>
                  <ObjIcon type="financial" size={13} />
                </span>
                {' '}v4 pricing model — variance band still ±18%.
              </li>
              <li>
                The{' '}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle' }}>
                  <ObjIcon type="signal" size={13} />
                </span>
                {' '}mid-market churn signal conflicts with the assumption that Tier 2 expansion holds at 112%.
              </li>
              <li>
                No owner on the customer comms{' '}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle' }}>
                  <ObjIcon type="task" size={13} />
                </span>
                {' '}draft email task.
              </li>
            </ol>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {['Re-run elasticity sim', 'Loop in Finance', 'Open decision'].map(chip => (
                <div
                  key={chip}
                  style={{
                    height: 26,
                    borderRadius: 99,
                    border: `1px solid ${mkt.color.hairline}`,
                    background: mkt.color.white,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '0 10px',
                    fontSize: 12,
                    color: mkt.color.textSecondary,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{
            background: '#F3F4F6',
            borderRadius: '12px 12px 2px 12px',
            padding: '10px 14px',
            fontSize: 13,
            color: mkt.color.textPrimary,
            maxWidth: 360,
          }}>
            If we delay 2 weeks what does Q3 NRR look like?
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: '#7C3AED', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#7C3AED' }}>Reading model · Q3 NRR · churn signals…</span>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: `1px solid ${mkt.color.hairline}`,
        background: mkt.color.soft,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, color: mkt.color.textMuted }}>@</span>
        <span style={{ flex: 1, fontSize: 13, color: mkt.color.textSubtle }}>Ask about strategy…</span>
        <kbd style={{
          fontSize: 11,
          color: mkt.color.textSubtle,
          background: mkt.color.hairline2,
          border: `1px solid ${mkt.color.hairline}`,
          borderRadius: 4,
          padding: '2px 6px',
          fontFamily: mkt.font.mono,
        }}>⌘↵</kbd>
      </div>
    </div>
  )
}
