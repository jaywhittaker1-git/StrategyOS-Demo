'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useCallback, useMemo } from 'react'
import { mkt } from '../tokens'
import { Eyebrow } from './ui/Eyebrow'
import { DataLabel } from './ui/DataLabel'

// ─── Data ────────────────────────────────────────────────────────────────────

const STAGES = [
  'FRAMING',
  'LANDSCAPE',
  'STRATEGY',
  'ARCHITECTURE',
  'DELIVERY',
  'SYNTHESIS',
] as const

type Stage = (typeof STAGES)[number]

interface Asset {
  id: string
  name: string
  stage: Stage
  purpose: string
  signals: number
}

const ASSETS: Asset[] = [
  // FRAMING
  { id: 'problem-frame', name: 'Problem Frame', stage: 'FRAMING', purpose: 'Defines the core problem being solved', signals: 3 },
  { id: 'decision-stack', name: 'Decision Stack', stage: 'FRAMING', purpose: 'Captures key decisions, rationale, confidence', signals: 6 },
  // LANDSCAPE
  { id: 'wardley-map', name: 'Wardley Map', stage: 'LANDSCAPE', purpose: 'Maps components by evolution and value chain', signals: 5 },
  { id: 'systems-map', name: 'Systems Map', stage: 'LANDSCAPE', purpose: 'Models feedback loops and system dynamics', signals: 4 },
  { id: 'stakeholder-arch', name: 'Stakeholder Architecture', stage: 'LANDSCAPE', purpose: 'Structures relationships, influence, interests', signals: 4 },
  // STRATEGY
  { id: 'strategic-bets', name: 'Strategic Bets', stage: 'STRATEGY', purpose: 'Defines high-conviction, time-bounded bets', signals: 5 },
  { id: 'okr-cascade', name: 'OKR Cascade', stage: 'STRATEGY', purpose: 'Translates bets into measurable objectives', signals: 7 },
  // ARCHITECTURE
  { id: 'capability-map', name: 'Capability Map', stage: 'ARCHITECTURE', purpose: 'Inventories capabilities against strategy', signals: 4 },
  { id: 'operating-model', name: 'Operating Model', stage: 'ARCHITECTURE', purpose: 'Defines how the organisation delivers', signals: 5 },
  { id: 'enterprise-arch', name: 'Enterprise Architecture', stage: 'ARCHITECTURE', purpose: 'Maps systems, data flows, tech choices', signals: 3 },
  // DELIVERY
  { id: 'initiatives', name: 'Initiatives', stage: 'DELIVERY', purpose: 'Packages OKRs into executable work', signals: 4 },
  { id: 'impl-roadmap', name: 'Implementation Roadmap', stage: 'DELIVERY', purpose: 'Sequences work with dependencies', signals: 3 },
  { id: 'financial-model', name: 'Financial Model', stage: 'DELIVERY', purpose: 'Projects cost, revenue, unit economics', signals: 4 },
  // SYNTHESIS
  { id: 'customer-journey', name: 'Customer Journey', stage: 'SYNTHESIS', purpose: 'Maps experience across touchpoints', signals: 3 },
  { id: 'narrative', name: 'Narrative', stage: 'SYNTHESIS', purpose: 'Synthesises strategy into coherent story', signals: 2 },
  { id: 'strategic-summary', name: 'Strategic Summary', stage: 'SYNTHESIS', purpose: 'Distils the full strategy for stakeholders', signals: 3 },
]

const CONNECTIONS: Record<string, string[]> = {
  'decision-stack': ['okr-cascade', 'strategic-bets', 'problem-frame', 'wardley-map'],
  'wardley-map': ['capability-map', 'systems-map', 'stakeholder-arch'],
  'strategic-bets': ['okr-cascade', 'initiatives'],
  'okr-cascade': ['initiatives', 'financial-model'],
  'capability-map': ['operating-model', 'enterprise-arch'],
  'stakeholder-arch': ['systems-map', 'customer-journey'],
  'initiatives': ['financial-model', 'impl-roadmap'],
  'problem-frame': ['decision-stack', 'wardley-map'],
  'systems-map': ['stakeholder-arch', 'operating-model'],
  'operating-model': ['capability-map', 'enterprise-arch'],
  'financial-model': ['initiatives', 'okr-cascade'],
  'impl-roadmap': ['initiatives', 'enterprise-arch'],
  'narrative': ['strategic-summary', 'decision-stack'],
  'strategic-summary': ['narrative', 'okr-cascade'],
  'customer-journey': ['stakeholder-arch', 'narrative'],
  'enterprise-arch': ['capability-map', 'operating-model'],
}

