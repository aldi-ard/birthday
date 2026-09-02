"use client"

import { useEffect, useRef, useState } from "react"
import { motion as m } from "framer-motion"

interface CameraProps {
  onCapture: (image: string) => void
  onClose: () => void
}

export default function Camera({
  onCapture,
  onClose,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1080,
            },
            height: {
              ideal: 1920,
            },
          },
          audio: false,
        })

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error(error)
        setError("Camera permission is required to take a photo.")
      }
    }

    startCamera()

    return () => {
      mounted = false

      streamRef.current?.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }
  }, [])

  const capturePhoto = () => {
    const video = videoRef.current

    if (!video) return

    const canvas = document.createElement("canvas")

    const width = video.videoWidth
    const height = video.videoHeight

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d")

    if (!context) return

    context.translate(width, 0)
    context.scale(-1, 1)

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    )

    const image = canvas.toDataURL(
      "image/jpeg",
      0.92
    )

    onCapture(image)
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-pink-900/60">
          {error}
        </p>

        <button
          onClick={onClose}
          className="mt-6 rounded-full border border-pink-300 px-6 py-3 text-sm text-pink-800 transition hover:bg-pink-50"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black shadow-2xl">
        {/* Camera */}
        <div className="relative aspect-[9/16] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{
              transform: "scaleX(-1)",
            }}
          />

          {/* Sakura decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-5 top-6 text-3xl">
              🌸
            </div>

            <div className="absolute right-6 top-12 text-2xl">
              🌸
            </div>

            <div className="absolute bottom-20 left-6 text-2xl">
              🌸
            </div>

            <div className="absolute bottom-10 right-5 text-3xl">
              🌸
            </div>
          </div>

          {/* Top text */}
          <div className="absolute left-0 right-0 top-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              Create a memory
            </p>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
            <button
              onClick={capturePhoto}
              aria-label="Take photo"
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/80 bg-white/20 backdrop-blur-md transition active:scale-90"
            >
              <span className="h-14 w-14 rounded-full bg-white" />
            </button>
          </div>

          {/* Close */}
         <button
            onClick={onClose}
            aria-label="Close camera"
            className="
                absolute right-5 top-5 z-20
                flex h-11 w-11 items-center justify-center
                rounded-full
                border border-white/20
                bg-black/30
                text-2xl font-light text-white
                backdrop-blur-md
                transition-all duration-300
                hover:bg-black/50
                active:scale-90
            "
            >
            ×
        </button>
        </div>
      </div>
    </m.div>
  )
}