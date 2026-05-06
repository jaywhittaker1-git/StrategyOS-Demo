'use client'

import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'

export function PipelineMock() {
  const dotGridBg = 'radial-gradient(circle, #E8E8E8 1px, transparent 1px)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: mkt.color.white,
        fontFamily: mkt.font.sans,
      }}
    >
      {/* Diagram area */}
      <div
        style={{
          position: 'relative',
          height: 420,
          background: '#FCFCFB',
          backgroundImage: dotGridBg,
          backgroundSize: '18px 18px',
          overflow: 'hidden',
        }}
      >
        {/* SVG connectors */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pipe-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mkt.color.accent} stopOpacity="0.2" />
              <stop offset="100%" stopColor={mkt.color.accent} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Input → Phase 1 */}
          <path
            d="M110,140 C180,140 200,200 240,200"
            fill="none"
            stroke={mkt.color.hairline}
            strokeWidth="1"
          />
          <path
            d="M110,260 C180,260 200,200 240,200"
            fill="none"
            stroke={mkt.color.hairline}
            strokeWidth="1"
          />

          {/* Phase 1 → Phase 2 */}
          <path
            d="M360,200 L460,200"
            fill="none"
            stroke={mkt.color.hairline}
            strokeWidth="1"
          />

          {/* Phase 2 → Phase 3 fanout (5 paths) */}
          <path d="M580,200 C640,200 680,80 720,80" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M580,200 C640,200 680,140 720,140" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M580,200 C640,200 680,200 720,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M580,200 C640,200 680,260 720,260" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M580,200 C640,200 680,320 720,320" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />

          {/* Phase 3 → Phase 4 fanin (5 paths) — middle one highlighted */}
          <path d="M870,80 C920,80 980,200 1020,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M870,140 C920,140 980,200 1020,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M870,200 L1020,200" fill="none" stroke="url(#pipe-flow)" strokeWidth="2" />
          <path d="M870,260 C920,260 980,200 1020,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M870,320 C920,320 980,200 1020,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
        </svg>

        {/* INPUTS */}
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 24,
            width: 175,
          }}
        >
          <div
            style={{
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              color: mkt.color.textSubtle,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: 8,
            }}
          >
            INPUTS
          </div>

          {/* Input card 1 */}
          <div
            style={{
              marginTop: 72,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: mkt.color.white,
              border: `1px solid ${mkt.color.borderCard}`,
              borderRadius: 8,
              padding: '8px 10px',
              boxShadow: mkt.shadow.node,
            }}
          >
            <ObjIcon type="decision" size={16} />
            <ObjIcon type="okr" size={16} />
            <ObjIcon type="bets" size={16} />
            <span style={{ fontSize: 11.5, color: mkt.color.textSecondary, fontWeight: 500 }}>
              Locked assets
            </span>
          </div>

          {/* Input card 2 */}
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: mkt.color.white,
              border: `1px solid ${mkt.color.borderCard}`,
              borderRadius: 8,
              padding: '8px 10px',
              boxShadow: mkt.shadow.node,
            }}
          >
            <span
              style={{
                fontFamily: mkt.font.mono,
                fontSize: 13,
                color: mkt.color.accent,
              }}
            >
              ◯
            </span>
            <span style={{ fontSize: 10.5, color: mkt.color.textSecondary, lineHeight: 1.3 }}>
              Ontology · 18 types · 70+ relations
            </span>
          </div>
        </div>

        {/* PHASE 1 */}
        <div
          style={{
            position: 'absolute',
            left: 244,
            top: 168,
            width: 130,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              background: '#F3F4F6',
              color: mkt.color.textMuted,
              borderRadius: 4,
              padding: '2px 6px',
              marginBottom: 6,
            }}
          >
            01
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: mkt.color.textPrimary,
              marginBottom: 3,
            }}
          >
            Signal detection
          </div>
          <div
            style={{
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              color: mkt.color.textSubtle,
              marginBottom: 8,
            }}
          >
            Haiku · 1 batch call
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontFamily: mkt.font.mono,
              background: mkt.color.amberBg,
              color: mkt.color.amberText,
              borderRadius: 99,
              padding: '2px 8px',
            }}
          >
            ≈ 7 signals
          </span>
        </div>

        {/* PHASE 2 */}
        <div
          style={{
            position: 'absolute',
            left: 462,
            top: 168,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              background: '#F3F4F6',
              color: mkt.color.textMuted,
              borderRadius: 4,
              padding: '2px 6px',
              marginBottom: 6,
            }}
          >
            02
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: mkt.color.textPrimary,
              marginBottom: 3,
            }}
          >
            Insight synthesis
          </div>
          <div
            style={{
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              color: mkt.color.textSubtle,
              marginBottom: 8,
            }}
          >
            Haiku
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontFamily: mkt.font.mono,
              background: '#EDE9FE',
              color: '#6D28D9',
              border: '1px solid #DDD6FE',
              borderRadius: 99,
              padding: '2px 8px',
            }}
          >
            ✦ 3 insights
          </span>
        </div>

        {/* PHASE 3 — label */}
        <div
          style={{
            position: 'absolute',
            left: 724,
            top: 30,
            fontSize: 9.5,
            fontFamily: mkt.font.mono,
            color: mkt.color.textSubtle,
          }}
        >
          03 Capabilities · 5 in parallel
        </div>

        {/* PHASE 3 — capability nodes */}
        {[
          { label: 'Components', top: 70, highlight: false },
          { label: 'Landscape', top: 130, highlight: false },
          { label: 'Movement', top: 190, highlight: true },
          { label: 'Doctrine', top: 250, highlight: false },
          { label: 'Traceability', top: 310, highlight: false },
        ].map((cap) => (
          <div
            key={cap.label}
            style={{
              position: 'absolute',
              left: 724,
              top: cap.top,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 99,
              padding: '5px 11px',
              background: mkt.color.white,
              border: cap.highlight
                ? `1.5px solid ${mkt.color.accentActive}`
                : `1px solid ${mkt.color.borderCard}`,
              fontSize: 11.5,
              color: cap.highlight ? mkt.color.accentText : mkt.color.textSecondary,
              fontWeight: cap.highlight ? 600 : 400,
              boxShadow: mkt.shadow.node,
              transform: 'translateY(-50%)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: cap.highlight ? mkt.color.accent : mkt.color.textSubtle,
                flexShrink: 0,
              }}
            />
            {cap.label}
          </div>
        ))}

        {/* PHASE 4 */}
        <div
          style={{
            position: 'absolute',
            left: 1024,
            top: 168,
            width: 138,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              background: '#F3F4F6',
              color: mkt.color.textMuted,
              borderRadius: 4,
              padding: '2px 6px',
              marginBottom: 6,
            }}
          >
            04
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: mkt.color.textPrimary,
              marginBottom: 3,
            }}
          >
            Briefing assembly
          </div>
          <div
            style={{
              fontSize: 9.5,
              fontFamily: mkt.font.mono,
              color: mkt.color.textSubtle,
              marginBottom: 8,
            }}
          >
            Haiku → Sonnet
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontFamily: mkt.font.mono,
              background: mkt.color.accentLight,
              color: mkt.color.accentText,
              borderRadius: 99,
              padding: '2px 8px',
            }}
          >
            ¶ briefing
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 18px',
          borderTop: `1px solid ${mkt.color.hairline}`,
          fontSize: 12,
          lineHeight: '18px',
          color: mkt.color.textSecondary,
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
        <span>
          Cost scales with capabilities, not assets. Phase 1 reads raw asset content once…
        </span>
        <span
          style={{
            fontFamily: mkt.font.mono,
            fontSize: 11,
            color: mkt.color.textSubtle,
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          end-to-end · ~14s
        </span>
      </div>
    </div>
  )
}
