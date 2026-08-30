"use client"

import { motion as m } from "framer-motion"

interface SakuraTransitionProps {
  onCoverComplete: () => void
}

function SakuraTransition({
  onCoverComplete,
}: SakuraTransitionProps) {
  return (
    <m.div
      initial={{
        scaleY: 0,
      }}
      animate={{
        scaleY: 1,
      }}
      transition={{
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={onCoverComplete}
      className="
        fixed
        inset-0
        z-[999]
        origin-bottom
        bg-pink-300
      "
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-4xl text-white">
          🌸
        </p>
      </div>
    </m.div>
  )
}

export default SakuraTransition