'use client'

import React from 'react'
import { mkt } from '../../tokens'

interface StepConfig {
  state: string
  label: string
  meta: string
  dotColor: string
  bg: string
  border: string
  textColor: string
}

const STEPS: StepConfig[] = [
  {
    state: 'open',
    label: 'open',
    meta: 'detected · awaiting response',
    dotColor: mkt.color.amber,
    bg: mkt.color.amberBg,
    border: '#FCD34D',
    textColor: mkt.color.amberText,
  },
  {
    state: 'acknowledged',
    label: 'acknowledged',
    meta: 'context, challenge, or action item recorded',
    dotColor: mkt.color.accent,
    bg: '#EFF6FF',
    border: '#BFDBFE',
    textColor: mkt.color.accentText,
  },
  {
    state: 'resolved',
    label: 'resolved',
    meta: 'closed by an action or a decision',
    dotColor: mkt.color.successFg,
    bg: '#F0FDF4',
    border: '#BBF7D0',
    textColor: mkt.color.successFg,
  },
]

export function SignalLifecycle() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24,
        background: mkt.color.white,
        fontFamily: mkt.font.sans,
      }}
    >
      {/* State rail */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 24px 1fr 24px 1fr',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {STEPS.map((step, i) => (
          <React.Fragment key={step.state}>
            {/* Step card */}
            <div
              style={{
                background: step.bg,
                border: `1px solid ${step.border}`,
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: step.dotColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11.5,
                    fontFamily: mkt.font.mono,
                    fontWeight: 600,
                    color: step.textColor,
                  }}
                >
                  {step.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: mkt.color.textMuted,
                  paddingLeft: 15,
                }}
              >
                {step.meta}
              </div>
            </div>

            {/* Arrow between steps */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <svg
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  style={{ display: 'block' }}
                >
                  <line
                    x1="0"
                    y1="6"
                    x2="18"
                    y2="6"
                    stroke={mkt.color.hairline}
                    strokeWidth="1"
                  />
                  <path
                    d="M16 3 L21 6 L16 9"
                    stroke={mkt.color.hairline}
                    strokeWidth="1"
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Example signal card */}
      <div
        style={{
          border: `1px solid ${mkt.color.borderCard}`,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {/* Card head */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: `1px solid ${mkt.color.hairline}`,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          {/* Severity bar */}
          <div
            style={{
              width: 3,
              alignSelf: 'stretch',
              background: mkt.color.amber,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {/* Signal ↔ OKR pair */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontFamily: mkt.font.mono,
                color: mkt.color.textMuted,
              }}
            >
              <span>Signal</span>
              <span style={{ color: mkt.color.textSubtle }}>↔</span>
              <span>OKR</span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: mkt.color.textPrimary,
                lineHeight: 1.3,
              }}
            >
              Q3 NRR forecast contradicts churn signal
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: mkt.font.mono,
                  background: mkt.color.soft,
                  color: mkt.color.textMuted,
                  borderRadius: 4,
                  padding: '2px 7px',
                }}
              >
                cross_asset_conflict
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: mkt.font.mono,
                  background: '#F1F5F9',
                  color: mkt.color.textMuted,
                  borderRadius: 4,
                  padding: '2px 7px',
                }}
              >
                dependency integrity
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: mkt.font.mono,
                  background: mkt.color.accentLight,
                  color: mkt.color.accentText,
                  borderRadius: 4,
                  padding: '2px 7px',
                }}
              >
                confidence 0.84
              </span>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div
          style={{
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: 12.5,
            lineHeight: '18px',
            color: mkt.color.textSecondary,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: mkt.color.textPrimary }}>Fact.</strong>{' '}
            3 mid-mkt accounts trending to churn would land NRR at 109%.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: mkt.color.textPrimary }}>Tension.</strong>{' '}
            Plan assumes 118% NRR.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: mkt.color.textPrimary }}>Trigger.</strong>{' '}
            Loss of 1 more account confirms the gap.
          </p>
        </div>

        {/* Card actions */}
        <div
          style={{
            padding: '12px 16px',
            display: 'flex',
            gap: 6,
            borderTop: `1px solid ${mkt.color.hairline}`,
            background: mkt.color.soft,
            alignItems: 'center',
          }}
        >
          <button
            style={{
              fontSize: 12.5,
              fontFamily: mkt.font.sans,
              color: mkt.color.textSecondary,
              background: mkt.color.white,
              border: `1px solid ${mkt.color.borderCard}`,
              borderRadius: 6,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Add context
          </button>
          <button
            style={{
              fontSize: 12.5,
              fontFamily: mkt.font.sans,
              color: mkt.color.textSecondary,
              background: mkt.color.white,
              border: `1px solid ${mkt.color.borderCard}`,
              borderRadius: 6,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Challenge
          </button>
          <button
            style={{
              fontSize: 12.5,
              fontFamily: mkt.font.sans,
              color: mkt.color.white,
              background: mkt.color.textPrimary,
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              marginLeft: 'auto',
            }}
          >
            Track as action
          </button>
        </div>
      </div>
    </div>
  )
}
