'use client'

import { useState, useEffect } from 'react'
import { mkt } from '../../tokens'

type ToolType = 'read' | 'write' | 'metered'

interface Tool {
  name: string
  type: ToolType
  hot?: boolean
}

const TOOL_GROUPS: { label: string; tools: Tool[] }[] = [
  {
    label: 'Discovery',
    tools: [
      { name: 'list_strategies', type: 'read' },
      { name: 'list_assets', type: 'read' },
      { name: 'list_signals', type: 'read' },
      { name: 'search_assets', type: 'read' },
    ],
  },
  {
    label: 'Inspection',
    tools: [
      { name: 'strategy_briefing', type: 'read', hot: true },
      { name: 'inspect_asset', type: 'read' },
      { name: 'ask_strategy', type: 'read' },
      { name: 'challenge_brief', type: 'read' },
      { name: 'get_asset_data', type: 'read' },
    ],
  },
  {
    label: 'Write-back',
    tools: [
      { name: 'capture_signal', type: 'write' },
      { name: 'capture_assumption', type: 'write' },
      { name: 'track_risk', type: 'write' },
      { name: 'create_asset_link', type: 'write' },
      { name: 'resolve_finding', type: 'write' },
      { name: 'update_confidence', type: 'write' },
    ],
  },
  {
    label: 'Analytical',
    tools: [
      { name: 'run_coherence_check', type: 'metered' },
      { name: 'strategy_timeline', type: 'read' },
    ],
  },
]

const EXAMPLE_CALL = `> capture_signal(
    strategy_id: "fy26_plan",
    title:       "Competitor moved to usage pricing",
    severity:    "high",
    signal_type: "competitive",
    source: "mcp_session",
    confirm: false
  )

← preview · would create signal #s_4291
  status:    pending_review
  provenance: mcp_session · agent="claude-desktop"
  re-run with confirm=true to commit`

function ToolDot({ type }: { type: ToolType }) {
  const color =
    type === 'read' ? '#6B7280' : type === 'write' ? mkt.color.accent : mkt.color.amber
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  )
}

export function MCPMock() {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 550)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        background: mkt.color.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: mkt.font.sans,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${mkt.color.borderCard}`,
        boxShadow: mkt.shadow.window,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: `1px solid ${mkt.color.hairline}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: mkt.font.mono,
            background: '#EEF2FF',
            color: '#4F46E5',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            padding: '3px 7px',
            borderRadius: 4,
          }}
        >
          MCP
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: mkt.color.textPrimary }}>
          StrategyOS · tool catalog
        </span>
        <span
          style={{
            background: mkt.color.amberBg,
            color: mkt.color.amberText,
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 99,
            fontFamily: mkt.font.mono,
          }}
        >
          27 tools
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: mkt.color.successFg,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: mkt.font.mono,
              fontSize: 10.5,
              color: mkt.color.successFg,
            }}
          >
            Connected · Claude Desktop
          </span>
        </span>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', minHeight: 280 }}>
        {/* Left: tool list */}
        <div
          style={{
            borderRight: `1px solid ${mkt.color.hairline}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
          }}
        >
          {TOOL_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                borderRight: gi % 2 === 0 ? `1px solid ${mkt.color.hairline}` : 'none',
                borderBottom: gi < 2 ? `1px solid ${mkt.color.hairline}` : 'none',
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: mkt.color.textMuted,
                  marginBottom: 4,
                }}
              >
                {group.label}
              </span>
              {group.tools.map(tool => (
                <div
                  key={tool.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 6px',
                    borderRadius: 5,
                    background: tool.hot ? mkt.color.accentLight : 'transparent',
                  }}
                >
                  <ToolDot type={tool.type} />
                  <span
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: mkt.font.mono,
                      fontSize: 11.5,
                      fontWeight: tool.hot ? 500 : 400,
                      color: tool.hot ? mkt.color.accentText : mkt.color.textSecondary,
                    }}
                  >
                    {tool.name}
                  </span>
                  <span
                    style={{
                      textTransform: 'uppercase',
                      fontSize: 9.5,
                      color: mkt.color.textSubtle,
                      fontFamily: mkt.font.mono,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {tool.type}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: example call terminal */}
        <div style={{ background: '#FBFBFA', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${mkt.color.hairline}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                textTransform: 'uppercase',
                fontSize: 10.5,
                fontWeight: 600,
                color: mkt.color.textMuted,
                letterSpacing: '0.06em',
              }}
            >
              Example Call · Agent
            </span>
            <span
              style={{
                background: mkt.color.amberBg,
                color: mkt.color.amberText,
                fontFamily: mkt.font.mono,
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 4,
              }}
            >
              dry-run · confirm=false
            </span>
          </div>
          <pre
            style={{
              padding: 16,
              fontFamily: mkt.font.mono,
              fontSize: 11.5,
              lineHeight: '18px',
              whiteSpace: 'pre-wrap',
              flex: 1,
              margin: 0,
              color: mkt.color.textSecondary,
              overflowX: 'hidden',
            }}
          >
            {EXAMPLE_CALL}
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 13,
                background: mkt.color.accent,
                verticalAlign: 'middle',
                marginLeft: 2,
                opacity: cursorVisible ? 1 : 0,
              }}
            />
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: '#FAFAF9',
          borderTop: `1px solid ${mkt.color.hairline}`,
        }}
      >
        {[
          {
            title: 'Dry-run by default',
            desc: 'every write previews before it commits',
          },
          {
            title: 'Provenance on every write',
            desc: 'source · session_id · timestamp',
          },
          {
            title: 'No double-synthesis',
            desc: 'tools return data · the agent reasons',
          },
        ].map((item, i) => (
          <div
            key={item.title}
            style={{
              padding: '12px 16px',
              borderRight: i < 2 ? `1px solid ${mkt.color.hairline}` : 'none',
            }}
          >
            <div
              style={{ fontSize: 12, fontWeight: 600, color: mkt.color.textPrimary, marginBottom: 2 }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: 11.5, color: mkt.color.textMuted }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
