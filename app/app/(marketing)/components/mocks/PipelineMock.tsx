'use client'

import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'

const FLOW_KEYFRAMES = `
  @keyframes flowDash {
    0%   { stroke-dashoffset: 170; }
    100% { stroke-dashoffset: 0; }
  }
`

// Phase card — shared style
const phaseCard: React.CSSProperties = {
  background: mkt.color.white,
  border: `1px solid ${mkt.color.borderCard}`,
  borderRadius: 10,
  padding: '10px 12px',
  boxShadow: mkt.shadow.node,
}

const phaseNum: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 9.5,
  fontFamily: mkt.font.mono,
  background: '#F3F4F6',
  color: mkt.color.textMuted,
  borderRadius: 4,
  padding: '2px 6px',
  marginBottom: 6,
  letterSpacing: '0.06em',
}

const phaseName: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: mkt.color.textPrimary,
  marginBottom: 3,
  letterSpacing: '-0.01em',
}

const phaseMeta: React.CSSProperties = {
  fontFamily: mkt.font.mono,
  fontSize: 9.5,
  color: mkt.color.textSubtle,
  marginBottom: 8,
}

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
      <style>{FLOW_KEYFRAMES}</style>

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
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pipe-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={mkt.color.accent} stopOpacity="0.0" />
              <stop offset="50%"  stopColor={mkt.color.accent} stopOpacity="0.45" />
              <stop offset="100%" stopColor={mkt.color.accent} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Inputs → Phase 1 (from right edge of input column ≈193px, to left of P1 card at 244px) */}
          <path d="M 193,152 C 225,152 228,200 244,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 193,270 C 225,270 228,200 244,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />

          {/* Phase 1 right (374) → Phase 2 left (462) */}
          <path d="M 374,200 L 462,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />

          {/* Phase 2 right (592) → Phase 3 caps (724), fan-out */}
          <path d="M 592,200 C 648,200 665,80  724,80"  fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 592,200 C 648,200 665,140 724,140" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 592,200 L 724,200"                 fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 592,200 C 648,200 665,260 724,260" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 592,200 C 648,200 665,320 724,320" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />

          {/* Phase 3 cap right edges (870) → Phase 4 left (1024), fan-in */}
          <path d="M 870,80  C 940,80  975,200 1024,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 870,140 C 940,140 975,200 1024,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          {/* Centre highlighted path — static gradient base */}
          <path d="M 870,200 L 1024,200" fill="none" stroke="url(#pipe-flow)" strokeWidth="2" />
          {/* Animated flow dash on the highlighted path */}
          <path
            d="M 870,200 L 1024,200"
            fill="none"
            stroke={mkt.color.accent}
            strokeWidth="2"
            strokeDasharray="20 155"
            strokeLinecap="round"
            style={{ animation: 'flowDash 1.6s linear infinite' }}
          />
          <path d="M 870,260 C 940,260 975,200 1024,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
          <path d="M 870,320 C 940,320 975,200 1024,200" fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
        </svg>

        {/* ── INPUTS ─────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: 18, top: 24, width: 175 }}>
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

          {/* Locked assets — prominent trigger card */}
          <div
            style={{
              marginTop: 72,
              background: mkt.color.white,
              border: `1.5px solid ${mkt.color.accent}`,
              borderRadius: 10,
              padding: '12px 12px 10px',
              boxShadow: `0 0 0 4px ${mkt.color.accentLight}, ${mkt.shadow.node}`,
            }}
          >
            {/* Icon row — 5 asset types */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <ObjIcon type="decision" size={16} />
              <ObjIcon type="okr" size={16} />
              <ObjIcon type="bets" size={16} />
              <ObjIcon type="insight" size={16} />
              <ObjIcon type="signal" size={16} />
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: mkt.color.textPrimary,
                letterSpacing: '-0.01em',
                marginBottom: 6,
              }}
            >
              Locked assets
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: mkt.color.accent,
                  flexShrink: 0,
                  boxShadow: `0 0 0 2px ${mkt.color.accentLight}`,
                }}
              />
              <span
                style={{
                  fontFamily: mkt.font.mono,
                  fontSize: 9.5,
                  color: mkt.color.accentText,
                  letterSpacing: '0.05em',
                }}
              >
                commit trigger
              </span>
            </div>
          </div>

          {/* Ontology card */}
          <div
            style={{
              marginTop: 16,
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
            <span style={{ fontFamily: mkt.font.mono, fontSize: 13, color: mkt.color.accent }}>◯</span>
            <span style={{ fontSize: 10.5, color: mkt.color.textSecondary, lineHeight: 1.3 }}>
              Ontology · 18 types · 70+ relations
            </span>
          </div>
        </div>

        {/* ── PHASE 1 — Signal detection ──────────────────────────── */}
        <div style={{ position: 'absolute', left: 244, top: 168, width: 130, ...phaseCard }}>
          <div style={phaseNum}>01</div>
          <div style={phaseName}>Signal detection</div>
          <div style={phaseMeta}>Haiku · 1 batch call</div>
          <span
            style={{
              fontSize: 10.5,
              fontFamily: mkt.font.mono,
              background: mkt.color.amberBg,
              color: mkt.color.amberText,
              border: '1px solid #FDE68A',
              borderRadius: 99,
              padding: '2px 8px',
            }}
          >
            ≈ 7 signals
          </span>
        </div>

        {/* ── PHASE 2 — Insight synthesis ─────────────────────────── */}
        <div style={{ position: 'absolute', left: 462, top: 168, width: 130, ...phaseCard }}>
          <div style={phaseNum}>02</div>
          <div style={phaseName}>Insight synthesis</div>
          <div style={phaseMeta}>Haiku</div>
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

        {/* ── PHASE 3 label ───────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 724,
            top: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: mkt.font.mono,
            fontSize: 9.5,
            color: mkt.color.textSubtle,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: '#F3F4F6',
              color: mkt.color.textMuted,
              borderRadius: 4,
              padding: '2px 6px',
              letterSpacing: '0.06em',
            }}
          >
            03
          </span>
          Capabilities · 5 in parallel
        </div>

        {/* ── PHASE 3 — capability pills ──────────────────────────── */}
        {[
          { label: 'Components',  top: 70,  highlight: false },
          { label: 'Landscape',   top: 130, highlight: false },
          { label: 'Movement',    top: 190, highlight: true  },
          { label: 'Doctrine',    top: 250, highlight: false },
          { label: 'Traceability',top: 310, highlight: false },
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
                ...(cap.highlight ? { boxShadow: `0 0 0 3px ${mkt.color.accentLight}` } : {}),
              }}
            />
            {cap.label}
          </div>
        ))}

        {/* ── PHASE 4 — Briefing assembly ─────────────────────────── */}
        <div style={{ position: 'absolute', left: 1024, top: 168, width: 138, ...phaseCard }}>
          <div style={phaseNum}>04</div>
          <div style={phaseName}>Briefing assembly</div>
          <div style={phaseMeta}>Haiku → Sonnet</div>
          <span
            style={{
              fontSize: 10.5,
              fontFamily: mkt.font.mono,
              background: mkt.color.accentLight,
              color: mkt.color.accentText,
              border: `1px solid ${mkt.color.accentActive}`,
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
          <b style={{ color: mkt.color.textPrimary, fontWeight: 600 }}>
            Cost scales with capabilities, not assets.
          </b>
          {' '}Phase 1 reads raw asset content once. Every phase after reads structured outputs from the phase before.
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
