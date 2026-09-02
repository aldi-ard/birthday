"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import { motion as m } from "framer-motion"

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
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [flash, setFlash] =
    useState(false)

  /*
   * ==========================================================
   * CAMERA
   * ==========================================================
   */

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Camera API is not supported"
          )
        }

        setIsLoading(true)

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: "user",
              },

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

        const track =
          stream.getVideoTracks()[0]

        const settings = track.getSettings()

        console.log(
          "Photobooth camera:",
          {
            width: settings.width,
            height: settings.height,
            aspectRatio:
              settings.aspectRatio,
            facingMode:
              settings.facingMode,
          }
        )

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          await videoRef.current.play()
        }

        setIsLoading(false)
      } catch (err) {
        console.error(
          "Photobooth camera error:",
          err
        )

        if (!mounted) return

        const cameraError =
          err as DOMException

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
   * CAPTURE
   *
   * Ambil seluruh frame kamera.
   * Tidak crop.
   * Tidak rotate.
   * Tidak stretch.
   * ==========================================================
   */

  const capturePhoto = () => {
    const video = videoRef.current

    if (!video) return

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      return
    }

    const width = video.videoWidth
    const height = video.videoHeight

    console.log(
      `Capture ${photos.length + 1}: ${width} × ${height}`
    )

    const canvas =
      document.createElement("canvas")

    canvas.width = width
    canvas.height = height

    const ctx =
      canvas.getContext("2d")

    if (!ctx) return

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

    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.92
      )

    /*
     * Flash effect
     */

    setFlash(true)

    setTimeout(() => {
      setFlash(false)
    }, 160)

    /*
     * Simpan foto
     */

    onCapture(image)

    /*
     * Foto ketiga selesai.
     */

    if (photos.length === 2) {
      setTimeout(() => {
        onComplete()
      }, 450)
    }
  }

  /*
   * ==========================================================
   * ERROR
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
        <div className="max-w-sm text-center">
          <div className="mb-5 text-4xl">
            🌸
          </div>

          <p className="text-sm leading-6 text-white/70">
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
   * ACTIVE SLOT
   * ==========================================================
   */

  const activeIndex = photos.length

  return (
    <m.div
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
      }}
      className="
        relative
        mx-auto
        w-full
        max-w-lg
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 text-center">
        <p
          className="
            font-serif
            text-3xl
            italic
            text-pink-700
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
            text-pink-950/40
          "
        >
          {activeIndex + 1} / 3
        </p>
      </div>

      {/* =====================================================
          THREE PHOTO GRID
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          bg-black
          p-2
          shadow-[0_25px_80px_rgba(157,23,77,0.18)]
        "
      >
        {[0, 1, 2].map((index) => {
          const image = photos[index]

          const isActive =
            index === activeIndex

          return (
            <div
              key={index}
              className="
                relative
                aspect-video
                overflow-hidden
                bg-black
              "
            >
              {/* Divider */}
              {index > 0 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-0
                    z-20
                    h-1
                    bg-white
                  "
                />
              )}

              {/* Captured photo */}
              {image && (
                <img
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-contain
                  "
                />
              )}

              {/* Active live camera */}
              {isActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-contain
                  "
                  style={{
                    transform:
                      "scaleX(-1)",
                  }}
                />
              )}

              {/* Empty slot */}
              {!image && !isActive && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-pink-950/5
                  "
                >
                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-[0.3em]
                      text-white/30
                    "
                  >
                    {index + 1}
                  </span>
                </div>
              )}

              {/* Slot label */}
              <div
                className="
                  absolute
                  left-4
                  top-4
                  z-10
                  rounded-full
                  bg-black/30
                  px-3
                  py-1
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-white/70
                  backdrop-blur-md
                "
              >
                {image
                  ? "Captured"
                  : isActive
                    ? "Ready"
                    : `Photo ${index + 1}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* =====================================================
          INSTRUCTION
      ====================================================== */}

      <p
        className="
          mt-6
          text-center
          text-sm
          text-pink-950/55
        "
      >
        {activeIndex < 3
          ? "Take a photo when you're ready."
          : ""}
      </p>

      {/* =====================================================
          CAPTURE BUTTON
      ====================================================== */}

      <div className="mt-7 flex justify-center">
        <button
          onClick={capturePhoto}
          disabled={
            isLoading ||
            photos.length >= 3
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
            border-pink-900/20
            bg-white
            shadow-[0_10px_35px_rgba(157,23,77,0.18)]
            transition
            active:scale-90
            disabled:opacity-40
          "
        >
          <span
            className="
              h-14
              w-14
              rounded-full
              bg-pink-900
            "
          />
        </button>
      </div>

      {/* =====================================================
          CLOSE
      ====================================================== */}

      <button
        onClick={onClose}
        aria-label="Close camera"
        className="
          absolute
          right-0
          top-0
          z-30
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-pink-900/10
          bg-white/80
          text-xl
          font-light
          text-pink-900
          shadow-sm
          backdrop-blur-md
          transition
          active:scale-90
        "
      >
        ×
      </button>

      {/* =====================================================
          LOADING OVERLAY
      ====================================================== */}

      {isLoading && (
        <div
          className="
            absolute
            inset-0
            z-20
            flex
            items-center
            justify-center
            rounded-3xl
            bg-black/80
          "
        >
          <div className="text-center text-white">
            <div className="mb-3 text-3xl">
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

      {/* =====================================================
          CAMERA FLASH
      ====================================================== */}

      {flash && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            pointer-events-none
            fixed
            inset-0
            z-[100]
            bg-white
          "
        />
      )}
    </m.div>
  )
}