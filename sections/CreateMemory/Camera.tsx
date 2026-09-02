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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera API is not supported")
        }

        /*
         * ==========================================================
         * REQUEST PORTRAIT CAMERA
         *
         * Kita sengaja meminta:
         *
         *      1080 × 1920
         *
         * bukan:
         *
         *      1920 × 1080
         *
         * Tidak ada crop di sini.
         * Kita ingin stream-nya sendiri sudah portrait.
         * ==========================================================
         */

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "user",
            },

            width: {
              ideal: 1080,
              min: 720,
            },

            height: {
              ideal: 1920,
              min: 1280,
            },

            aspectRatio: {
              ideal: 9 / 16,
            },
          },

          audio: false,
        })

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream

        const track = stream.getVideoTracks()[0]
        const settings = track.getSettings()

        console.log("Camera settings:", settings)

        /*
         * ==========================================================
         * CEK RATIO STREAM YANG BENAR-BENAR DIBERIKAN BROWSER
         * ==========================================================
         */

        if (
          settings.width &&
          settings.height
        ) {
          const ratio =
            settings.width / settings.height

          console.log(
            `Camera resolution: ${settings.width} × ${settings.height}`
          )

          console.log(
            `Camera aspect ratio: ${ratio}`
          )
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          await videoRef.current.play()
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Camera error:", err)

        if (!mounted) return

        const cameraError = err as DOMException

        switch (cameraError.name) {
          case "NotAllowedError":
            setError(
              "Camera permission was denied. Please allow camera access and reload the page."
            )
            break

          case "NotFoundError":
            setError(
              "No camera was found on this device."
            )
            break

          case "NotReadableError":
            setError(
              "The camera is currently being used by another application."
            )
            break

          case "OverconstrainedError":
            setError(
              "This camera does not support portrait mode."
            )
            break

          case "SecurityError":
            setError(
              "Camera access was blocked by the browser."
            )
            break

          default:
            setError(
              "Unable to access the camera."
            )
        }

        setIsLoading(false)
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

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      console.warn("Camera is not ready.")
      return
    }

    const width = video.videoWidth
    const height = video.videoHeight

    console.log(
      `Captured camera frame: ${width} × ${height}`
    )

    /*
     * ==========================================================
     * IMPORTANT
     *
     * TIDAK ADA CROP.
     *
     * Kita mengambil SELURUH FRAME kamera.
     *
     * Jadi:
     *
     * Camera input
     *       ↓
     * Full frame
     *       ↓
     * Photo
     *
     * Kalau stream benar-benar 9:16:
     *
     * 1080 × 1920
     *
     * maka hasil juga:
     *
     * 1080 × 1920
     * ==========================================================
     */

    const canvas = document.createElement("canvas")

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    /*
     * Mirror selfie
     *
     * Preview kamera menggunakan scaleX(-1),
     * maka hasil capture juga dibuat mirror.
     */

    ctx.save()

    ctx.translate(width, 0)
    ctx.scale(-1, 1)

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    )

    ctx.restore()

    const image = canvas.toDataURL(
      "image/jpeg",
      0.9
    )

    onCapture(image)
  }

  if (error) {
    return (
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/80
          px-6
        "
      >
        <div className="w-full max-w-sm text-center">
          <div className="mb-5 text-4xl">
            🌸
          </div>

          <p className="text-sm leading-6 text-white/70">
            {error}
          </p>

          <button
            onClick={onClose}
            className="
              mt-6
              rounded-full
              border
              border-white/30
              px-6
              py-3
              text-sm
              text-white
              transition
              hover:bg-white/10
            "
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/80
        p-4
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          bg-black
          shadow-2xl
        "
      >
        {/* =====================================================
            PORTRAIT VIEWFINDER
        ====================================================== */}

        <div
          className="
            relative
            aspect-[9/16]
            w-full
            overflow-hidden
          "
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="
              h-full
              w-full
              object-fill
            "
            style={{
              transform: "scaleX(-1)",
            }}
          />

          {/* Loading */}
          {isLoading && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black
              "
            >
              <div className="text-center text-white">
                <div className="mb-4 text-3xl">
                  🌸
                </div>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-white/60
                  "
                >
                  Starting camera...
                </p>
              </div>
            </div>
          )}

          {/* Sakura */}
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

          {/* Top */}
          <div
            className="
              absolute
              left-0
              right-0
              top-6
              text-center
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-white/70
              "
            >
              Create a memory
            </p>
          </div>

          {/* Capture */}
          <div
            className="
              absolute
              bottom-8
              left-0
              right-0
              flex
              justify-center
            "
          >
            <button
              onClick={capturePhoto}
              disabled={isLoading}
              aria-label="Take photo"
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border-4
                border-white/80
                bg-white/20
                backdrop-blur-md
                transition
                active:scale-90
                disabled:opacity-50
              "
            >
              <span className="h-14 w-14 rounded-full bg-white" />
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close camera"
            className="
              absolute
              right-5
              top-5
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/30
              text-2xl
              font-light
              text-white
              backdrop-blur-md
              transition-all
              duration-300
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