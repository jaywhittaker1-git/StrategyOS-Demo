'use client'

import { motion } from 'framer-motion'
import { Boxes, AlignLeft, Zap, MousePointerClick, Fingerprint, Shield, type LucideIcon } from 'lucide-react'
import { Eyebrow } from './ui/Eyebrow'
import { mkt } from '../tokens'

interface Item {
  claim: string
  consequence: string
  Icon: LucideIcon
  iconColor: string
  iconBg: string
}

const items: Item[] = [
  {
    claim: 'Pure functions only.',
    consequence: 'Adding a capability is a registration, not a rewrite.',
    Icon: Boxes,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
  },
  {
    claim: 'Consistent language.',
    consequence: 'Every capability produces outputs in the same voice.',
    Icon: AlignLeft,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
  },
  {
    claim: 'Two-tier model routing + prompt caching.',
    consequence: '~90% savings on repeated calls. Cost is predictable.',
    Icon: Zap,
    iconColor: '#16A34A',
    iconBg: '#F0FDF4',
  },
  {
    claim: 'No passive AI calls.',
    consequence: 'The user always knows when the system is reasoning.',
    Icon: MousePointerClick,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
  },
  {
    claim: 'Provenance on every write.',
    consequence: 'Every finding traces to source, session, and timestamp.',
    Icon: Fingerprint,
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
  },
  {
    claim: 'Deterministic where possible.',
    consequence: "Contradictions shouldn't be subject to LLM weather.",
    Icon: Shield,
    iconColor: '#0D9488',
    iconBg: '#F0FDFA',
  },
]

const hidden = { opacity: 0, y: 24 }
const shown = { opacity: 1, y: 0 }
const tx = (delay: number) => ({
  duration: mkt.motion.entranceDuration,
  delay,
  ease: 'easeOut' as const,
})

function ItemRow({ item, delay, className }: { item: Item; delay: number; className?: string }) {
  const { claim, consequence, Icon, iconColor, iconBg } = item
  return (
    <motion.div
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true }}
      transition={tx(delay)}
      className={`flex gap-5 items-start ${className ?? ''}`}
    >
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[6px]"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={18} color={iconColor} strokeWidth={1.75} />
      </div>
      <div>
        <span className="font-semibold text-[17px] text-[#111827] block">
          {claim}
        </span>
        <span className="text-[15px] text-[#6B7280] mt-1 block">
          {consequence}
        </span>
      </div>
    </motion.div>
  )
}

export default function ArchitectureSection() {
  return (
    <section className={`${mkt.space.sectionY} bg-[#F8F9FA]`}>
      <div className={`${mkt.space.containerMaxW} mx-auto px-8`}>
        <motion.div
          initial={hidden}
          whileInView={shown}
          viewport={{ once: true }}
          transition={tx(0)}
          className="mb-12"
        >
          <Eyebrow>Architecture as outcomes</Eyebrow>
          <h2
            className="mt-4 font-semibold text-[#111827]"
            style={{
              fontSize: mkt.type.h2,
              letterSpacing: mkt.tracking.h2,
              lineHeight: mkt.leading.h2,
            }}
          >
            Six design choices. Each one matters.
          </h2>
        </motion.div>

        {/* Full-width first item */}
        <ItemRow
          item={items[0]}
          delay={mkt.motion.stagger}
          className="pb-10 border-b border-[#E2E8F0]"
        />

        {/* 2-col grid — items 2–5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
          {items.slice(1, 5).map((item, i) => (
            <ItemRow
              key={item.claim}
              item={item}
              delay={(i + 2) * mkt.motion.stagger}
              className="py-8 border-b border-[#E2E8F0]"
            />
          ))}
        </div>

        {/* Full-width last item */}
        <ItemRow
          item={items[5]}
          delay={6 * mkt.motion.stagger}
          className="pt-8"
        />
      </div>
    </section>
  )
}