// ─── Entrance animation ───────────────────────────────────────────────────────

const tileVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

// ─── Connection line SVG ──────────────────────────────────────────────────────

interface Rect { left: number; top: number; width: number; height: number }

function centerOf(r: Rect): { x: number; y: number } {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

interface ConnectionLinesProps {
  hoveredId: string
  tileRects: Map<string, Rect>
  containerRect: Rect
}

function ConnectionLines({ hoveredId, tileRects, containerRect }: ConnectionLinesProps) {
  const related = CONNECTIONS[hoveredId] ?? []
  const fromRect = tileRects.get(hoveredId)
  if (!fromRect) return null

  const from = centerOf({
    left: fromRect.left - containerRect.left,
    top: fromRect.top - containerRect.top,
    width: fromRect.width,
    height: fromRect.height,
  })

  const lines = related.flatMap((relId) => {
    const toRect = tileRects.get(relId)
    if (!toRect) return []
    const to = centerOf({
      left: toRect.left - containerRect.left,
      top: toRect.top - containerRect.top,
      width: toRect.width,
      height: toRect.height,
    })
    return [{ id: relId, x1: from.x, y1: from.y, x2: to.x, y2: to.y }]
  })

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: containerRect.width, height: containerRect.height }}
      aria-hidden="true"
    >
      <defs>
        <marker
          id="conn-arrow"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <path d="M0,0 L0,5 L5,2.5 z" fill={mkt.color.accent} opacity="0.7" />
        </marker>
      </defs>
      {lines.map((l) => (
        <motion.line
          key={l.id}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={mkt.color.accent}
          strokeWidth="1"
          opacity="0.7"
          markerEnd="url(#conn-arrow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

// ─── Asset tile ───────────────────────────────────────────────────────────────

interface TileProps {
  asset: Asset
  index: number
  hoveredId: string | null
  isRelated: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  tileRef: (el: HTMLDivElement | null) => void
  inView: boolean
  staggerDelay: number
}

function AssetTile({
  asset,
  hoveredId,
  isRelated,
  onMouseEnter,
  onMouseLeave,
  tileRef,
  inView,
  staggerDelay,
}: TileProps) {
  const isHovered = hoveredId === asset.id
  const isActive = hoveredId === null || isHovered || isRelated
  const isDimmed = hoveredId !== null && !isHovered && !isRelated

  return (
    <motion.div
      ref={tileRef}
      variants={tileVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.3, ease: 'easeOut', delay: staggerDelay }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="min-h-[96px] p-4 lg:p-5 cursor-default flex flex-col"
      style={{
        border: `1px solid ${isHovered ? mkt.color.accent : mkt.color.borderLight}`,
        backgroundColor: mkt.color.white,
        borderRadius: '6px',
        opacity: isDimmed ? 0.35 : 1,
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'opacity 150ms ease, transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
        boxShadow: isHovered
          ? `0 0 0 1px ${mkt.color.accent}33, 0 4px 12px rgba(37,99,235,0.08)`
          : isRelated
          ? `0 0 0 1px ${mkt.color.accent}22`
          : 'none',
        position: 'relative',
        zIndex: isHovered ? 2 : isRelated ? 1 : 0,
      }}
    >
      <span
        className="font-semibold block"
        style={{ fontSize: '14px', color: mkt.color.textPrimary, lineHeight: '1.3' }}
      >
        {asset.name}
      </span>
      <span
        className="block mt-1 leading-snug flex-1"
        style={{
          fontSize: '12px',
          color: isActive ? mkt.color.textSecondary : mkt.color.textMono,
          transition: 'color 150ms ease',
        }}
      >
        {asset.purpose}
      </span>
      <span
        className="font-mono block mt-3"
        style={{ fontSize: '10px', color: mkt.color.textMono }}
      >
        {asset.signals} signals
      </span>
    </motion.div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function AssetsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Store tile DOM rects by asset id
  const tileElements = useRef<Map<string, HTMLDivElement>>(new Map())

  const setTileRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      tileElements.current.set(id, el)
    } else {
      tileElements.current.delete(id)
    }
  }, [])

  // Snapshot rects on hover — avoids stale layout reads
  const [snapshotRects, setSnapshotRects] = useState<Map<string, Rect>>(new Map())
  const [containerRect, setContainerRect] = useState<Rect | null>(null)

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredId(id)

    // Capture all tile rects relative to the document
    const rects = new Map<string, Rect>()
    tileElements.current.forEach((el, assetId) => {
      const r = el.getBoundingClientRect()
      rects.set(assetId, { left: r.left, top: r.top, width: r.width, height: r.height })
    })
    setSnapshotRects(rects)

    if (gridRef.current) {
      const gr = gridRef.current.getBoundingClientRect()
      setContainerRect({ left: gr.left, top: gr.top, width: gr.width, height: gr.height })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
    setSnapshotRects(new Map())
    setContainerRect(null)
  }, [])

  // Build related set for the hovered asset
  const relatedSet = useMemo<Set<string>>(() => {
    if (!hoveredId) return new Set()
    return new Set(CONNECTIONS[hoveredId] ?? [])
  }, [hoveredId])

  // Group assets by stage
  const assetsByStage = useMemo<Map<Stage, Asset[]>>(() => {
    const map = new Map<Stage, Asset[]>()
    for (const stage of STAGES) map.set(stage, [])
    for (const asset of ASSETS) {
      map.get(asset.stage)!.push(asset)
    }
    return map
  }, [])

  // Assign stagger indices across all tiles in DOM order
  const staggerIndex = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>()
    let i = 0
    for (const stage of STAGES) {
      for (const asset of assetsByStage.get(stage) ?? []) {
        map.set(asset.id, i++)
      }
    }
    return map
  }, [assetsByStage])

  return (
    <section
      ref={sectionRef}
      className={`${mkt.space.sectionY}`}
      style={{ backgroundColor: mkt.color.white }}
    >
      <div className={`${mkt.space.containerMaxW} mx-auto px-8`}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: mkt.motion.entranceDuration, ease: 'easeOut' }}
        >
          <Eyebrow>What gets structured</Eyebrow>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: mkt.motion.entranceDuration, ease: 'easeOut', delay: 0.08 }}
          className="mt-5 font-semibold"
          style={{
            fontSize: mkt.type.h2,
            letterSpacing: mkt.tracking.h2,
            lineHeight: mkt.leading.h2,
            color: mkt.color.textPrimary,
            maxWidth: '600px',
          }}
        >
          The full strategy, broken into working parts.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: mkt.motion.entranceDuration, ease: 'easeOut', delay: 0.12 }}
          className="mt-3"
          style={{
            fontSize: '17px',
            color: mkt.color.textSecondary,
            lineHeight: mkt.leading.body,
            maxWidth: '560px',
          }}
        >
          Each part is defined, connected, and continuously evaluated.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: mkt.motion.entranceDuration, ease: 'easeOut', delay: 0.16 }}
          className="mt-4 flex gap-6 flex-wrap"
        >
          <DataLabel>16 asset types</DataLabel>
          <DataLabel>6 stages</DataLabel>
          <DataLabel>15 signal types generated across the graph</DataLabel>
        </motion.div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="flex gap-3 lg:gap-4 overflow-x-auto mt-12 pb-2"
          style={{ position: 'relative' }}
        >
          {STAGES.map((stage) => {
            const stageAssets = assetsByStage.get(stage) ?? []
            return (
              <div
                key={stage}
                className="flex-1"
                style={{ minWidth: '152px' }}
              >
                {/* Stage header */}
                <div
                  className="mb-3"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: mkt.color.textMono,
                    userSelect: 'none',
                  }}
                >
                  {stage}
                </div>

                {/* Tiles */}
                <div className="flex flex-col gap-2">
                  {stageAssets.map((asset) => (
                    <AssetTile
                      key={asset.id}
                      asset={asset}
                      index={staggerIndex.get(asset.id) ?? 0}
                      hoveredId={hoveredId}
                      isRelated={relatedSet.has(asset.id)}
                      onMouseEnter={() => handleMouseEnter(asset.id)}
                      onMouseLeave={handleMouseLeave}
                      tileRef={setTileRef(asset.id)}
                      inView={inView}
                      staggerDelay={0.16 + (staggerIndex.get(asset.id) ?? 0) * 0.03}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* SVG connection overlay */}
          {hoveredId !== null && containerRect !== null && (
            <ConnectionLines
              hoveredId={hoveredId}
              tileRects={snapshotRects}
              containerRect={containerRect}
            />
          )}
        </div>

        {/* Hover hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-5"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '11px',
            color: mkt.color.textMono,
            letterSpacing: '0.04em',
          }}
        >
          Hover any asset to see its connections across the graph.
        </motion.p>

      </div>
    </section>
  )
}
