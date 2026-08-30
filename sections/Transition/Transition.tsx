"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"

import SakuraCover from "./SakuraCover"
import SakuraReveal from "./SakuraReveal"

interface TransitionProps {
  onCoverComplete: () => void
  onComplete: () => void
}

function Transition({
  onCoverComplete,
  onComplete,
}: TransitionProps) {
  const [phase, setPhase] =
    useState<"cover" | "reveal">("cover")

  const handleCoverComplete = () => {
    onCoverComplete()
    setPhase("reveal")
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "cover" && (
        <SakuraCover
          onCoverComplete={handleCoverComplete}
        />
      )}

      {phase === "reveal" && (
        <SakuraReveal
          onComplete={onComplete}
        />
      )}
    </AnimatePresence>
  )
}

export default Transition