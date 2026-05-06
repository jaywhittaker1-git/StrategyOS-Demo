'use client'

import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'

const ASSET_NAV = [
  { type: 'enterprise', label: 'Enterprise Goals' },
  { type: 'okr', label: 'OKRs' },
  { type: 'bets', label: 'Bets' },
  { type: 'decision', label: 'Decisions' },
  { type: 'experiment', label: 'Experiments' },
  { type: 'signal', label: 'Signals', count: 7 },
  { type: 'insight', label: 'Insights' },
  { type: 'problem', label: 'Problems' },
  { type: 'capability', label: 'Capabilities' },
  { type: 'financial', label: 'Financial Models' },
  { type: 'wardley', label: 'Wardley Maps' },
  { type: 'systems', label: 'Systems Maps' },
  { type: 'competitive', label: 'Competitive Briefs' },
  { type: 'stakeholder', label: 'Stakeholders' },
  { type: 'narrative', label: 'Narratives' },
  { type: 'operating', label: 'Operating Plans' },
  { type: 'task', label: 'Tasks' },
  { type: 'tdmap', label: 'Tech Debt Maps' },
] as const

const GRAPH_NODES = [
  { id: 'n1', type: 'enterprise', label: 'Win mid-market', sub: 'Enterprise Goal', x: 86, y: 72, w: 156 },
  { id: 'n2', type: 'okr', label: 'NRR ≥ 118%', sub: 'OKR · Q3', x: 318, y: 56, w: 160 },
  { id: 'n3', type: 'okr', label: 'Logo growth +40%', sub: 'OKR · Q3', x: 318, y: 132, w: 172 },
  { id: 'n4', type: 'decision', label: 'Usage-based pricing', sub: 'Decision · Open', x: 562, y: 96, w: 184, hot: true },
  { id: 'n5', type: 'bets', label: 'Vertical agents', sub: 'Bet', x: 562, y: 200, w: 168 },
  { id: 'n6', type: 'experiment', label: 'Pricing pilot', sub: 'Experiment', x: 818, y: 60, w: 156 },
  { id: 'n7', type: 'signal', label: '3 mid-mkt churn', sub: 'Signal · 4d ago', x: 818, y: 144, w: 168 },
  { id: 'n8', type: 'financial', label: 'Pricing model v4', sub: 'Financial', x: 818, y: 228, w: 172 },
  { id: 'n9', type: 'task', label: 'Draft customer email', sub: 'Task · Mira', x: 1058, y: 96, w: 168 },
  { id: 'n10', type: 'narrative', label: 'Pricing rationale', sub: 'Narrative', x: 1058, y: 196, w: 168 },
]

const GRAPH_EDGES = [
  { from: 'n1', to: 'n2' },
  { from: 'n1', to: 'n3' },
  { from: 'n2', to: 'n4' },
  { from: 'n3', to: 'n4' },
  { from: 'n3', to: 'n5' },
  { from: 'n4', to: 'n6' },
  { from: 'n4', to: 'n7' },
  { from: 'n4', to: 'n8' },
  { from: 'n6', to: 'n9' },
  { from: 'n4', to: 'n10' },
  { from: 'n7', to: 'n4' },
] as const

const NODE_HEIGHT = 44

function getNodeById(id: string) {
  return GRAPH_NODES.find(n => n.id === id)!
}

function isHotEdge(from: string, to: string) {
  return from === 'n4' || to === 'n4'
}

function GraphCanvas() {
  const svgPaths = GRAPH_EDGES.map(e => {
    const src = getNodeById(e.from)
    const dst = getNodeById(e.to)
    const x1 = src.x + src.w
    const y1 = src.y + NODE_HEIGHT / 2
    const x2 = dst.x
    const y2 = dst.y + NODE_HEIGHT / 2
    const cx = (x1 + x2) / 2
    const hot = isHotEdge(e.from, e.to)
    return { path: `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`, hot }
  })

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1240, height: 320 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
          {svgPaths.map((e, i) => (
            <path
              key={i}
              d={e.path}
              fill="none"
              stroke={e.hot ? '#2563EB' : '#D8D8D6'}
              strokeWidth={e.hot ? 1.5 : 1}
            />
          ))}
        </svg>
        {GRAPH_NODES.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: node.w,
              height: NODE_HEIGHT,
              background: mkt.color.white,
              border: `1px solid ${node.hot ? '#2563EB' : mkt.color.hairline}`,
              borderRadius: 8,
              boxShadow: node.hot ? `0 0 0 3px rgba(37,99,235,0.15), ${mkt.shadow.node}` : mkt.shadow.node,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              fontFamily: mkt.font.sans,
            }}
          >
            <ObjIcon type={node.type} size={22} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11.5, color: mkt.color.textPrimary, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {node.label}
              </div>
              <div style={{ fontSize: 10, color: mkt.color.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                {node.sub}
              </div>
            </div>
          </div>
        ))}
        <div style={{
          position: 'absolute',
          bottom: -28,
          right: 0,
          background: '#F5F3FF',
          border: '1px solid #DDD6FE',
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 11,
          color: '#7C3AED',
          fontFamily: mkt.font.sans,
          whiteSpace: 'nowrap',
        }}>
          3 stale links · refresh from signals
        </div>
      </div>
    </div>
  )
}

