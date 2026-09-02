"use client"

import {
  useEffect,
  useState,
} from "react"

import { motion as m } from "framer-motion"

interface PhotoResultProps {
  photos: string[]
  onRetake: () => void
  onClose: () => void
}

export default function PhotoResult({
  photos,
  onRetake,
  onClose,
}: PhotoResultProps) {
  const [result, setResult] =
    useState<string | null>(null)

  useEffect(() => {
    if (photos.length !== 3) {
      return
    }

    const createResult = async () => {
      const images =
        await Promise.all(
          photos.map(
            (src) =>
              new Promise<HTMLImageElement>(
                (resolve, reject) => {
                  const img =
                    new Image()

                  img.onload = () =>
                    resolve(img)

                  img.onerror = reject

                  img.src = src
                }
              )
          )
        )

      /*
       * ========================================================
       * FINAL PHOTO SIZE
       *
       * Each photo tetap menggunakan ratio aslinya.
       *
       * Kita gunakan width 1080.
       * ========================================================
       */

      const outputWidth = 1080

      const photoHeight =
        Math.round(
          outputWidth *
            (images[0].naturalHeight /
              images[0].naturalWidth)
        )

      const gap = 12

      const footerHeight = 150

      const outputHeight =
        photoHeight * 3 +
        gap * 2 +
        footerHeight

      const canvas =
        document.createElement("canvas")

      canvas.width =
        outputWidth

      canvas.height =
        outputHeight

      const ctx =
        canvas.getContext("2d")

      if (!ctx) return

      /*
       * ========================================================
       * BACKGROUND
       * ========================================================
       */

      ctx.fillStyle = "#fffafc"

      ctx.fillRect(
        0,
        0,
        outputWidth,
        outputHeight
      )

      /*
       * ========================================================
       * DRAW 3 PHOTOS
       * ========================================================
       */

      images.forEach(
        (image, index) => {
          const y =
            index *
              (photoHeight + gap)

          /*
           * Preserve original ratio.
           *
           * Tidak crop.
           * Tidak stretch.
           */

          const imageRatio =
            image.naturalWidth /
            image.naturalHeight

          const drawWidth =
            outputWidth

          const drawHeight =
            drawWidth / imageRatio

          const offsetY =
            y +
            (photoHeight -
              drawHeight) /
              2

          ctx.drawImage(
            image,
            0,
            offsetY,
            drawWidth,
            drawHeight
          )
        }
      )

      /*
       * ========================================================
       * FOOTER
       * ========================================================
       */

      const footerY =
        photoHeight * 3 +
        gap * 2

      ctx.fillStyle =
        "#fffafc"

      ctx.fillRect(
        0,
        footerY,
        outputWidth,
        footerHeight
      )

      ctx.fillStyle =
        "#831843"

      ctx.textAlign = "center"

      ctx.font =
        "italic 38px Georgia"

      ctx.fillText(
        "Three little moments.",
        outputWidth / 2,
        footerY + 58
      )

      ctx.font =
        "20px Arial"

      ctx.fillStyle =
        "rgba(131,24,67,0.55)"

      ctx.fillText(
        "Dea Chintya ♡",
        outputWidth / 2,
        footerY + 98
      )

      const finalImage =
        canvas.toDataURL(
          "image/jpeg",
          0.92
        )

      setResult(finalImage)
    }

    createResult()
  }, [photos])

  /*
   * ==========================================================
   * SHARE
   * ==========================================================
   */

  const handleShare = async () => {
    if (!result) return

    try {
      const response =
        await fetch(result)

      const blob =
        await response.blob()

      const file =
        new File(
          [blob],
          "three-little-moments.jpg",
          {
            type: "image/jpeg",
          }
        )

      if (
        navigator.share &&
        navigator.canShare?.({
          files: [file],
        })
      ) {
        await navigator.share({
          files: [file],
          title:
            "Three little moments",
        })

        return
      }

      /*
       * Fallback:
       * buka image.
       */

      window.open(
        result,
        "_blank"
      )
    } catch (error) {
      console.error(
        "Share failed:",
        error
      )
    }
  }

  /*
   * ==========================================================
   * LOADING RESULT
   * ==========================================================
   */

  if (!result) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          mx-auto
          flex
          min-h-[60vh]
          max-w-md
          items-center
          justify-center
          text-center
        "
      >
        <div>
          <div className="mb-4 text-4xl">
            🌸
          </div>

          <p
            className="
              font-serif
              text-2xl
              italic
              text-pink-700
            "
          >
            Creating your memory...
          </p>
        </div>
      </m.div>
    )
  }

  /*
   * ==========================================================
   * RESULT UI
   * ==========================================================
   */

  return (
    <m.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 30,
      }}
      className="
        relative
        mx-auto
        w-full
        max-w-md
      "
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <p
          className="
            font-serif
            text-3xl
            italic
            text-pink-700
          "
        >
          A memory to keep.
        </p>

        <p
          className="
            mt-2
            text-sm
            text-pink-950/50
          "
        >
          Three moments, one little story.
        </p>
      </div>

      {/* =====================================================
          FINAL IMAGE
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-[0_25px_80px_rgba(157,23,77,0.18)]
        "
      >
        <img
          src={result}
          alt="Three little moments"
          className="
            block
            h-auto
            w-full
          "
        />
      </div>

      {/* =====================================================
          CONTROLS
      ====================================================== */}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onRetake}
          className="
            flex-1
            rounded-full
            border
            border-pink-900/15
            px-5
            py-3
            text-sm
            text-pink-900
            transition
            hover:bg-pink-50
            active:scale-95
          "
        >
          Retake
        </button>

        <button
          onClick={handleShare}
          className="
            flex-1
            rounded-full
            bg-pink-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-pink-800
            active:scale-95
          "
        >
          Share ♡
        </button>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close photo result"
        className="
          absolute
          right-0
          top-0
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-pink-900/10
          bg-white
          text-xl
          font-light
          text-pink-900
          shadow-sm
          transition
          active:scale-90
        "
      >
        ×
      </button>
    </m.div>
  )
}