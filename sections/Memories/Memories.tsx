"use client"

import { motion as m } from "framer-motion"

import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

import MemoryCard from "./MemoryCard"
import { memories } from "./memories.data"

function Memories() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        px-6
        py-32
      "
    >

      {/* Intro */}

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
          mx-auto
          max-w-3xl
          text-center
        "
      >
        <p
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
        </p>

        <h2
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
        </h2>

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


      {/* Memories */}

<div
  className="
    mt-24
    md:mt-32
    space-y-28
    md:space-y-40
  "
>
{memories.map((memory, index) => (
  <MemoryCard
    key={memory.id}
    memory={memory}
    index={index}
  />
))}

      </div>

    </section>
  )
}

export default Memories