export function HeroMock() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: mkt.color.white,
      fontFamily: mkt.font.sans,
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${mkt.color.hairline}`,
      boxShadow: mkt.shadow.window,
    }}>
      <div style={{
        height: 44,
        borderBottom: `1px solid ${mkt.color.hairline}`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 14px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 18,
            height: 18,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: mkt.color.textPrimary }}>Acme · Strategy</span>
          <span style={{ fontSize: 12, color: mkt.color.textMuted }}>⌄</span>
        </div>
        <div style={{
          flex: 1,
          maxWidth: 460,
          height: 28,
          border: `1px solid ${mkt.color.hairline}`,
          borderRadius: 6,
          background: mkt.color.soft,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
        }}>
          <span style={{ fontSize: 12, color: mkt.color.textSubtle }}>Search assets, signals, decisions… ⌘K</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            border: `1px solid ${mkt.color.hairline}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: mkt.color.textMuted,
            cursor: 'pointer',
          }}>⚡</div>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            background: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: mkt.color.white,
          }}>JL</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 300px', flex: 1, minHeight: 0 }}>
        <aside style={{
          borderRight: `1px solid ${mkt.color.hairline}`,
          background: mkt.color.white,
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Strategy Pulse', active: true },
              { label: 'Graph' },
              { label: 'Ontology' },
              { label: 'Inputs & Integrations', count: 3 },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: 6,
                  background: item.active ? mkt.color.accentLight : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: item.active ? 600 : 400, color: item.active ? mkt.color.accentText : mkt.color.textSecondary }}>
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: mkt.color.textMuted,
                    background: mkt.color.hairline2,
                    borderRadius: 99,
                    padding: '1px 6px',
                  }}>{item.count}</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: mkt.color.textMuted,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0 8px',
              marginBottom: 4,
            }}>Strategy assets</div>
            {ASSET_NAV.map(item => (
              <div
                key={item.type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <ObjIcon type={item.type} size={16} />
                  <span style={{ fontSize: 12, color: mkt.color.textSecondary }}>{item.label}</span>
                </div>
                {'count' in item && item.count !== undefined && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: mkt.color.textMuted,
                    background: mkt.color.hairline2,
                    borderRadius: 99,
                    padding: '1px 5px',
                  }}>{item.count}</span>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{
            height: 38,
            borderBottom: `1px solid ${mkt.color.hairline}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 14px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 12.5, color: mkt.color.textMuted }}>
              Strategy / <span style={{ color: mkt.color.textPrimary, fontWeight: 500 }}>FY26 Plan</span>
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
              {['Graph', 'Tree', 'List'].map((tab, i) => (
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
            <div style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${mkt.color.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: mkt.color.textMuted }}>⋯</div>
          </div>
          <GraphCanvas />
        </main>

        <aside style={{
          borderLeft: `1px solid ${mkt.color.hairline}`,
          background: mkt.color.white,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <ObjIcon type="decision" size={28} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: mkt.color.textPrimary, lineHeight: 1.3 }}>
                Adopt usage-based pricing for Tier 2
              </div>
              <div style={{ fontSize: 11, color: mkt.color.textMuted, marginTop: 2 }}>
                Decision · Open · Owner Mira K.
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: mkt.color.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Why this matters</div>
            <div style={{ fontSize: 12.5, color: mkt.color.textSecondary, lineHeight: 1.6 }}>
              Switching Tier 2 to usage-based unlocks{' '}
              <span style={{ background: mkt.color.accentLight, color: mkt.color.accentText, padding: '1px 5px', borderRadius: 3, fontWeight: 600, fontSize: 12 }}>$50k ACV</span>
              {' '}expansion per account and reduces churn risk for budget-constrained teams.
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: mkt.color.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Linked assets <span style={{ background: mkt.color.hairline2, color: mkt.color.textMuted, borderRadius: 99, padding: '0 5px', fontSize: 10 }}>7</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { type: 'okr', label: 'Q3 net retention ≥ 118%' },
                { type: 'signal', label: 'Churn signal — 3 mid-market' },
                { type: 'financial', label: 'Pricing model v4' },
                { type: 'competitive', label: 'Vercel pricing teardown' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 6px', borderRadius: 6, background: mkt.color.soft }}>
                  <ObjIcon type={item.type} size={14} />
                  <span style={{ fontSize: 12, color: mkt.color.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: mkt.color.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Risks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { type: 'problem', label: 'Forecast variance > ±15%' },
                { type: 'stakeholder', label: 'Finance team alignment' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 6px', borderRadius: 6, background: '#FFF7F7' }}>
                  <ObjIcon type={item.type} size={14} />
                  <span style={{ fontSize: 12, color: mkt.color.textSecondary }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
            <button style={{
              flex: 1,
              height: 32,
              background: mkt.color.accent,
              color: mkt.color.white,
              border: 'none',
              borderRadius: 7,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: mkt.font.sans,
            }}>
              Approve &amp; lock
            </button>
            <button style={{
              width: 32,
              height: 32,
              background: 'transparent',
              border: `1px solid ${mkt.color.hairline}`,
              borderRadius: 7,
              fontSize: 14,
              color: mkt.color.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>›</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
