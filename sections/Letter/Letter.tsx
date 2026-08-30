"use client"

import { motion as m } from "framer-motion"
import LetterPaper from "./LetterPaper"
import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

function Letter() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        px-6
        py-32
        md:py-40
      "
    >

      {/* Section heading */}

      <m.div
        initial={{
          opacity: 0,
          y: 40,
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
          A little something
        </p>

        <h2
          className="
            mt-2
            text-5xl
            md:text-7xl
            text-pink-700
          "
          style={{
            fontFamily:
              tangerine.style.fontFamily,
          }}
        >
          A letter for you
        </h2>
      </m.div>


      {/* Letter */}
    <div
      className="
        [perspective:1200px]
      "
    >
      <LetterPaper />
    </div>


    </section>
  )
}

export default Letter