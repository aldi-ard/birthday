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
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const rawSizeRef = useRef({
    width: 0,
    height: 0,
  })

  const rotateRef = useRef(false)

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /*
   * ==========================================================
   * CHECK DEVICE ORIENTATION
   * ==========================================================
   */

  const isPortraitDevice = () => {
    if (typeof window === "undefined") {
      return false
    }

    if (screen.orientation) {
      return screen.orientation.type.startsWith("portrait")
    }

    return window.innerHeight > window.innerWidth
  }

  /*
   * ==========================================================
   * UPDATE ORIENTATION
   * ==========================================================
   */

  const updateOrientation = () => {
    const { width, height } = rawSizeRef.current

    if (!width || !height) return

    const streamIsLandscape = width > height
    const deviceIsPortrait = isPortraitDevice()

    /*
     * Mobile portrait device + landscape stream
     * = rotate 90°
     *
     * Desktop yang stream-nya sudah portrait
     * = tidak di-rotate.
     */

    rotateRef.current =
      deviceIsPortrait && streamIsLandscape

    resizeCanvas()
  }

  /*
   * ==========================================================
   * RESIZE CANVAS
   * ==========================================================
   */

  const resizeCanvas = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const { width, height } = rawSizeRef.current

    if (!width || !height) return

    const rotate = rotateRef.current

    const outputWidth = rotate ? height : width
    const outputHeight = rotate ? width : height

    canvas.width = outputWidth
    canvas.height = outputHeight
  }

  /*
   * ==========================================================
   * DRAW CAMERA → CANVAS
   *
   * Canvas menjadi "normalized camera".
   *
   * Tidak crop.
   * Tidak stretch.
   * Hanya rotate jika memang diperlukan.
   * ==========================================================
   */

  const drawCamera = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (
      !video ||
      !canvas ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      animationRef.current = requestAnimationFrame(drawCamera)
      return
    }

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const width = video.videoWidth
    const height = video.videoHeight

    const rotate = rotateRef.current

    const outputWidth = rotate ? height : width
    const outputHeight = rotate ? width : height

    if (
      canvas.width !== outputWidth ||
      canvas.height !== outputHeight
    ) {
      canvas.width = outputWidth
      canvas.height = outputHeight
    }

    ctx.clearRect(
      0,
      0,
      outputWidth,
      outputHeight
    )

    ctx.save()

    if (rotate) {
      /*
       * ======================================================
       * LANDSCAPE → PORTRAIT
       *
       * Rotasi 90° + mirror selfie.
       *
       * Matrix:
       *
       * x' = height - y
       * y' = width - x
       * ======================================================
       */

      ctx.setTransform(
        0,
        -1,
        -1,
        0,
        height,
        width
      )

      ctx.drawImage(
        video,
        0,
        0,
        width,
        height
      )
    } else {
      /*
       * ======================================================
       * ALREADY PORTRAIT
       *
       * Hanya mirror selfie.
       * ======================================================
       */

      ctx.setTransform(
        -1,
        0,
        0,
        1,
        width,
        0
      )

      ctx.drawImage(
        video,
        0,
        0,
        width,
        height
      )
    }

    ctx.restore()

    animationRef.current =
      requestAnimationFrame(drawCamera)
  }

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
          throw new Error("Camera API is not supported")
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: "user",
              },

              width: {
                ideal: 1080,
              },

              height: {
                ideal: 1920,
              },

              aspectRatio: {
                ideal: 9 / 16,
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
          "Camera settings:",
          settings
        )

        if (
          settings.width &&
          settings.height
        ) {
          rawSizeRef.current = {
            width: settings.width,
            height: settings.height,
          }

          console.log(
            `Camera resolution: ${settings.width} × ${settings.height}`
          )

          console.log(
            `Camera aspect ratio: ${
              settings.width / settings.height
            }`
          )
        }

        const video = videoRef.current

        if (!video) return

        video.srcObject = stream

        /*
         * Tunggu metadata video.
         */

        await new Promise<void>((resolve) => {
          if (video.readyState >= 1) {
            resolve()
            return
          }

          video.onloadedmetadata = () => {
            resolve()
          }
        })

        await video.play()

        /*
         * Pakai ukuran aktual video,
         * bukan hanya track settings.
         */

        rawSizeRef.current = {
          width: video.videoWidth,
          height: video.videoHeight,
        }

        console.log(
          `Actual video frame: ${video.videoWidth} × ${video.videoHeight}`
        )

        updateOrientation()

        setIsLoading(false)

        /*
         * Mulai render canvas.
         */

        animationRef.current =
          requestAnimationFrame(drawCamera)
      } catch (err) {
        console.error(
          "Camera error:",
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

          case "OverconstrainedError":
            setError(
              "This camera does not support the requested configuration."
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

    /*
     * Handle phone rotation.
     */

    const orientation =
      screen.orientation

    orientation?.addEventListener(
      "change",
      updateOrientation
    )

    window.addEventListener(
      "resize",
      updateOrientation
    )

    return () => {
      mounted = false

      orientation?.removeEventListener(
        "change",
        updateOrientation
      )

      window.removeEventListener(
        "resize",
        updateOrientation
      )

      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        )
      }

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop())

      streamRef.current = null
    }
  }, [])

  /*
   * ==========================================================
   * CAPTURE
   *
   * Yang disimpan adalah CANVAS yang sedang dilihat user.
   * Jadi preview dan hasil foto 100% sama framing-nya.
   * ==========================================================
   */

  const capturePhoto = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    if (!canvas.width || !canvas.height) {
      console.warn("Camera canvas is not ready.")
      return
    }

    console.log(
      `Captured normalized photo: ${canvas.width} × ${canvas.height}`
    )

    const image = canvas.toDataURL(
      "image/jpeg",
      0.92
    )

    onCapture(image)
  }

  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

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
      <div className="relative w-full max-w-md">

        {/* ====================================================
            NORMALIZED CAMERA VIEW
        ===================================================== */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            rounded-3xl
            bg-black
            shadow-2xl
          "
        >
          {/* Hidden source video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="hidden"
          />

          {/* Actual camera preview */}
          <canvas
            ref={canvasRef}
            className="
              block
              h-auto
              w-full
            "
          />

          {/* ==================================================
              LOADING
          =================================================== */}

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

          {/* ==================================================
              SAKURA
          =================================================== */}

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

          {/* ==================================================
              TOP
          =================================================== */}

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

          {/* ==================================================
              CAPTURE BUTTON
          =================================================== */}

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

          {/* ==================================================
              CLOSE
          =================================================== */}

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