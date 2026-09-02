"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { TimelineEvent as TimelineEventType } from "./timeline.data"

interface TimelineEventProps {
  event: TimelineEventType
  index: number
}

export default function TimelineEvent({
  event,
  index,
}: TimelineEventProps) {
  const isEven = index % 2 === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative
        grid
        md:grid-cols-2
        md:gap-16
        ${isEven ? "" : "md:[&>div:first-child]:order-2"}
      `}
    >
      {/* IMAGE */}

      <div className="relative pl-10 md:pl-0">
        <div
          className="
            relative
            aspect-[4/5]
            w-full
            overflow-hidden
            rounded-sm
            border border-pink-900/10
            bg-pink-50
            shadow-[0_20px_60px_rgba(190,80,120,0.08)]
          "
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="
              (max-width: 768px) 90vw,
              45vw
            "
            className="object-cover"
          />
        </div>
      </div>

      {/* STORY */}

      <div
        className="
          mt-8
          pl-10
          md:flex
          md:flex-col
          md:justify-center
          md:pl-0
          md:mt-0
        "
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-pink-900/40
          "
        >
          {event.date}
        </span>

        <h3
          className="
            mt-3
            font-serif
            text-3xl
            font-medium
            text-pink-950
            md:text-4xl
          "
        >
          {event.title}
        </h3>

        <p
          className="
            mt-5
            max-w-md
            text-sm
            leading-7
            text-pink-950/60
            md:text-base
          "
        >
          {event.description}
        </p>
      </div>

      {/* TIMELINE DOT */}

      <div
        className="
          absolute
          left-4
          top-6
          h-3
          w-3
          -translate-x-1/2
          rounded-full
          border-2
          border-white
          bg-pink-400
          shadow-[0_0_0_4px_rgba(244,114,182,0.12)]
          md:left-1/2
          md:top-1/2
        "
      />
    </motion.article>
  )
}