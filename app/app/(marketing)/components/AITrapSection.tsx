'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { Eyebrow } from './ui/Eyebrow'

const STATEMENTS = [
  {
    claim: 'A model will confidently repeat a decision that changed last quarter.',
    consequence: 'It has no way to know what replaced it.',
  },
  {
    claim: 'It can connect ideas across documents.',
    consequence: "It can't tell which ones still matter.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function ScenarioDiagram() {
  return (
    <div
      className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px"
      style={{ backgroundColor: '#E2E8F0' }}
      aria-hidden="true"
    >
      {/* Left: without StrategyOS */}
      <div style={{ backgroundColor: '#F9FAFB', padding: '20px 20px 16px' }}>
        <span
          className="font-mono block mb-4"
          style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em' }}
        >
          without StrategyOS
        </span>

        <div className="space-y-1.5">
          {[
            { text: 'decision: Expand to Germany', date: 'Apr', dim: false },
            { text: 'logistics partner → commodity', date: 'Aug', dim: true },
            { text: 'strategy: unchanged', date: 'Dec', dim: true },
          ].map((row) => (
            <div
              key={row.text}
              className="flex items-center justify-between px-3 py-2"
              style={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                opacity: row.dim ? 0.5 : 1,
              }}
            >
              <span className="font-mono" style={{ fontSize: '11px', color: '#374151' }}>{row.text}</span>
              <span className="font-mono" style={{ fontSize: '10px', color: '#9CA3AF' }}>{row.date}</span>
            </div>
          ))}
        </div>

        <div
          className="mt-3 px-3 py-2.5"
          style={{ border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2' }}
        >
          <span className="font-mono block" style={{ fontSize: '10px', color: '#B91C1C' }}>no signal raised</span>
          <span className="block mt-0.5" style={{ fontSize: '12px', color: '#374151' }}>
            Bet expires on wrong premise.
          </span>
        </div>
      </div>

      {/* Right: with StrategyOS */}
      <div style={{ backgroundColor: '#EFF6FF', padding: '20px 20px 16px' }}>
        <span
          className="font-mono block mb-4"
          style={{ fontSize: '10px', color: '#2563EB', letterSpacing: '0.08em' }}
        >
          with StrategyOS
        </span>

        <div className="space-y-1.5">
          {[
            { text: 'decision: Expand to Germany', date: 'Apr' },
            { text: 'logistics partner → commodity', date: 'Aug' },
          ].map((row) => (
            <div
              key={row.text}
              className="flex items-center justify-between px-3 py-2"
              style={{ border: '1px solid #BFDBFE', backgroundColor: '#FFFFFF' }}
            >
              <span className="font-mono" style={{ fontSize: '11px', color: '#374151' }}>{row.text}</span>
              <span className="font-mono" style={{ fontSize: '10px', color: '#94A3B8' }}>{row.date}</span>
            </div>
          ))}
        </div>

        <div
          className="mt-1.5 px-3 py-2.5"
          style={{ border: '1px solid #FCD34D', backgroundColor: '#FFFBEB' }}
        >
          <span className="font-mono block" style={{ fontSize: '10px', color: '#92400E' }}>
            dependency_commoditising [signal]
          </span>
          <span className="block mt-0.5" style={{ fontSize: '12px', color: '#374151' }}>
            Auto-detected Aug · flagged in briefing
          </span>
        </div>

        <div
          className="mt-1.5 px-3 py-2.5"
          style={{ border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF' }}
        >
          <span className="font-mono block" style={{ fontSize: '10px', color: '#1D4ED8' }}>outcome</span>
          <span className="block mt-0.5" style={{ fontSize: '12px', color: '#111827' }}>
            Bet revised before Dec.
          </span>
        </div>
      </div>
    </div>
  )
}

export function AITrapSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{ backgroundColor: mkt.color.white }}
      className={`${mkt.space.sectionY}`}
    >
      <div className={`${mkt.space.containerMaxW} mx-auto px-8`}>
        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: mkt.motion.entranceDuration, ease: 'easeOut', delay: 0 }}
        >
          <Eyebrow>The AI tooling trap</Eyebrow>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{
            duration: mkt.motion.entranceDuration,
            ease: 'easeOut',
            delay: mkt.motion.stagger,
          }}
          className="mt-5 font-semibold"
          style={{
            fontSize: mkt.type.h2,
            letterSpacing: mkt.tracking.h2,
            lineHeight: mkt.leading.h2,
            color: mkt.color.textPrimary,
            maxWidth: '840px',
          }}
        >
          AI without structure amplifies mistakes — quickly.
        </motion.h2>

        {/* Body grid */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{
            duration: mkt.motion.entranceDuration,
            ease: 'easeOut',
            delay: mkt.motion.stagger * 2,
          }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Left col */}
          <div className="lg:col-span-7">
            {/* Blockquote */}
            <blockquote
              style={{ borderColor: mkt.color.accent }}
              className="border-l-[3px] pl-6"
            >
              <p
                style={{
                  fontSize: '18px',
                  lineHeight: mkt.leading.body,
                  color: mkt.color.textPrimary,
                }}
              >
                AI can explain your strategy.
                <br />
                It can&apos;t tell if it&apos;s still true.
              </p>
            </blockquote>

            {/* SVG diagram — bleeds slightly right on large screens */}
            <div className="mt-10 lg:translate-x-8">
              <ScenarioDiagram />
            </div>
          </div>

          {/* Right col */}
          <div className="lg:col-span-5">
            {STATEMENTS.map((s, i) => (
              <div key={i} className={i < STATEMENTS.length - 1 ? 'mb-8' : ''}>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: mkt.color.textPrimary,
                    fontWeight: 600,
                  }}
                >
                  {s.claim}
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: mkt.color.textSecondary,
                    fontWeight: 400,
                  }}
                >
                  {s.consequence}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
