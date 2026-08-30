"use client"

import { motion as m } from "framer-motion"

import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

function Memories() {
  return (
    <section
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        flex
        items-center
        justify-center
        px-6
      "
    >
      <m.div
        initial={{
          opacity: 0,
          y: 50,
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
        className="
          relative
          z-20
          max-w-3xl
          text-center
        "
      >

        <m.p
          className="
            text-2xl
            text-pink-800
          "
          style={{
            fontFamily:
              yellowtail.style.fontFamily,
          }}
        >
          Our little memories
        </m.p>

        <m.h2
          className="
            mt-2
            text-6xl
            md:text-8xl
            text-pink-700
          "
          style={{
            fontFamily:
              tangerine.style.fontFamily,
          }}
        >
          Moments to remember
        </m.h2>

        <p
          className="
            mx-auto
            mt-6
            max-w-xl
            text-sm
            leading-7
            text-pink-900/70
          "
        >
          Every moment has its own little story.
          Some are ordinary, some are unforgettable,
          but all of them are worth remembering.
        </p>

      </m.div>
    </section>
  )
}

export default Memories