'use client'

import { motion } from 'framer-motion'
import { mkt } from '../tokens'
import { Eyebrow } from './ui/Eyebrow'
import { DotGrid } from './ui/DotGrid'
import { CalloutBlock } from './ui/CalloutBlock'

// ─── Data ────────────────────────────────────────────────────────────────────

interface Phase {
  number: string
  title: string
  detail: string
  model: string
  preview: string[]
}

const PHASES: Phase[] = [
  {
    number: 'Phase 1',
    title: 'Check for issues',
    detail: '15 signal types evaluated',
    model: 'Haiku · lock time',
    preview: ['capability_gap', 'dependency_commoditising', 'means_end_confusion'],
  },
  {
    number: 'Phase 2',
    title: 'Identify patterns',
    detail: 'patterns extracted',
    model: 'Haiku · lock time',
    preview: ['structural_pattern', 'cross_asset_tension'],
  },
  {
    number: 'Phase 3',
    title: 'Run evaluations',
    detail: '4 run concurrently',
    model: 'Haiku · parallel',
    preview: ['coherence_evaluation', 'signal_consolidation', 'narrative_synthesis'],
  },
  {
    number: 'Phase 4',
    title: 'Produce a briefing',
    detail: 'schema-validated output',
    model: 'Haiku + Sonnet',
    preview: ['briefing_assembly', 'tier_classification'],
  },
]

const CONNECTORS: Array<{ label: string }> = [
  { label: '' },
  { label: '15 signals generated' },
  { label: 'patterns identified' },
  { label: '4 capabilities complete' },
]

// Animation delays for causal chain emergence
const PHASE_DELAYS = [0.2, 0.5, 0.8, 1.1]

// ─── Sub-components ──────────────────────────────────────────────────────────

function PhaseRow({ phase }: { phase: Phase }) {
  return (
    <div
      className="group relative"
      style={{
        backgroundColor: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '20px',
      }}
    >
      <div className="flex items-start justify-between">
        {/* Left: number + title + detail */}
        <div className="flex flex-col">
          <span
            className="font-mono"
            style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}
          >
            {phase.number}
          </span>
          <span
            className="font-semibold"
            style={{ fontSize: '16px', color: '#F8FAFC', lineHeight: 1.3 }}
          >
            {phase.title}
          </span>

          {/* Fixed-height hover preview — no layout shift */}
          <div
            className="h-[20px] overflow-hidden mt-2"
            style={{ lineHeight: '20px' }}
          >
            <span
              className="font-mono group-hover:opacity-100 transition-opacity duration-150"
              style={{
                fontSize: '11px',
                color: '#94A3B8',
                opacity: 0,
                display: 'block',
                whiteSpace: 'nowrap',
              }}
            >
              {phase.preview.join(' · ')}
            </span>
          </div>

          <span
            className="font-mono"
            style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}
          >
            {phase.detail}
          </span>
        </div>

        {/* Right: model tag */}
        <span
          className="font-mono flex-shrink-0 ml-4"
          style={{ fontSize: '11px', color: '#94A3B8', paddingTop: '2px' }}
        >
          {phase.model}
        </span>
      </div>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-start pl-4 py-1"
      style={{ minHeight: '28px' }}
    >
      <span style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1 }}>↓</span>
      {label ? (
        <span
          className="font-mono"
          style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function IntelligenceSection() {
  return (
    <section
      className="relative overflow-hidden py-28 lg:py-36"
      style={{ backgroundColor: '#0B0F19' }}
    >
      {/* Micro contrast: dot grid covers section */}
      <DotGrid opacity={0.08} fadeDirection="both" />

      <div
        className="max-w-[1280px] mx-auto px-8 relative z-10"
      >
        {/* Eyebrow */}
        <Eyebrow color={mkt.color.textMono}>How it works</Eyebrow>

        {/* Headline */}
        <h2
          className="mt-4"
          style={{
            fontSize: mkt.type.h2,
            color: '#F8FAFC',
            letterSpacing: mkt.tracking.h2,
            lineHeight: mkt.leading.h2,
            maxWidth: '720px',
            fontWeight: 600,
          }}
        >
          Every change is checked, immediately.
        </h2>

        {/* Anchor line */}
        <p
          className="mt-6"
          style={{
            fontSize: '17px',
            color: '#94A3B8',
            lineHeight: mkt.leading.body,
            maxWidth: '560px',
          }}
        >
          The system reviews what changed and highlights what needs attention.
        </p>

        {/* Causal chain — readable max-width */}
        <div className="max-w-[680px] mt-12">

          {/* Asset locked pill — delay 0 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, delay: 0 }}
          >
            <span
              className="inline-flex items-center font-mono"
              style={{
                backgroundColor: '#1F2937',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px',
                color: '#F8FAFC',
                fontSize: '13px',
              }}
            >
              Asset locked
            </span>
          </motion.div>

          {/* Phase rows + connectors */}
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: PHASE_DELAYS[i] }}
            >
              <Connector label={CONNECTORS[i].label} />
              <PhaseRow phase={phase} />
            </motion.div>
          ))}
        </div>

        {/* Two callout blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10 max-w-[680px]">
          <CalloutBlock variant="dark">
            <span
              style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC', display: 'block' }}
            >
              Consistency checks
            </span>
            <p
              className="font-mono leading-[1.8]"
              style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}
            >
              Runs a fixed set of rules.{'\n'}
              Same input, same result.
            </p>
          </CalloutBlock>

          <CalloutBlock variant="dark">
            <span
              style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC', display: 'block' }}
            >
              Issue classification
            </span>
            <p
              className="font-mono leading-[1.8]"
              style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}
            >
              Groups related problems{'\n'}
              before deeper analysis.
            </p>
          </CalloutBlock>
        </div>
      </div>
    </section>
  )
}
