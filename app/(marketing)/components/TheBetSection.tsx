'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { Eyebrow } from './ui/Eyebrow'

const entrance = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const topItems = [
  {
    title: 'Detection, not guesswork.',
    body: "The system can spot when goals and metrics don't line up.",
  },
  {
    title: 'Traceability, not storytelling.',
    body: 'Every insight links back to the decisions behind it.',
  },
]

const bottomItems = [
  {
    title: 'Composable, not fragile.',
    body: 'New capabilities can be added without rewriting everything.',
  },
  {
    title: 'Cost tied to capability, not content.',
    body: 'Information is processed once, then reused.',
  },
  {
    title: 'One system, two ways of working.',
    body: 'Explore visually or query directly — same underlying data.',
  },
]

export default function TheBetSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{ backgroundColor: mkt.color.soft }}
      className={mkt.space.sectionY}
    >
      <div className={`${mkt.space.containerMaxW} mx-auto px-8`}>
        {/* Header */}
        <motion.div
          variants={entrance}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-14 space-y-4"
        >
          <Eyebrow>One structural choice</Eyebrow>
          <h2
            className="font-semibold"
            style={{
              fontSize: mkt.type.h2,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
              color: mkt.color.textPrimary,
              maxWidth: '720px',
            }}
          >
            When strategy is structured, different things become possible.
          </h2>
        </motion.div>

        {/* Grid wrapper */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: mkt.motion.stagger } },
          }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={`border border-[${mkt.color.borderLight}]`}
          style={{ borderColor: mkt.color.borderLight }}
        >
          {/* Top row: 2-col */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-px"
            style={{ backgroundColor: mkt.color.borderLight }}
          >
            {topItems.map((item) => (
              <motion.div
                key={item.title}
                variants={entrance}
                className="p-8 lg:p-10"
                style={{ backgroundColor: mkt.color.white }}
              >
                <h3
                  className="font-bold"
                  style={{ fontSize: '17px', color: mkt.color.textPrimary }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 leading-[1.7]"
                  style={{ fontSize: '15px', color: mkt.color.textSecondary }}
                >
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bottom row: 3-col */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-px mt-px"
            style={{ backgroundColor: mkt.color.borderLight }}
          >
            {bottomItems.map((item) => (
              <motion.div
                key={item.title}
                variants={entrance}
                className="p-6 lg:p-8"
                style={{ backgroundColor: mkt.color.white }}
              >
                <h3
                  className="font-bold"
                  style={{ fontSize: '17px', color: mkt.color.textPrimary }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 leading-[1.7]"
                  style={{ fontSize: '15px', color: mkt.color.textSecondary }}
                >
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
