"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useRef } from "react"

export default function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div
      ref={ref}
      className="absolute left-4 top-0 h-full w-px md:left-1/2"
    >
      <motion.div
        style={{ scaleY }}
        className="
          absolute inset-x-0 top-0
          h-full origin-top
          bg-pink-300/60
        "
      />

      <div
        className="
          absolute left-1/2 top-0
          h-2 w-2 -translate-x-1/2
          rounded-full bg-pink-400
        "
      />
    </div>
  )
}