"use client"

import { useState } from "react"
import { AnimatePresence, motion as m } from "framer-motion"

import Camera from "./Camera"
import PhotoPreview from "./PhotoPreview"

type CameraState =
  | "idle"
  | "camera"
  | "preview"

export default function CreateAMemory() {
  const [state, setState] = useState<CameraState>("idle")
  const [photo, setPhoto] = useState<string | null>(null)

  const handleCapture = (image: string) => {
    setPhoto(image)
    setState("preview")
  }

  const handleRetake = () => {
    setPhoto(null)
    setState("camera")
  }

  const handleClose = () => {
    setPhoto(null)
    setState("idle")
  }

  const handleShare = async () => {
    if (!photo) return

    try {
      const response = await fetch(photo)

      const blob = await response.blob()

      const file = new File(
        [blob],
        "birthday-memory.jpg",
        {
          type: "image/jpeg",
        }
      )

      if (
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          files: [file],
          title: "Birthday Memory",
        })

        return
      }

      // Fallback
      const link = document.createElement("a")

      link.href = photo
      link.download = "birthday-memory.jpg"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Share failed:", error)
    }
  }

  return (
    <>
      <section className="relative flex min-h-[70vh] items-center justify-center px-6 py-32">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-2xl text-pink-800">
            One last thing...
          </p>

          <h2 className="mt-3 text-5xl text-pink-700 md:text-7xl">
            Make a memory
          </h2>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-pink-900/60">
            Take a little photo to remember this moment.
          </p>

          <button
            onClick={() => setState("camera")}
            className="mt-10 rounded-full bg-pink-700 px-8 py-4 text-sm font-medium text-white shadow-lg shadow-pink-200 transition hover:bg-pink-800 active:scale-95"
          >
            Take a selfie 🌸
          </button>
        </m.div>
      </section>

      <AnimatePresence mode="wait">
        {state === "camera" && (
          <Camera
            onCapture={handleCapture}
            onClose={handleClose}
          />
        )}

        {state === "preview" && photo && (
          <PhotoPreview
          image={photo}
          onRetake={handleRetake}
          onShare={handleShare}
          onClose={handleClose}
        />
        )}
      </AnimatePresence>
    </>
  )
}