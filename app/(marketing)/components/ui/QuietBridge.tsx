'use client'

import { motion } from 'framer-motion'
import { mkt } from '../../tokens'

interface QuietBridgeProps {
  headline: string
  subline: string
}

export function QuietBridge({ headline, subline }: QuietBridgeProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: mkt.motion.entranceDuration, ease: 'easeOut' }}
        >
          <h2
            className="font-semibold"
            style={{
              fontSize: mkt.type.h2,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
              color: mkt.color.textPrimary,
            }}
          >
            {headline}
          </h2>
          <p
            className="mt-4 mx-auto max-w-[600px]"
            style={{
              fontSize: mkt.type.body,
              lineHeight: mkt.leading.body,
              color: mkt.color.textSecondary,
            }}
          >
            {subline}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
