'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { mkt } from '../tokens'
import { Eyebrow } from './ui/Eyebrow'

const CALLOUTS = [
  {
    id: 1,
    text: 'A decision made in Q2, quoted six months later as "our strategy" — never re-examined.',
  },
  {
    id: 2,
    text: 'An OKR measuring activity rather than outcome, kept past the point the activity stopped creating value.',
  },
  {
    id: 3,
    text: "A dependency the strategy rests on that's commoditising — the bet may not survive its time horizon.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{ backgroundColor: mkt.color.dark }}
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
          <Eyebrow color={mkt.color.textMono}>The dark matter problem</Eyebrow>
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
            color: mkt.color.textOnDark,
            maxWidth: '760px',
          }}
        >
          The strategic thinking exists. It just isn&apos;t structured.
        </motion.h2>

        {/* Callouts */}
        <div className="mt-14 flex flex-col gap-6">
          {CALLOUTS.map((callout, i) => (
            <motion.div
              key={callout.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{
                duration: mkt.motion.entranceDuration,
                ease: 'easeOut',
                delay: mkt.motion.stagger * (i + 2),
              }}
              style={{ borderColor: mkt.color.amber }}
              className="border-l-2 pl-5 py-3"
            >
              <p
                style={{
                  fontSize: mkt.type.bodyLg,
                  lineHeight: mkt.leading.body,
                  color: mkt.color.textOnDark,
                }}
              >
                {callout.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing text */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{
            duration: mkt.motion.entranceDuration,
            ease: 'easeOut',
            delay: mkt.motion.stagger * (CALLOUTS.length + 2),
          }}
          className="mt-14 max-w-[600px]"
          style={{
            fontSize: mkt.type.body,
            lineHeight: mkt.leading.body,
            color: mkt.color.textOnDarkSecondary,
          }}
        >
          You don&apos;t see the gaps while things are working.
          You feel them when something breaks — and by then, you&apos;re already paying for it.
        </motion.p>
      </div>
    </section>
  )
}
