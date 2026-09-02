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

        // =========================================================
        // 1. Coba kamera depan dengan constraint portrait
        // =========================================================
        let stream: MediaStream

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: "user",
              },
              aspectRatio: {
                ideal: 9 / 16,
              },
              width: {
                ideal: 1080,
              },
              height: {
                ideal: 1920,
              },
            },
            audio: false,
          })
        } catch (portraitError) {
          console.warn(
            "Portrait camera constraint failed. Trying fallback...",
            portraitError
          )

          // =======================================================
          // 2. FALLBACK
          // Jangan paksa aspect ratio.
          // Browser/device bebas menentukan resolusi kamera.
          // Nanti kita crop sendiri ketika capture.
          // =======================================================
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: "user",
              },
            },
            audio: false,
          })
        }

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream

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
              "Camera permission was denied. Please allow camera access in your browser settings."
            )
            break

          case "NotFoundError":
            setError(
              "No camera was found on this device."
            )
            break

          case "NotReadableError":
            setError(
              "The camera is already being used by another application."
            )
            break

          case "SecurityError":
            setError(
              "Camera access is blocked by the browser security settings."
            )
            break

          case "OverconstrainedError":
            setError(
              "This device does not support the requested camera configuration."
            )
            break

          default:
            setError(
              "Unable to access the camera. Please check your browser permissions."
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

    if (!video.videoWidth || !video.videoHeight) {
      console.warn("Camera video is not ready yet.")
      return
    }

    const sourceWidth = video.videoWidth
    const sourceHeight = video.videoHeight

    // =========================================================
    // Target ratio = Instagram Story / portrait
    // =========================================================
    const targetRatio = 9 / 16
    const sourceRatio = sourceWidth / sourceHeight

    let cropX = 0
    let cropY = 0
    let cropWidth = sourceWidth
    let cropHeight = sourceHeight

    // =========================================================
    // Sama dengan CSS object-cover pada container 9:16
    // =========================================================
    if (sourceRatio > targetRatio) {
      // Source terlalu lebar
      // Potong kiri + kanan
      cropWidth = sourceHeight * targetRatio
      cropX = (sourceWidth - cropWidth) / 2
    } else {
      // Source terlalu tinggi
      // Potong atas + bawah
      cropHeight = sourceWidth / targetRatio
      cropY = (sourceHeight - cropHeight) / 2
    }

    // =========================================================
    // Final output
    // Instagram Story: 1080 × 1920
    // =========================================================
    const outputWidth = 1080
    const outputHeight = 1920

    const canvas = document.createElement("canvas")

    canvas.width = outputWidth
    canvas.height = outputHeight

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    ctx.save()

    // =========================================================
    // Mirror selfie
    // Sama seperti preview kamera
    // =========================================================
    ctx.translate(outputWidth, 0)
    ctx.scale(-1, 1)

    ctx.drawImage(
      video,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    )

    ctx.restore()

    const image = canvas.toDataURL(
      "image/jpeg",
      0.9
    )

    onCapture(image)
  }

  // =============================================================
  // ERROR SCREEN
  // =============================================================
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-5 text-4xl">
            🌸
          </div>

          <h2 className="font-serif text-2xl text-pink-950">
            Camera unavailable
          </h2>

          <p className="mt-4 text-sm leading-6 text-pink-950/60">
            {error}
          </p>

          <button
            onClick={onClose}
            className="
              mt-7
              rounded-full
              border
              border-pink-300
              px-6
              py-3
              text-sm
              text-pink-800
              transition
              hover:bg-pink-50
              active:scale-95
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
            CAMERA VIEWFINDER
        ====================================================== */}
        <div className="relative aspect-[9/16] w-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="
              h-full
              w-full
              object-cover
            "
            style={{
              transform: "scaleX(-1)",
            }}
          />

          {/* ===================================================
              LOADING
          ==================================================== */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <div className="mb-4 text-3xl">
                  🌸
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Starting camera...
                </p>
              </div>
            </div>
          )}

          {/* ===================================================
              SAKURA DECORATION
          ==================================================== */}
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

          {/* ===================================================
              TOP TEXT
          ==================================================== */}
          <div className="absolute left-0 right-0 top-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              Create a memory
            </p>
          </div>

          {/* ===================================================
              CAPTURE BUTTON
          ==================================================== */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
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
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span className="h-14 w-14 rounded-full bg-white" />
            </button>
          </div>

          {/* ===================================================
              CLOSE
          ==================================================== */}
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