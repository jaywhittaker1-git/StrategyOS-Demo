'use client'

import { useEffect, useRef, useState } from 'react'
import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'

const CANVAS_W = 1200
const CANVAS_H = 420

// pathLength="1" normalises every path to 1 unit — dash units are path-length-independent
// 0.09 dash + 4.0 gap = 4.09 period. Particle visible for ~22% of the 3s cycle.
const DASH_ARRAY = '0.09 4.0'
const DASH_FROM  = '4.09'

const FLOW_CSS = `
  @keyframes pipeFlow {
    from { stroke-dashoffset: ${DASH_FROM}; }
    to   { stroke-dashoffset: 0; }
  }
`

function particle(
  d: string,
  delay: number,
  opacity = 0.5,
  strokeWidth = 1.5,
): React.ReactElement {
  return (
    <path
      d={d}
      fill="none"
      stroke={mkt.color.accent}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={DASH_ARRAY}
      pathLength="1"
      style={{
        animation: `pipeFlow 3s ${delay}s linear infinite`,
        opacity,
      }}
    />
  )
}

const phaseCard: React.CSSProperties = {
  background: mkt.color.white,
  border: `1px solid ${mkt.color.borderCard}`,
  borderRadius: 10,
  padding: '10px 12px',
  boxShadow: mkt.shadow.node,
}

