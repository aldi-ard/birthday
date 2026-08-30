"use client"

import { useState } from "react"

import IntroGate from "@/sections/IntroGate/IntroGate"
import Transition from "@/sections/Transition/Transition"
import Hero from "@/sections/Hero/Hero"
import Memories from "@/sections/Memories/Memories"
import SakuraParticles from "@/sections/Transition/SakuraParticles"
import Letter from "@/sections/Letter/Letter"
import Countdown from "@/sections/Countdown/Countdown"
import Finale from "../Finale/Finale";
import VoiceNote from "../VoiceNote/VoiceNote";

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
        <>
          <Hero />
          <Memories />
          <Letter />
          <VoiceNote/>
          <Countdown />
          <Finale/>
        </>
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