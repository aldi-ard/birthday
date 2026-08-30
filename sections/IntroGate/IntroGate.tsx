"use client"

import React from "react"
import { easeOut, motion as m } from "framer-motion"
import Background from "@/sections/IntroGate/Background"
import { yellowtail, tangerine } from "@/themes/sakura/font"
import { Button } from "@/components/ui/button"

interface IntroGateProps {
  onEnter: () => void
}

function IntroGate({ onEnter }: IntroGateProps) {
  return (
    <Background>
      <m.div
        initial={{
          y: "100%",
          opacity: 0,
        }}
        animate={{
          y: "0%",
          opacity: 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="w-100 h-100 flex flex-col relative items-center text-center justify-center overflow-hidden"
      >
        <h1
          className="text-3xl text-pink-800 z-10 mb-26 mr-46 [-webkit-text-stroke:1px_red-400]"
          style={{ fontFamily: yellowtail.style.fontFamily }}
        >
          special for you
        </h1>

        <m.h2
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.05,
          }}
          transition={{
            duration: 1.1,
            delay: 1,
            ease : "easeOut"
          }}
          className="text-8xl absolute text-white top-40"
          style={{
            fontFamily: tangerine.style.fontFamily,
            fontWeight: yellowtail.style.fontWeight,
          }}
        >
          Dea Chintya
        </m.h2>

        <Button variant="pink" onClick={onEnter}>
          Next
        </Button>
      </m.div>
    </Background>
  )
}

export default IntroGate