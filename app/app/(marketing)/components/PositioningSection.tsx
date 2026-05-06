'use client'

import { motion } from 'framer-motion'
import { mkt } from '../tokens'
import { Eyebrow } from './ui/Eyebrow'

const entrance = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const rows = [
  {
    left: 'Notion, Glean, Gong',
    centre: 'The structured context layer',
    right: 'Cascade, Quantive, Lattice',
    mono: true,
  },
  {
    left: 'Return what was mentioned',
    centre: 'Structure what was decided',
    right: 'Track whether you hit the number',
    mono: false,
  },
  {
    left: "Can't distinguish decision from draft",
    centre: 'Types, dates, provenance, lifecycle',
    right: "Can't tell you if it was the right number",
    mono: false,
    last: true,
  },
]

export default function PositioningSection() {
  return (
    <section
      style={{ backgroundColor: mkt.color.white }}
      className={mkt.space.sectionY}
    >
      <div className={`${mkt.space.containerMaxW} mx-auto px-8`}>
        {/* Header */}
        <motion.div
          variants={entrance}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14 space-y-4"
        >
          <Eyebrow>The stack</Eyebrow>
          <h2
            className="font-semibold"
            style={{
              fontSize: mkt.type.h2,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
              color: mkt.color.textPrimary,
              maxWidth: '560px',
            }}
          >
            Not a replacement. A legibility layer.
          </h2>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={entrance}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ borderColor: mkt.color.borderLight }}
          className="border overflow-hidden"
        >
          {/* Column headers */}
          <div className="grid grid-cols-3">
            {/* Left header */}
            <div
              className="p-4 lg:p-5"
              style={{
                borderBottom: `1px solid ${mkt.color.borderLight}`,
                borderRight: `1px solid ${mkt.color.borderLight}`,
              }}
            >
              <span
                className="font-semibold"
                style={{ fontSize: '14px', color: '#374151' }}
              >
                Retrieval tools
              </span>
            </div>

            {/* Centre header */}
            <div
              className="p-4 lg:p-5"
              style={{
                backgroundColor: '#EFF6FF',
                borderBottom: `1px solid #DBEAFE`,
                borderLeft: `1px solid #DBEAFE`,
                borderRight: `1px solid #DBEAFE`,
              }}
            >
              <span
                className="font-bold"
                style={{ fontSize: '14px', color: mkt.color.accent }}
              >
                StrategyOS
              </span>
            </div>

            {/* Right header */}
            <div
              className="p-4 lg:p-5"
              style={{
                borderBottom: `1px solid ${mkt.color.borderLight}`,
                borderLeft: `1px solid ${mkt.color.borderLight}`,
              }}
            >
              <span
                className="font-semibold"
                style={{ fontSize: '14px', color: '#374151' }}
              >
                OKR trackers
              </span>
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-3">
              {/* Left */}
              <div
                className="p-4 lg:p-5"
                style={{
                  borderBottom: row.last ? 'none' : `1px solid ${mkt.color.borderLight}`,
                  borderRight: `1px solid ${mkt.color.borderLight}`,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontFamily: row.mono ? 'ui-monospace, monospace' : undefined,
                  }}
                >
                  {row.left}
                </span>
              </div>

              {/* Centre */}
              <div
                className="p-4 lg:p-5"
                style={{
                  backgroundColor: '#EFF6FF',
                  borderBottom: row.last ? 'none' : `1px solid #DBEAFE`,
                  borderLeft: `1px solid #DBEAFE`,
                  borderRight: `1px solid #DBEAFE`,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#1D4ED8',
                    fontFamily: row.mono ? 'ui-monospace, monospace' : undefined,
                  }}
                >
                  {row.centre}
                </span>
              </div>

              {/* Right */}
              <div
                className="p-4 lg:p-5"
                style={{
                  borderBottom: row.last ? 'none' : `1px solid ${mkt.color.borderLight}`,
                  borderLeft: `1px solid ${mkt.color.borderLight}`,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontFamily: row.mono ? 'ui-monospace, monospace' : undefined,
                  }}
                >
                  {row.right}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Callout */}
        <motion.div
          variants={entrance}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-8 p-5"
          style={{
            border: '1px solid #DBEAFE',
            backgroundColor: '#EFF6FF',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#1D4ED8',
              maxWidth: '700px',
              lineHeight: mkt.leading.body,
            }}
          >
            As AI agents take on more operational work, they need access to reliable strategy.
            StrategyOS provides that context in a structured, queryable form.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
