"use client"

import { motion as m } from "framer-motion"

import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

function Finale() {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        overflow-hidden
        px-6
        py-32
      "
    >
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-4xl
          text-center
        "
      >

        {/* Small heading */}

        <m.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 1,
          }}
          className="
            text-2xl
            text-pink-800
          "
          style={{
            fontFamily:
              yellowtail.style.fontFamily,
          }}
        >
          And finally...
        </m.p>


        {/* Main title */}

        <m.h2
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-4
            text-7xl
            leading-none
            text-pink-700
            md:text-9xl
          "
          style={{
            fontFamily:
              tangerine.style.fontFamily,
          }}
        >
          Happy Birthday
        </m.h2>


        {/* Name */}

        <m.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 1,
            delay: 0.6,
          }}
          className="
            mt-4
            text-3xl
            tracking-wide
            text-pink-800
            md:text-4xl
          "
        >
          Dea Chintya
        </m.p>


        {/* Divider */}

        <m.div
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          whileInView={{
            scaleX: 1,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1,
            delay: 0.9,
          }}
          className="
            mx-auto
            mt-8
            h-px
            w-24
            bg-pink-300
          "
        />


        {/* Final message */}

        <m.p
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
            amount: 0.4,
          }}
          transition={{
            duration: 1,
            delay: 1.1,
          }}
          className="
            mx-auto
            mt-8
            max-w-xl
            text-sm
            leading-7
            text-pink-900/70
            md:text-base
          "
        >
          May this new chapter bring you
          beautiful moments, genuine happiness,
          and countless reasons to smile.
        </m.p>

      </div>
    </section>
  )
}

export default Finale