"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import { AnimatePresence, motion as m } from "framer-motion"

interface PhotoBoothProps {
  photos: string[]
  onCapture: (image: string) => void
  onComplete: () => void
  onClose: () => void
}

export default function PhotoBooth({
  photos,
  onCapture,
  onComplete,
  onClose,
}: PhotoBoothProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [flash, setFlash] = useState(false)

  const activeIndex = photos.length

  /*
   * ==========================================================
   * START CAMERA
   * ==========================================================
   */

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera API is not supported.")
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: "user",
              },

              /*
               * Kita prefer landscape.
               * Browser/device tetap bebas menentukan
               * resolusi aktual.
               */
              width: {
                ideal: 1920,
              },

              height: {
                ideal: 1080,
              },
            },

            audio: false,
          })

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop())

          return
        }

        streamRef.current = stream

        const track = stream.getVideoTracks()[0]
        const settings = track.getSettings()

        console.log("Photobooth camera settings:", {
          width: settings.width,
          height: settings.height,
          aspectRatio: settings.aspectRatio,
          facingMode: settings.facingMode,
        })

        const video = videoRef.current

        if (!video) {
          stream
            .getTracks()
            .forEach((track) => track.stop())

          return
        }

        video.srcObject = stream

        await video.play()

        console.log("Actual video:", {
          width: video.videoWidth,
          height: video.videoHeight,
        })

        setIsLoading(false)
      } catch (err) {
        console.error(
          "Photobooth camera error:",
          err
        )

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

      streamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop()
        })

      streamRef.current = null
    }
  }, [])

  /*
   * ==========================================================
   * CAPTURE PHOTO
   * ==========================================================
   */

  const capturePhoto = () => {
    if (isCapturing) return

    if (photos.length >= 3) return

    const video = videoRef.current

    if (!video) return

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      console.warn(
        "Camera is not ready."
      )
      return
    }

    setIsCapturing(true)

    const width = video.videoWidth
    const height = video.videoHeight

    /*
     * ========================================================
     * FULL FRAME CAPTURE
     *
     * Tidak crop.
     * Tidak stretch.
     * Tidak rotate.
     *
     * Kita menyimpan frame kamera apa adanya.
     * ========================================================
     */

    const canvas = document.createElement("canvas")

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")

    if (!ctx) {
      setIsCapturing(false)
      return
    }

    /*
     * Mirror selfie.
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
      0.92
    )

    /*
     * Flash
     */

    setFlash(true)

    window.setTimeout(() => {
      setFlash(false)
    }, 130)

    /*
     * Save image.
     */

    onCapture(image)

    /*
     * Setelah shot ketiga,
     * masuk ke result.
     */

    if (photos.length === 2) {
      window.setTimeout(() => {
        onComplete()
      }, 500)
    }

    /*
     * Prevent double tap.
     */

    window.setTimeout(() => {
      setIsCapturing(false)
    }, 300)
  }

  /*
   * ==========================================================
   * ERROR SCREEN
   * ==========================================================
   */

  if (error) {
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
          bg-black/90
          px-6
        "
      >
        <div className="w-full max-w-sm text-center">
          <div className="mb-5 text-4xl">
            🌸
          </div>

          <h2 className="text-xl text-white">
            Camera unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            {error}
          </p>

          <button
            onClick={onClose}
            className="
              mt-7
              rounded-full
              border
              border-white/30
              px-7
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
      </m.div>
    )
  }

  /*
   * ==========================================================
   * MAIN UI
   * ==========================================================
   */

  return (
    <m.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 20,
      }}
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/85
        p-4
      "
    >
      <div className="w-full max-w-lg">

        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="mb-5 text-center text-white">
          <p
            className="
              font-serif
              text-3xl
              italic
              text-white
            "
          >
            Three little moments
          </p>

          <p
            className="
              mt-2
              text-xs
              uppercase
              tracking-[0.3em]
              text-white/45
            "
          >
            {activeIndex < 3
              ? `Shot ${activeIndex + 1} of 3`
              : "Complete"}
          </p>
        </div>

        {/* ====================================================
            CAMERA
        ===================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-black
            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
          "
        >
          {/* ONE PERMANENT VIDEO */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="
              block
              h-auto
              w-full
              object-contain
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
                    text-white/50
                  "
                >
                  Starting camera...
                </p>
              </div>
            </div>
          )}

          {/* Camera title */}
          {!isLoading && (
            <div
              className="
                absolute
                left-0
                right-0
                top-5
                text-center
              "
            >
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-white/65
                "
              >
                Create a memory
              </p>
            </div>
          )}

          {/* Sakura decoration */}
          {!isLoading && (
            <div className="pointer-events-none absolute inset-0">
              <span className="absolute left-5 top-5 text-2xl">
                🌸
              </span>

              <span className="absolute right-5 top-8 text-2xl">
                🌸
              </span>
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close photobooth"
            className="
              absolute
              right-4
              top-4
              z-30
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/25
              text-xl
              font-light
              text-white
              backdrop-blur-md
              transition
              hover:bg-black/40
              active:scale-90
            "
          >
            ×
          </button>
        </div>

        {/* ====================================================
            SHOT INDICATORS
        ===================================================== */}

        <div className="mt-6 flex justify-center gap-7">
          {[0, 1, 2].map((index) => {
            const captured = index < photos.length
            const active = index === activeIndex

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-xs
                    transition-all
                    duration-300
                    ${
                      captured
                        ? "border-pink-900 bg-pink-900 text-white"
                        : active
                          ? "border-pink-700 bg-pink-100 text-pink-900"
                          : "border-pink-900/15 bg-white text-pink-900/30"
                    }
                  `}
                >
                  {captured
                    ? "✓"
                    : String(index + 1)}
                </div>

                <span
                  className={`
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    ${
                      active
                        ? "text-pink-900"
                        : "text-pink-900/30"
                    }
                  `}
                >
                  {captured
                    ? "Done"
                    : active
                      ? "Ready"
                      : "Next"}
                </span>
              </div>
            )
          })}
        </div>

        {/* ====================================================
            INSTRUCTION
        ===================================================== */}

        <AnimatePresence mode="wait">
          <m.p
            key={activeIndex}
            initial={{
              opacity: 0,
              y: 6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -6,
            }}
            className="
              mt-5
              text-center
              text-sm
              text-pink-950/55
            "
          >
            {activeIndex === 0 &&
              "Just smile. This is the first one ♡"}

            {activeIndex === 1 &&
              "One more. Make this one fun."}

            {activeIndex === 2 &&
              "Last one. Make it count."}
          </m.p>
        </AnimatePresence>

        {/* ====================================================
            CAPTURE BUTTON
        ===================================================== */}

        <div className="mt-7 flex justify-center">
          <button
            onClick={capturePhoto}
            disabled={
              isLoading ||
              isCapturing ||
              activeIndex >= 3
            }
            aria-label="Take photo"
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border-4
              border-white
              bg-white/30
              shadow-[0_10px_40px_rgba(157,23,77,0.18)]
              backdrop-blur-md
              transition
              hover:scale-105
              active:scale-90
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <span
              className="
                h-14
                w-14
                rounded-full
                bg-white
              "
            />
          </button>
        </div>

        {/* ====================================================
            FLASH
        ===================================================== */}

        <AnimatePresence>
          {flash && (
            <m.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.12,
              }}
              className="
                pointer-events-none
                fixed
                inset-0
                z-[100]
                bg-white
              "
            />
          )}
        </AnimatePresence>
      </div>
    </m.div>
  )
}