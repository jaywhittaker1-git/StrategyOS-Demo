'use client'

import { useState } from 'react'
import { mkt } from '../../tokens'
import { ObjIcon } from './ObjIcon'
import type { ObjType } from './ObjIcon'

// ─── Node positions ───────────────────────────────────────────────────────────

interface NodePos {
  x: number
  y: number
  label: string
}

// Canvas: 850×640. Nodes centered at (x,y) via translate(-50%,-50%).
// Vertical staggering within each tier gives visual breathing room without wide x-spacing.
const NODES: Record<string, NodePos> = {
  enterprise:  { x: 425, y: 60,  label: 'Enterprise Goal' },
  okr:         { x: 210, y: 185, label: 'OKR' },
  bets:        { x: 425, y: 165, label: 'Bet' },
  decision:    { x: 640, y: 185, label: 'Decision' },
  insight:     { x: 85,  y: 285, label: 'Insight' },
  problem:     { x: 235, y: 320, label: 'Problem' },
  narrative:   { x: 388, y: 300, label: 'Narrative' },
  operating:   { x: 550, y: 325, label: 'Operating Plan' },
  competitive: { x: 715, y: 290, label: 'Competitive Brief' },
  wardley:     { x: 65,  y: 415, label: 'Wardley Map' },
  systems:     { x: 198, y: 460, label: 'Systems Map' },
  financial:   { x: 340, y: 485, label: 'Financial Model' },
  capability:  { x: 482, y: 462, label: 'Capability' },
  tdmap:       { x: 628, y: 490, label: 'Tech Debt Map' },
  stakeholder: { x: 758, y: 442, label: 'Stakeholder' },
  signal:      { x: 228, y: 590, label: 'Signal' },
  experiment:  { x: 425, y: 610, label: 'Experiment' },
  task:        { x: 622, y: 590, label: 'Task' },
}

// ─── Edges ────────────────────────────────────────────────────────────────────

type Edge = [string, string]

const EDGES: Edge[] = [
  ['enterprise', 'okr'],
  ['enterprise', 'bets'],
  ['enterprise', 'decision'],
  ['okr', 'experiment'],
  ['okr', 'task'],
  ['bets', 'capability'],
  ['bets', 'wardley'],
  ['bets', 'financial'],
  ['bets', 'systems'],
  ['decision', 'narrative'],
  ['decision', 'competitive'],
  ['decision', 'stakeholder'],
  ['decision', 'financial'],
  ['decision', 'experiment'],
  ['insight', 'decision'],
  ['insight', 'problem'],
  ['problem', 'experiment'],
  ['experiment', 'insight'],
  ['signal', 'decision'],
  ['signal', 'okr'],
  ['signal', 'problem'],
  ['wardley', 'capability'],
  ['wardley', 'decision'],
  ['financial', 'okr'],
  ['capability', 'bets'],
  ['operating', 'task'],
  ['operating', 'okr'],
  ['tdmap', 'capability'],
  ['stakeholder', 'decision'],
  ['narrative', 'okr'],
  ['task', 'experiment'],
  ['competitive', 'decision'],
]

// ─── Asset detail data ────────────────────────────────────────────────────────

interface AssetDetail {
  desc: string
  why: string
  fields: string[]
  links: string[]
  wrong: string
}

