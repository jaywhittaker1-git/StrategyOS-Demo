// Object identity icon — renders a small rounded badge for each of the 18 strategy asset types.
// Uses CSS custom properties from globals.css (--sos-obj-*-bg / --sos-obj-*-fg).

export const OBJ_TYPES = [
  { key: 'decision',    label: 'Decision',          glyph: '◆' },
  { key: 'wardley',     label: 'Wardley Map',        glyph: '↗' },
  { key: 'okr',         label: 'OKR',                glyph: '◎' },
  { key: 'systems',     label: 'Systems Map',        glyph: '⌘' },
  { key: 'stakeholder', label: 'Stakeholder',        glyph: '◐' },
  { key: 'problem',     label: 'Problem',            glyph: '?' },
  { key: 'insight',     label: 'Insight',            glyph: '✦' },
  { key: 'signal',      label: 'Signal',             glyph: '≈' },
  { key: 'experiment',  label: 'Experiment',         glyph: '△' },
  { key: 'task',        label: 'Task',               glyph: '✓' },
  { key: 'narrative',   label: 'Narrative',          glyph: '¶' },
  { key: 'financial',   label: 'Financial Model',    glyph: '$' },
  { key: 'capability',  label: 'Capability',         glyph: '◇' },
  { key: 'bets',        label: 'Bet',                glyph: '○' },
  { key: 'operating',   label: 'Operating Plan',     glyph: '▤' },
  { key: 'competitive', label: 'Competitive Brief',  glyph: '⊕' },
  { key: 'enterprise',  label: 'Enterprise Goal',    glyph: '▲' },
  { key: 'tdmap',       label: 'Tech Debt Map',      glyph: '⌗' },
] as const

export type ObjType = typeof OBJ_TYPES[number]['key']

interface ObjIconProps {
  type: ObjType | string
  size?: number
}

export function ObjIcon({ type, size = 28 }: ObjIconProps) {
  const entry = OBJ_TYPES.find(t => t.key === type)
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `var(--sos-obj-${type}-bg, #F3F4F6)`,
        color: `var(--sos-obj-${type}-fg, #6B7280)`,
        fontFamily: 'var(--font-jetbrains, monospace)',
        fontSize: size > 24 ? 13 : 11,
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {entry?.glyph ?? '•'}
    </span>
  )
}
