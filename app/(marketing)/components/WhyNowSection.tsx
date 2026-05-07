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
    number: '01',
    claim: 'More decisions are being made, faster.',
    detail: 'They change before anyone fully absorbs them.',
  },
  {
    number: '02',
    claim: 'AI is being used across everyday work.',
    detail: 'It relies on whatever context it\'s given — good or bad.',
  },
  {
    number: '03',
    claim: 'Strategy hasn\'t kept up.',
    detail: 'It\'s still stored as documents, not something that can be checked or updated in real time.',
  },
]

export default function WhyNowSection() {
  return (
    <section
      style={{ backgroundColor: mkt.color.soft }}
      className={mkt.space.sectionY}
    >
      <div className={`${mkt.space.containerMaxW} mx-auto px-8`}>
        {/* Header */}
        <motion.div
          variants={entrance}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16 space-y-4"
        >
          <Eyebrow>Why now</Eyebrow>
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
            Why this matters now.
          </h2>
        </motion.div>

        {/* Rows */}
        <div>
          {rows.map((row, i) => (
            <motion.div
              key={row.number}
              variants={entrance}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * mkt.motion.stagger }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 pb-10"
              style={{ borderTop: `1px solid ${mkt.color.borderLight}` }}
            >
              {/* Number */}
              <div className="lg:col-span-2">
                <span
                  className="font-mono select-none"
                  style={{
                    fontSize: '48px',
                    color: mkt.color.textMono,
                    lineHeight: '1',
                  }}
                >
                  {row.number}
                </span>
              </div>

              {/* Content */}
              <div className="lg:col-span-10">
                <h3
                  className="font-bold"
                  style={{ fontSize: '20px', color: mkt.color.textPrimary }}
                >
                  {row.claim}
                </h3>
                <p
                  className="mt-2 leading-[1.7]"
                  style={{
                    fontSize: '15px',
                    color: mkt.color.textSecondary,
                    maxWidth: '560px',
                  }}
                >
                  {row.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