const numBadge: React.CSSProperties = {
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

// Path definitions (reused for base + particle overlays)
const P = {
  in1:  'M 193,152 C 225,152 228,200 244,200',
  in2:  'M 193,270 C 225,270 228,200 244,200',
  p12:  'M 374,200 L 462,200',
  c1:   'M 592,200 C 648,200 665,110 724,110',
  c2:   'M 592,200 C 648,200 665,170 724,170',
  c3:   'M 592,200 C 648,200 665,230 724,230',
  c4:   'M 592,200 C 648,200 665,290 724,290',
  c5:   'M 592,200 C 648,200 665,350 724,350',
  f1:   'M 870,110 C 940,110 975,200 1024,200',
  f2:   'M 870,170 C 940,170 975,200 1024,200',
  f3:   'M 870,230 C 940,230 975,200 1024,200',  // highlighted centre
  f4:   'M 870,290 C 940,290 975,200 1024,200',
  f5:   'M 870,350 C 940,350 975,200 1024,200',
}

export function PipelineMock() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / CANVAS_W))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: mkt.color.white, fontFamily: mkt.font.sans }}>
      <style>{FLOW_CSS}</style>

      {/* Outer container — measures available width */}
      <div ref={containerRef} style={{ position: 'relative', height: CANVAS_H * scale, overflow: 'hidden' }}>

        {/* Fixed 1200×420 canvas — scales uniformly to fit */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: CANVAS_W, height: CANVAS_H,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            background: '#FCFCFB',
            backgroundImage: 'radial-gradient(circle, #E0E0DE 1.2px, transparent 1.2px)',
            backgroundSize: '18px 18px',
          }}
        >
          {/* ── SVG connector + particle layer ────────────────────── */}
          <svg
            width={CANVAS_W} height={CANVAS_H}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            {/* Base hairline paths */}
            {Object.values(P).map((d, i) => (
              <path key={i} d={d} fill="none" stroke={mkt.color.hairline} strokeWidth="1" />
            ))}

            {/* Particle overlays — cascading left-to-right via delay */}
            {/* Inputs → P1 */}
            {particle(P.in1, 0.00, 0.55)}
            {particle(P.in2, 0.20, 0.40)}
            {/* P1 → P2 */}
            {particle(P.p12, 0.50, 0.60, 2)}
            {/* P2 → capabilities (fan-out, symmetric stagger) */}
            {particle(P.c1,  0.80, 0.30)}
            {particle(P.c2,  0.85, 0.38)}
            {particle(P.c3,  0.90, 0.60, 2)}
            {particle(P.c4,  0.85, 0.38)}
            {particle(P.c5,  0.80, 0.30)}
            {/* capabilities → P4 (fan-in, highlighted centre) */}
            {particle(P.f1,  1.20, 0.30)}
            {particle(P.f2,  1.25, 0.38)}
            {particle(P.f3,  1.30, 0.72, 2.5)}
            {particle(P.f4,  1.25, 0.38)}
            {particle(P.f5,  1.20, 0.30)}
          </svg>

          {/* ── INPUTS column ─────────────────────────────────────── */}
          <div style={{ position: 'absolute', left: 18, top: 24, width: 175 }}>
            <div style={{
              fontSize: 9.5, fontFamily: mkt.font.mono, color: mkt.color.textSubtle,
              textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8,
            }}>
              INPUTS
            </div>

            {/* Locked assets — prominent trigger */}
            <div style={{
              marginTop: 72,
              background: mkt.color.white,
              border: `1.5px solid ${mkt.color.accent}`,
              borderRadius: 10,
              padding: '12px 12px 10px',
              boxShadow: `0 0 0 4px ${mkt.color.accentLight}, ${mkt.shadow.node}`,
            }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                <ObjIcon type="decision" size={16} />
                <ObjIcon type="okr"      size={16} />
                <ObjIcon type="bets"     size={16} />
                <ObjIcon type="insight"  size={16} />
                <ObjIcon type="signal"   size={16} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: mkt.color.textPrimary, letterSpacing: '-0.01em', marginBottom: 6 }}>
                Locked assets
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: mkt.color.accent, flexShrink: 0,
                  boxShadow: `0 0 0 2px ${mkt.color.accentLight}`,
                }} />
                <span style={{ fontFamily: mkt.font.mono, fontSize: 9.5, color: mkt.color.accentText, letterSpacing: '0.05em' }}>
                  commit trigger
                </span>
              </div>
            </div>

            {/* Ontology */}
            <div style={{
              marginTop: 16, display: 'flex', alignItems: 'center', gap: 6,
              background: mkt.color.white, border: `1px solid ${mkt.color.borderCard}`,
              borderRadius: 8, padding: '8px 10px', boxShadow: mkt.shadow.node,
            }}>
              <span style={{ fontFamily: mkt.font.mono, fontSize: 13, color: mkt.color.accent }}>◯</span>
              <span style={{ fontSize: 10.5, color: mkt.color.textSecondary, lineHeight: 1.3 }}>
                Ontology · 18 types · 70+ relations
              </span>
            </div>
          </div>

          {/* ── Phase 1 ───────────────────────────────────────────── */}
          <div style={{ position: 'absolute', left: 244, top: 168, width: 130, ...phaseCard }}>
            <div style={numBadge}>01</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary, marginBottom: 3, letterSpacing: '-0.01em' }}>Signal detection</div>
            <div style={{ fontFamily: mkt.font.mono, fontSize: 9.5, color: mkt.color.textSubtle, marginBottom: 8 }}>Haiku · 1 batch call</div>
            <span style={{ fontSize: 10.5, fontFamily: mkt.font.mono, background: mkt.color.amberBg, color: mkt.color.amberText, border: '1px solid #FDE68A', borderRadius: 99, padding: '2px 8px' }}>
              ≈ 7 signals
            </span>
          </div>

          {/* ── Phase 2 ───────────────────────────────────────────── */}
          <div style={{ position: 'absolute', left: 462, top: 168, width: 130, ...phaseCard }}>
            <div style={numBadge}>02</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary, marginBottom: 3, letterSpacing: '-0.01em' }}>Insight synthesis</div>
            <div style={{ fontFamily: mkt.font.mono, fontSize: 9.5, color: mkt.color.textSubtle, marginBottom: 8 }}>Haiku</div>
            <span style={{ fontSize: 10.5, fontFamily: mkt.font.mono, background: '#EDE9FE', color: '#6D28D9', border: '1px solid #DDD6FE', borderRadius: 99, padding: '2px 8px' }}>
              ✦ 3 insights
            </span>
          </div>

          {/* ── Phase 3 label ─────────────────────────────────────── */}
          <div style={{
            position: 'absolute', left: 724, top: 60,
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: mkt.font.mono, fontSize: 9.5, color: mkt.color.textSubtle,
          }}>
            <span style={{ display: 'inline-block', background: '#F3F4F6', color: mkt.color.textMuted, borderRadius: 4, padding: '2px 6px', letterSpacing: '0.06em' }}>
              03
            </span>
            Capabilities · 5 in parallel
          </div>

          {/* ── Phase 3 pills ─────────────────────────────────────── */}
          {[
            { label: 'Components',   top: 100, hi: false },
            { label: 'Landscape',    top: 160, hi: false },
            { label: 'Movement',     top: 220, hi: true  },
            { label: 'Doctrine',     top: 280, hi: false },
            { label: 'Traceability', top: 340, hi: false },
          ].map((cap) => (
            <div key={cap.label} style={{
              position: 'absolute', left: 724, top: cap.top,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 99, padding: '5px 11px',
              background: mkt.color.white,
              border: cap.hi ? `1.5px solid ${mkt.color.accentActive}` : `1px solid ${mkt.color.borderCard}`,
              fontSize: 11.5,
              color: cap.hi ? mkt.color.accentText : mkt.color.textSecondary,
              fontWeight: cap.hi ? 600 : 400,
              boxShadow: mkt.shadow.node,
              transform: 'translateY(-50%)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: cap.hi ? mkt.color.accent : mkt.color.textSubtle,
                flexShrink: 0,
                ...(cap.hi ? { boxShadow: `0 0 0 3px ${mkt.color.accentLight}` } : {}),
              }} />
              {cap.label}
            </div>
          ))}

          {/* ── Phase 4 ───────────────────────────────────────────── */}
          <div style={{ position: 'absolute', left: 1024, top: 168, width: 138, ...phaseCard }}>
            <div style={numBadge}>04</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary, marginBottom: 3, letterSpacing: '-0.01em' }}>Briefing assembly</div>
            <div style={{ fontFamily: mkt.font.mono, fontSize: 9.5, color: mkt.color.textSubtle, marginBottom: 8 }}>Haiku → Sonnet</div>
            <span style={{ fontSize: 10.5, fontFamily: mkt.font.mono, background: mkt.color.accentLight, color: mkt.color.accentText, border: `1px solid ${mkt.color.accentActive}`, borderRadius: 99, padding: '2px 8px' }}>
              ¶ briefing
            </span>
          </div>

        </div>{/* end fixed canvas */}
      </div>{/* end outer container */}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px',
        borderTop: `1px solid ${mkt.color.hairline}`,
        fontSize: 12, lineHeight: '18px', color: mkt.color.textSecondary,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: mkt.color.accent, flexShrink: 0 }} />
        <span>
          <b style={{ color: mkt.color.textPrimary, fontWeight: 600 }}>Cost scales with capabilities, not assets.</b>
          {' '}Phase 1 reads raw asset content once. Every phase after reads structured outputs from the phase before.
        </span>
        <span style={{ fontFamily: mkt.font.mono, fontSize: 11, color: mkt.color.textSubtle, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          end-to-end · ~14s
        </span>
      </div>
    </div>
  )
}