const ASSET_DETAIL: Record<string, AssetDetail> = {
  decision: {
    desc: 'A choice the team made or is about to commit to. Captures what was decided, the reasoning behind it, what alternatives were rejected, and who owns it going forward.',
    why: 'Every downstream asset — OKRs, experiments, narratives — traces back to a decision. Without the premises visible, assumptions become invisible.',
    fields: ['status', 'owner', 'premises[]', 'alternatives[]', 'reversibility', 'deadline', 'rationale'],
    links: ['okr', 'experiment', 'narrative', 'stakeholder', 'financial'],
    wrong: 'Finding: Finance model moved to ±18% variance since approval — premises were never updated. Finding: No kill criteria set. Owner field is blank on a locked decision with 3 downstream OKRs.',
  },
  okr: {
    desc: 'An objective with measurable key results. Anchors team effort to strategic intent and provides the quantitative surface for signal contradiction.',
    why: 'OKRs are the primary translation layer between bets and measurable work. They make strategy falsifiable.',
    fields: ['objective', 'key_results[]', 'owner', 'horizon', 'confidence', 'parent_bet'],
    links: ['enterprise', 'experiment', 'task', 'financial', 'narrative'],
    wrong: 'Signal: Mid-market churn contradicts the 118% NRR key result. Finding: Two OKRs claim net_revenue_retention as their primary metric. No experiment linked to validate the key result is reachable.',
  },
  enterprise: {
    desc: 'The non-negotiable goal everything else ladders up to. Sets the time horizon and the guardrails that make choices coherent.',
    why: 'Without a clear north star, goals proliferate and contradict each other. The enterprise goal is the single shared anchor.',
    fields: ['statement', 'horizon', 'guardrails[]', 'owner'],
    links: ['okr', 'bets', 'decision'],
    wrong: "Finding: Three active bets have no path back to this goal. Signal: Q3 board deck uses a different north star than what's locked here — misalignment is propagating.",
  },
  bets: {
    desc: 'A multi-quarter wager on a direction. Carries the thesis, the capital allocation, the milestones, and the criteria that would make the team stop.',
    why: 'Bets make risk visible and time-bounded. They force the question: what would it take to change our mind?',
    fields: ['thesis', 'horizon', 'investment', 'kill_criteria', 'milestones[]', 'confidence'],
    links: ['capability', 'wardley', 'financial', 'systems'],
    wrong: 'Finding: This bet implies a data platform capability not on the capability map. Signal: Kill threshold (40% pilot conversion) was hit 3 weeks ago — no decision made. Investment contradicts the locked financial model.',
  },
  experiment: {
    desc: 'A test with a hypothesis, a success metric, and a deadline. Runs, fails, or earns an insight that updates the strategy.',
    why: 'Experiments close the loop between strategic intent and observed reality. They are how the system learns.',
    fields: ['hypothesis', 'metric', 'deadline', 'result', 'status', 'owner'],
    links: ['okr', 'decision', 'insight', 'task'],
    wrong: 'Finding: Deadline passed 18 days ago — no result recorded, no successor insight created. Signal: The success metric (time-to-value < 5 min) has no measurement instrumentation in place.',
  },
  signal: {
    desc: 'A weak signal from the world — a data point, a customer quote, a market move — that may matter to a locked asset. Carries severity, type, and a lifecycle state.',
    why: 'Signals are how external reality enters the system. Without a typed inbox, important signals go unacknowledged and strategies become stale.',
    fields: ['title', 'severity', 'source', 'signal_type', 'confidence', 'state', 'linked_assets[]'],
    links: ['decision', 'okr', 'problem'],
    wrong: 'Finding: Open for 34 days with no acknowledgement. No asset linked — this signal has no strategic home. A similar signal from Q2 was dismissed without recording why.',
  },
  insight: {
    desc: "Something the team now believes, backed by the evidence that earned it. Represents the team's working model of how the world actually operates.",
    why: 'Insights are the distilled output of experiments and signals. They justify decisions and make reasoning inspectable.',
    fields: ['claim', 'evidence[]', 'confidence', 'source_experiment'],
    links: ['decision', 'problem'],
    wrong: 'Finding: Claim references a Q1 experiment; three contradicting signals have arrived since with no update. No evidence linked — this is assertion, not insight.',
  },
  problem: {
    desc: "A well-formed question the team doesn't yet know the answer to. Stays open until evidence resolves it — or until the team decides it's no longer worth asking.",
    why: 'Problems make open questions explicit and traceable. They prevent premature closure and create a forcing function for experiments.',
    fields: ['question', 'owner', 'state', 'linked_signals[]'],
    links: ['experiment', 'insight', 'signal'],
    wrong: "Finding: Open for 11 weeks with no experiment underway. Signal: Two signals reference this problem but neither is acknowledged. No owner assigned since last quarter's reorg.",
  },
  capability: {
    desc: 'Something the team can do today. Maps to the bets that depend on it, and exposes the dependencies that need to be built or acquired.',
    why: 'Capabilities are the operational reality beneath strategic ambition. A bet without a capability map is wishful thinking.',
    fields: ['name', 'maturity', 'owner', 'depends_on[]', 'linked_bets[]'],
    links: ['bets', 'tdmap'],
    wrong: "Finding: The enterprise data platform bet depends on this capability but it's marked stale. Signal: Maturity was set at level 2 six months ago — three bets now assume level 3.",
  },
  financial: {
    desc: 'A model — assumptions, ranges, sensitivities — connected to the bets and OKRs it underwrites. Makes the economic logic of the strategy explicit.',
    why: 'Financial models ground strategy in resource reality. They surface the assumptions that need to be tested first.',
    fields: ['assumptions[]', 'ranges', 'sensitivities[]', 'version', 'linked_bets[]'],
    links: ['bets', 'okr', 'decision'],
    wrong: 'Signal: Finance flagged variance band at ±18% — model not updated. Finding: Price elasticity assumption contradicts open churn signal. Model is 74 days old with two active bets relying on it.',
  },
  wardley: {
    desc: 'A map of strategic components by visibility and evolution stage. Shows the competitive terrain and where commoditisation is heading.',
    why: 'Wardley Maps make landscape movements visible before they arrive. They surface build-vs-buy decisions and evolution risks.',
    fields: ['components[]', 'evolution_stages', 'anchor', 'version'],
    links: ['bets', 'capability', 'decision'],
    wrong: 'Signal: A competitor commoditised the "custom integration" component — it should be in Products, not Genesis. Finding: No anchor defined. Map has not been reviewed since the market shifted in Q2.',
  },
  systems: {
    desc: 'A causal loop map showing how parts of the business reinforce or balance each other. Surfaces leverage points and unintended consequences.',
    why: 'Systems maps reveal the dynamics that linear plans miss. They prevent solutions that create new problems downstream.',
    fields: ['nodes[]', 'loops[]', 'stocks[]', 'leverage_points[]'],
    links: ['bets', 'operating'],
    wrong: 'Finding: The sales velocity reinforcing loop has no evidence linking the causal arrow. Signal: An ops report contradicts the predicted compounding effect — loop direction may be wrong.',
  },
  competitive: {
    desc: "What a specific competitor is doing and why it matters to the strategy. Renews on a schedule so it doesn't become a snapshot that misleads.",
    why: 'Competitive intelligence makes external pressure visible inside the strategy system. It prevents assumptions about moats from going unchallenged.',
    fields: ['competitor', 'moves[]', 'implications', 'renewed_at', 'threat_level'],
    links: ['decision', 'bets'],
    wrong: "Finding: Last renewed 73 days ago; two major product announcements since. Signal: A sales loss to this competitor was logged — brief hasn't absorbed the implication. Threat level is unset.",
  },
  stakeholder: {
    desc: 'A person and what they care about. Surfaces alignment risks and makes the human landscape of a decision visible before it becomes a blocker.',
    why: 'High-stakes decisions fail on stakeholder misalignment as often as they fail on strategy. Making it explicit makes it manageable.',
    fields: ['name', 'role', 'interests[]', 'alignment', 'concerns[]'],
    links: ['decision', 'okr'],
    wrong: 'Finding: CFO is required for sign-off on this decision — alignment is marked "unknown". Signal: Two prior similar decisions were reversed at the CFO stage; pattern not surfaced in the brief.',
  },
  narrative: {
    desc: 'The story behind the strategy — the why, the journey, the premises that make the direction coherent. Updated when premises shift, not when slides do.',
    why: 'Narratives are how strategy travels across the organisation. Without a maintained narrative, people fill the gap with rumour.',
    fields: ['headline', 'premises[]', 'version', 'last_updated'],
    links: ['decision', 'okr'],
    wrong: 'Finding: The "geographic expansion" premise was removed from the active bet 6 weeks ago but still appears here. Signal: Three team members used the old framing in last week\'s all-hands.',
  },
  operating: {
    desc: 'How the organisation runs against the plan. Captures cadences, owners, and the review surfaces where strategy is interrogated.',
    why: 'An operating plan closes the loop between strategic intent and execution rhythm. Without it, strategy lives in documents but not in meetings.',
    fields: ['cadences[]', 'owners[]', 'review_surfaces[]', 'last_reviewed'],
    links: ['okr', 'task', 'systems'],
    wrong: 'Finding: Weekly strategy review is on the calendar but meeting notes reference no strategy asset. Signal: Last reviewed 94 days ago — two OKR cycles have run since with no cadence update.',
  },
  task: {
    desc: 'A concrete action with an owner and a due date. Always traces up to a goal — it has no meaning without that lineage.',
    why: 'Tasks without goal lineage create motion without direction. The link back to an OKR or experiment is what makes work strategic.',
    fields: ['title', 'owner', 'due', 'status', 'parent_goal'],
    links: ['okr', 'experiment', 'operating'],
    wrong: "Finding: Not linked to any OKR or experiment — this task has no strategic lineage. Signal: Overdue by 12 days, no replan. Owner was reassigned in the last reorg and field hasn't been updated.",
  },
  tdmap: {
    desc: "Technical debt mapped as a strategic surface. Shows the speed-cost of every shortcut, what it's blocking, and what it would take to retire it.",
    why: 'Tech debt is a hidden tax on strategic velocity. Making it visible as a strategic asset forces explicit trade-off conversations.',
    fields: ['items[]', 'interest_rate', 'blast_radius', 'retirement_plan'],
    links: ['capability'],
    wrong: 'Signal: Auth service debt compounding at 23% per quarter — no retirement plan. Finding: "Mobile API v2" blocks the new pricing bet but has no assigned owner or delivery timeline.',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getConnectedNodes(nodeId: string): Set<string> {
  const connected = new Set<string>()
  for (const [a, b] of EDGES) {
    if (a === nodeId) connected.add(b)
    if (b === nodeId) connected.add(a)
  }
  return connected
}

function isEdgeActive(edge: Edge, activeId: string | null): boolean {
  if (!activeId) return false
  return edge[0] === activeId || edge[1] === activeId
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssetGraph() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string>('decision')

  const activeId = hovered ?? selected
  const connectedNodes = getConnectedNodes(activeId)

  function getNodeState(nodeId: string): 'active' | 'connected' | 'selected' | 'dim' | 'normal' {
    if (hovered) {
      if (nodeId === hovered) return 'active'
      if (connectedNodes.has(nodeId)) return 'connected'
      return 'dim'
    }
    if (nodeId === selected) return 'selected'
    if (connectedNodes.has(nodeId)) return 'connected'
    return 'normal'
  }

  function nodeStyle(nodeId: string): React.CSSProperties {
    const state = getNodeState(nodeId)
    const base: React.CSSProperties = {
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      left: NODES[nodeId].x,
      top: NODES[nodeId].y,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '6px 12px 6px 6px',
      background: mkt.color.white,
      border: `1px solid ${mkt.color.borderCard}`,
      borderRadius: 99,
      fontSize: 11.5,
      cursor: 'pointer',
      fontFamily: mkt.font.sans,
      color: mkt.color.textPrimary,
      transition: 'all 0.12s ease',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      boxShadow: mkt.shadow.node,
      outline: 'none',
    }
    if (state === 'active') {
      return {
        ...base,
        border: `1px solid ${mkt.color.accent}`,
        boxShadow: `0 0 0 3px ${mkt.color.accentLight}, ${mkt.shadow.node}`,
        transform: 'translate(-50%, -50%) scale(1.04)',
      }
    }
    if (state === 'connected') {
      return {
        ...base,
        border: `1px solid ${mkt.color.accentActive}`,
      }
    }
    if (state === 'selected') {
      return {
        ...base,
        background: mkt.color.accentLight,
        border: `1px solid ${mkt.color.accent}`,
      }
    }
    if (state === 'dim') {
      return { ...base, opacity: 0.35 }
    }
    return base
  }

  function edgeStyle(edge: Edge): React.CSSProperties {
    const active = isEdgeActive(edge, activeId)
    if (active) {
      return { stroke: mkt.color.accent, strokeWidth: 1.4, opacity: 1 }
    }
    if (hovered || selected) {
      return { stroke: '#D8D8D6', strokeWidth: 0.8, opacity: 0.18 }
    }
    return { stroke: '#D8D8D6', strokeWidth: 0.8, opacity: 0.45 }
  }

  const detail = ASSET_DETAIL[selected]
  const nodeName = NODES[selected]?.label ?? selected

  return (
    <section
      style={{
        fontFamily: mkt.font.sans,
        border: `1px solid ${mkt.color.hairline}`,
        borderRadius: 10,
        boxShadow: mkt.shadow.window,
        overflow: 'hidden',
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          height: 32,
          background: '#FAFAFA',
          borderBottom: `1px solid ${mkt.color.hairline}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
        }}
      >
        {['#E5E7EB', '#E5E7EB', '#E5E7EB'].map((c, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: c,
              display: 'inline-block',
            }}
          />
        ))}
        <span
          style={{
            fontSize: 12,
            color: mkt.color.textMuted,
            marginLeft: 4,
          }}
        >
          Ontology · 18 assets · 70+ relationships
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: mkt.font.mono,
            fontSize: 11,
            color: mkt.color.textSubtle,
          }}
        >
          {hovered
            ? `${getConnectedNodes(hovered).size} connected`
            : selected
            ? `${getConnectedNodes(selected).size} connected`
            : 'hover any node'}
        </span>
      </div>

      {/* Content: graph + rail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px' }}>
        {/* Graph canvas */}
        <div
          style={{
            position: 'relative',
            height: 640,
            background: mkt.color.graph,
            backgroundImage: `radial-gradient(circle, #C8C8C6 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            overflow: 'hidden',
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Inner fixed-width canvas */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 850,
              height: 640,
            }}
          >
            {/* SVG edges */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              preserveAspectRatio="none"
            >
              {EDGES.map((edge, i) => {
                const a = NODES[edge[0]]
                const b = NODES[edge[1]]
                if (!a || !b) return null
                const es = edgeStyle(edge)
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={es.stroke as string}
                    strokeWidth={es.strokeWidth as number}
                    opacity={es.opacity as number}
                  />
                )
              })}
            </svg>

            {/* Nodes */}
            {Object.entries(NODES).map(([id, pos]) => (
              <button
                key={id}
                style={nodeStyle(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(id)}
              >
                <ObjIcon type={id as ObjType} size={26} />
                <span>{pos.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail rail */}
        <div
          style={{
            background: mkt.color.white,
            borderLeft: `1px solid ${mkt.color.hairline}`,
            padding: '24px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            overflowY: 'auto',
            maxHeight: 640,
          }}
        >
          {detail ? (
            <>
              {/* Head */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ObjIcon type={selected as ObjType} size={36} />
                </div>
                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 600,
                    color: mkt.color.textPrimary,
                    letterSpacing: mkt.tracking.tight,
                    lineHeight: 1.2,
                  }}
                >
                  {nodeName}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: '20px',
                  color: mkt.color.textSecondary,
                }}
              >
                {detail.desc}
              </p>

              {/* Why it matters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 10,
                    fontWeight: 500,
                    color: mkt.color.textSubtle,
                    letterSpacing: '0.08em',
                  }}
                >
                  Why it matters
                </span>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: '18px', color: mkt.color.textSecondary }}>
                  {detail.why}
                </p>
              </div>

              {/* Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 10,
                    color: mkt.color.textSubtle,
                    letterSpacing: '0.08em',
                  }}
                >
                  Fields
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {detail.fields.map(f => (
                    <span
                      key={f}
                      style={{
                        fontFamily: mkt.font.mono,
                        fontSize: 10.5,
                        background: '#F3F4F6',
                        color: mkt.color.textSecondary,
                        borderRadius: 4,
                        padding: '4px 7px',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Common links */}
              {detail.links.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: 10,
                      color: mkt.color.textSubtle,
                      letterSpacing: '0.08em',
                    }}
                  >
                    Common links
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {detail.links.map(linkId => (
                      <button
                        key={linkId}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '4px 8px 4px 4px',
                          background: mkt.color.accentLight,
                          border: `1px solid ${mkt.color.accentActive}`,
                          borderRadius: 99,
                          fontSize: 11,
                          color: mkt.color.accentText,
                          cursor: 'pointer',
                          fontFamily: mkt.font.sans,
                        }}
                        onMouseEnter={() => setHovered(linkId)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setSelected(linkId)}
                      >
                        <ObjIcon type={linkId as ObjType} size={16} />
                        {NODES[linkId]?.label ?? linkId}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* How it can be wrong */}
              <div
                style={{
                  background: mkt.color.amberBg,
                  borderLeft: `2px solid ${mkt.color.warningFg}`,
                  borderRadius: '0 6px 6px 0',
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 10,
                    fontWeight: 500,
                    color: mkt.color.amberText,
                    letterSpacing: '0.06em',
                    marginBottom: 5,
                  }}
                >
                  How it can be wrong
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: '17px',
                    color: mkt.color.amberText,
                  }}
                >
                  {detail.wrong}
                </p>
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: mkt.color.textSubtle,
                fontSize: 13,
              }}
            >
              Select a node
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
