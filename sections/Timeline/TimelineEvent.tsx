"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { TimelineEvent as TimelineEventType } from "./timeline"

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
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.35,
      }}
      className="relative"
    >
      <div
        className={`
          grid
          items-center
          md:grid-cols-2
          md:gap-20
          ${isEven ? "" : "md:[&>div:first-child]:order-2"}
        `}
      >

        {/* ================================= */}
        {/* IMAGE */}
        {/* ================================= */}

        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              rotateX: 90,
              y: 30,
            },

            visible: {
              opacity: 1,
              rotateX: 0,
              y: 0,
              transition: {
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          style={{
            perspective: 1200,
          }}
          className="relative pl-10 md:pl-0"
        >
          <motion.div
            initial={{
              x: 0,
            }}
            variants={{
              visible: {
                x: isEven ? 0 : 0,
                transition: {
                  delay: 0.65,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
            className="
              relative
              aspect-[4/5]
              w-full
              overflow-hidden
              rounded-sm
              border
              border-pink-900/10
              bg-pink-50
              shadow-[0_25px_70px_rgba(190,80,120,0.10)]
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
              className="
                object-cover
                transition-transform
                duration-1000
                ease-out
              "
            />

            {/* soft overlay */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/10
                via-transparent
                to-transparent
              "
            />
          </motion.div>
        </motion.div>


        {/* ================================= */}
        {/* STORY */}
        {/* ================================= */}

        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: isEven ? 35 : -35,
            },

            visible: {
              opacity: 1,
              x: 0,

              transition: {
                delay: 0.65,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          className="
            mt-8
            pl-10
            md:mt-0
            md:pl-0
          "
        >

          {/* DATE */}

          <span
            className="
              block
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-pink-900/40
            "
          >
            {event.date}
          </span>


          {/* TITLE */}

          <h3
            className="
              mt-3
              font-serif
              text-3xl
              font-medium
              leading-tight
              text-pink-950
              md:text-4xl
            "
          >
            {event.title}
          </h3>


          {/* DIVIDER */}

          <div
            className="
              mt-5
              h-px
              w-12
              bg-pink-300/60
            "
          />


          {/* DESCRIPTION */}

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

        </motion.div>

      </div>


      {/* ================================= */}
      {/* TIMELINE DOT */}
      {/* ================================= */}

      <div
        className="
          absolute
          left-4
          top-6
          z-10
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