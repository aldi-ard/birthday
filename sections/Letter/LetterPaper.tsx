"use client"

import { motion as m } from "framer-motion"

import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

function LetterPaper() {
  return (
    <m.div
      initial={{
        opacity: 0,
        y: 50,
        rotateX: 8,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        mx-auto
        max-w-2xl
        rounded-2xl
        bg-white/70
        p-8
        shadow-xl
        backdrop-blur-sm
        md:p-12
      "
    >
      <p
        className="
          text-lg
          leading-8
          text-pink-950/80
        "
      >
        Dear Dea,
      </p>

      <p
        className="
          mt-6
          text-base
          leading-8
          text-pink-950/70
        "
      >
        I hope this little corner of the internet
        can remind you of how special you are.
        May this new chapter bring you many
        beautiful moments, genuine smiles, and
        memories worth keeping.
      </p>

      <p
        className="
          mt-6
          text-base
          leading-8
          text-pink-950/70
        "
      >
        Happy Birthday.
        I hope you always have reasons to smile
        and people around you who make life
        a little brighter.
      </p>

      <div className="mt-10">
        <p
          className="
            text-lg
            text-pink-900
          "
          style={{
            fontFamily:
              yellowtail.style.fontFamily,
          }}
        >
          With love,
        </p>

        <p
          className="
            mt-1
            text-3xl
            text-pink-700
          "
          style={{
            fontFamily:
              tangerine.style.fontFamily,
          }}
        >
          Someone who cares
        </p>
      </div>
    </m.div>
  )
}

export default LetterPaper