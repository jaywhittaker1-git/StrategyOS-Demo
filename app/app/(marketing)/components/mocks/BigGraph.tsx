'use client'

import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'

const NODES = [
  { id: 'g1', type: 'enterprise', label: 'Be the default for mid-market RevOps', sub: 'North star', x: 40, y: 30, w: 260 },
  { id: 'g2', type: 'okr', label: 'FY26 net retention ≥ 120%', x: 40, y: 130, w: 230 },
  { id: 'g3', type: 'okr', label: 'Mid-mkt logos +60%', x: 40, y: 220, w: 200 },
  { id: 'g4', type: 'bets', label: 'Vertical AI agents', sub: 'Bet · 18mo', x: 340, y: 56, w: 180 },
  { id: 'g5', type: 'decision', label: 'Usage-based pricing', hot: true, x: 340, y: 144, w: 180 },
  { id: 'g6', type: 'wardley', label: 'Platform Wardley map', x: 340, y: 232, w: 200 },
  { id: 'g7', type: 'experiment', label: 'Pricing pilot · 12 accts', x: 580, y: 22, w: 196 },
  { id: 'g8', type: 'signal', label: '3 mid-mkt churn risk', sub: 'Signal · 4d', x: 580, y: 110, w: 200 },
  { id: 'g9', type: 'financial', label: 'Pricing model v4', x: 580, y: 198, w: 184 },
  { id: 'g10', type: 'competitive', label: 'Vercel teardown', x: 580, y: 278, w: 168 },
  { id: 'g11', type: 'task', label: 'Customer comms', sub: 'Task · Mira', x: 820, y: 44, w: 166 },
  { id: 'g12', type: 'task', label: 'Update playbook', x: 820, y: 124, w: 166 },
  { id: 'g13', type: 'narrative', label: 'Pricing rationale memo', x: 820, y: 220, w: 196 },
  { id: 'g14', type: 'stakeholder', label: 'Finance alignment', x: 820, y: 300, w: 184 },
]

const EDGES = [
  { from: 'g1', to: 'g2' },
  { from: 'g1', to: 'g3' },
  { from: 'g2', to: 'g4' },
  { from: 'g2', to: 'g5' },
  { from: 'g3', to: 'g5' },
  { from: 'g3', to: 'g6' },
  { from: 'g5', to: 'g7' },
  { from: 'g5', to: 'g8' },
  { from: 'g5', to: 'g9' },
  { from: 'g5', to: 'g10' },
  { from: 'g7', to: 'g11' },
  { from: 'g7', to: 'g12' },
  { from: 'g5', to: 'g13' },
  { from: 'g9', to: 'g14' },
  { from: 'g8', to: 'g5' },
] as const

const NODE_H = 42

function getNode(id: string) {
  return NODES.find(n => n.id === id)!
}

function isHot(from: string, to: string) {
  return from === 'g5' || to === 'g5'
}

export function BigGraph() {
  const paths = EDGES.map(e => {
    const s = getNode(e.from)
    const d = getNode(e.to)
    const x1 = s.x + s.w
    const y1 = s.y + NODE_H / 2
    const x2 = d.x
    const y2 = d.y + NODE_H / 2
    const cx = (x1 + x2) / 2
    const hot = isHot(e.from, e.to)
    return { d: `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`, hot }
  })

  return (
    <div style={{
      position: 'relative',
      height: 360,
      overflow: 'hidden',
      background: mkt.color.graph,
      backgroundImage: 'radial-gradient(circle, #E8E8E8 1px, transparent 1px)',
      backgroundSize: '16px 16px',
      borderRadius: 12,
      fontFamily: mkt.font.sans,
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg style={{ position: 'absolute', inset: 0, width: 1020, height: 360, overflow: 'visible' }}>
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.hot ? '#2563EB' : '#D8D8D6'}
              strokeWidth={p.hot ? 1.5 : 1}
            />
          ))}
        </svg>
        {NODES.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: node.w,
              height: NODE_H,
              background: mkt.color.white,
              border: `1px solid ${node.hot ? '#2563EB' : mkt.color.hairline}`,
              borderRadius: 8,
              boxShadow: node.hot ? `0 0 0 3px rgba(37,99,235,0.15), ${mkt.shadow.node}` : mkt.shadow.node,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
            }}
          >
            <ObjIcon type={node.type} size={16} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: mkt.color.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {node.label}
              </div>
              {'sub' in node && node.sub && (
                <div style={{ fontSize: 10.5, color: mkt.color.textMuted, marginTop: 1 }}>{node.sub}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
