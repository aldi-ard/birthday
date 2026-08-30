"use client"

import {
  motion as m,
  useScroll,
  useTransform,
} from "framer-motion"

import { useRef } from "react"
import type { Memory } from "./memories.data"

interface MemoryCardProps {
  memory: Memory
  index: number
}

function MemoryCard({
  memory,
  index,
}: MemoryCardProps) {

  const cardRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: [
      "start end",
      "center center",
    ],
  })

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [0.94, 1]
  )
  const alignment =
  index % 2 === 0
    ? "md:mr-auto md:ml-[8%]"
    : "md:ml-auto md:mr-[8%]"

  return (
    <m.article
      ref={cardRef}
      initial={{
        opacity: 0,
        y: 80,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
className={`
  relative
  w-full
  max-w-4xl
  mx-auto
  ${alignment}
`}
    >
      {/* Image */}
  <div
  className="
    relative
    aspect-[4/5]
    md:aspect-[16/10]
    overflow-hidden
    rounded-2xl
"
>
  <m.img
    src={memory.image}
    alt={memory.title}
    style={{
      scale: imageScale,
    }}
    className="
      h-full
      w-full
      object-cover
    "
  />
</div>
      {/* Text */}
  <m.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  viewport={{
    once: true,
    amount: 0.3,
  }}
  transition={{
    duration: 0.8,
    delay: 0.25,
    ease: "easeOut",
  }}
  className="
    mt-6
    text-center
  "
>
<h3
  className="
    text-3xl
    md:text-4xl
    text-pink-700
  "
>
  {memory.title}
</h3>

<p
  className="
    mx-auto
    mt-3
    max-w-lg
    text-sm
    leading-7
    text-pink-900/70
  "
>
  {memory.description}
</p>
      </m.div>
    </m.article>
  )
}

export default MemoryCard