"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import PhotoBooth from "./PhotoBooth"
import PhotoResult from "./PhotoResult"

type Stage = "idle" | "camera" | "result"

export default function CreateAMemory() {
  const [stage, setStage] = useState<Stage>("idle")
  const [photos, setPhotos] = useState<string[]>([])

  const handleStart = () => {
    setPhotos([])
    setStage("camera")
  }

  const handleCapture = (image: string) => {
    setPhotos((current) => [...current, image])
  }

  const handleComplete = () => {
    setStage("result")
  }

  const handleRetake = () => {
    setPhotos([])
    setStage("camera")
  }

  const handleClose = () => {
    setPhotos([])
    setStage("idle")
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fffafc]
        px-6
        py-32
        md:py-48
      "
    >
      {/* Background decoration */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-80
          w-80
          rounded-full
          bg-pink-200/20
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-20
          h-96
          w-96
          rounded-full
          bg-rose-200/20
          blur-[120px]
        "
      />

      {/* =====================================================
          IDLE
      ====================================================== */}

      {stage === "idle" && (
        <div className="relative mx-auto max-w-xl text-center">
          <p
            className="
              font-serif
              text-3xl
              italic
              text-pink-700
            "
          >
            One more thing...
          </p>

          <h2
            className="
              mt-4
              text-4xl
              font-medium
              tracking-tight
              text-pink-950
              md:text-6xl
            "
          >
            Create a memory
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-md
              text-sm
              leading-7
              text-pink-950/55
              md:text-base
            "
          >
            Take three little moments from today
            and turn them into something worth keeping.
          </p>

          <button
            onClick={handleStart}
            className="
              mt-10
              rounded-full
              bg-pink-900
              px-8
              py-4
              text-sm
              font-medium
              text-white
              shadow-[0_15px_40px_rgba(157,23,77,0.18)]
              transition
              duration-300
              hover:bg-pink-800
              active:scale-95
            "
          >
            Take three photos ♡
          </button>
        </div>
      )}

      {/* =====================================================
          CAMERA
      ====================================================== */}

      <AnimatePresence mode="wait">
        {stage === "camera" && (
          <PhotoBooth
            key="photo-booth"
            photos={photos}
            onCapture={handleCapture}
            onComplete={handleComplete}
            onClose={handleClose}
          />
        )}

        {stage === "result" && (
          <PhotoResult
            key="photo-result"
            photos={photos}
            onRetake={handleRetake}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  )
}