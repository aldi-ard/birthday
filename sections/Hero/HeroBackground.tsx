"use client"

import { motion as m } from "framer-motion"

function HeroBackground() {
  return (
    <div className="relative h-full w-full overflow-hidden">

      {/* Main soft gradient */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-pink-50
          via-rose-50
          to-white
        "
      />

      {/* Top glow */}
      <m.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 0.7,
          scale: 1,
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
        className="
          absolute
          -top-32
          left-1/2
          -translate-x-1/2
          h-96
          w-96
          rounded-full
          bg-pink-200
          blur-3xl
        "
      />

      {/* Bottom glow */}
      <m.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.5,
        }}
        transition={{
          duration: 2,
          delay: 0.5,
        }}
        className="
          absolute
          -bottom-40
          -left-20
          h-96
          w-96
          rounded-full
          bg-rose-200
          blur-3xl
        "
      />

      {/* Right glow */}
      <m.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.4,
        }}
        transition={{
          duration: 2,
          delay: 0.8,
        }}
        className="
          absolute
          top-1/3
          -right-40
          h-80
          w-80
          rounded-full
          bg-pink-100
          blur-3xl
        "
      />

    </div>
  )
}

export default HeroBackground