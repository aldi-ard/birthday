"use client"

import {
  motion as m,
  useTransform,
  type MotionValue,
} from "framer-motion"

interface HeroDecorationProps {
  scrollYProgress: MotionValue<number>
}


function HeroDecoration({
  scrollYProgress,
}: HeroDecorationProps) {

  const leftFlowerY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -80]
  )
  const rightFlowerY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -50]
  )
  const bottomFlowerY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -35]
  )

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        overflow-hidden
      "
    >
      <m.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          delay: 0.8,
          ease: "easeOut",
        }}
        className="
          absolute
          left-[12%]
          top-[22%]
          text-5xl
        "
        style={{
          y: leftFlowerY,
        }}
      >
        🌸
      </m.div>

      <m.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          delay: 1.1,
          ease: "easeOut",
        }}
        className="
          absolute
          right-[14%]
          top-[30%]
          text-4xl
        "
        style={{
          y: rightFlowerY,
        }}
      >
        🌸
      </m.div>

      <m.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          delay: 1.4,
          ease: "easeOut",
        }}
        className="
          absolute
          bottom-[25%]
          left-[20%]
          text-3xl
        "
        style={{
          y: bottomFlowerY,
        }}
      >
        🌸
      </m.div>
    </div>
  )
}

export default HeroDecoration