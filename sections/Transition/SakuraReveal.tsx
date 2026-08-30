"use client"

import { motion as m } from "framer-motion"

interface SakuraRevealProps {
  onComplete: () => void
}

function SakuraReveal({ onComplete }: SakuraRevealProps) {
  return (
    <>
        <m.div
        initial={{
            scaleY: 1,
        }}
        animate={{
            scaleY: 0,
        }}
        transition={{
            duration: 1.4,
            ease: [0.76, 0, 0.24, 1],
        }}
        onAnimationComplete={onComplete}
        className="
            fixed
            inset-0
            z-[999]
            origin-top
            bg-pink-300
        "
        />
      </>
  )
}

export default SakuraReveal