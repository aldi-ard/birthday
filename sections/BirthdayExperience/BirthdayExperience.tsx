"use client"

import { useState } from "react"

import IntroGate from "@/sections/IntroGate/IntroGate"
import Transition from "@/sections/Transition/Transition"
import Hero from "@/sections/Hero/Hero"
import SakuraParticles from "@/sections/Transition/SakuraParticles"

type Scene = "intro" | "hero"

export default function BirthdayExperience() {
  const [scene, setScene] = useState<Scene>("intro")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleEnter = () => {
    setIsTransitioning(true)
  }

  
  const handleTransitionComplete = () => {
    setIsTransitioning(false)
  }
  
  const handleCoverComplete = () => {
    setScene("hero")
  }
  return (
    <main className="relative min-h-screen overflow-hidden">

      <SakuraParticles
        intensity={isTransitioning ? 1 : 0.5}
      />

      {scene === "intro" && (
        <IntroGate
          onEnter={handleEnter}
        />
      )}

      {scene === "hero" && (
        <Hero />
      )}

     {isTransitioning && (
        <Transition
          onCoverComplete={handleCoverComplete}
          onComplete={handleTransitionComplete}
        />
      )}

    </main>
  )
}