'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { mkt } from '../../tokens'

interface InlineExpandProps {
  isOpen: boolean
  children: React.ReactNode
}

export function InlineExpand({ isOpen, children }: InlineExpandProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: mkt.motion.expansionDuration, ease: 'easeOut', delay: mkt.motion.expansionDelay },
            opacity: { duration: mkt.motion.expansionDuration, ease: 'easeOut', delay: mkt.motion.expansionDelay },
          }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
