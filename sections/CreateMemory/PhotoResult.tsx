"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { generatePhotobooth } from "./GeneratePhotobooth"
import { generateStory } from "./GenerateStory"

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
  const [photobooth, setPhotobooth] =
    useState<string | null>(null)

  const [story, setStory] =
    useState<string | null>(null)

  const [isGenerating, setIsGenerating] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [sharingType, setSharingType] =
    useState<"photobooth" | "story" | null>(null)

  useEffect(() => {
    let cancelled = false

    async function generateResults() {
      try {
        setIsGenerating(true)
        setError(null)

        const [
          photoboothResult,
          storyResult,
        ] = await Promise.all([
          generatePhotobooth(photos, {
            name: "Dea Chintya",
            date: "02 September 2026",
          }),
          generateStory(photos, {
            name: "Dea Chintya",
            date: "02 September 2026",
          }),
        ])

        if (cancelled) return

        setPhotobooth(photoboothResult)
        setStory(storyResult)
      } catch (err) {
        console.error(
          "Failed to generate results:",
          err,
        )

        if (!cancelled) {
          setError(
            "Something went wrong while creating your memories.",
          )
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false)
        }
      }
    }

    if (photos.length === 3) {
      generateResults()
    }

    return () => {
      cancelled = true
    }
  }, [photos])

  const downloadImage = (
    image: string,
    filename: string,
  ) => {
    const link =
      document.createElement("a")

    link.href = image
    link.download = filename

    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const shareImage = async (
    image: string,
    filename: string,
    title: string,
  ) => {
    try {
      setSharingType(
        filename.includes("story")
          ? "story"
          : "photobooth",
      )

      const response = await fetch(image)

      const blob = await response.blob()

      const file = new File(
        [blob],
        filename,
        {
          type: "image/jpeg",
        },
      )

      /**
       * Native file sharing.
       */
      if (
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          files: [file],
          title,
          text: "A little memory from today ♡",
        })

        return
      }

      /**
       * Fallback.
       */
      downloadImage(
        image,
        filename,
      )
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      ) {
        return
      }

      console.error(
        "Share failed:",
        err,
      )

      downloadImage(
        image,
        filename,
      )
    } finally {
      setSharingType(null)
    }
  }

  return (
    <motion.div
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
        y: -20,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        mx-auto
        w-full
        max-w-5xl
      "
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-pink-900/40
          "
        >
          Your memories are ready
        </p>

        <h2
          className="
            mt-4
            font-serif
            text-4xl
            font-medium
            tracking-tight
            text-pink-950
            md:text-5xl
          "
        >
          Three little moments
        </h2>

        <p
          className="
            mx-auto
            mt-4
            max-w-md
            text-sm
            leading-7
            text-pink-950/55
            md:text-base
          "
        >
          One set of photos,
          two ways to keep them.
        </p>
      </div>

      {/* Loading */}
      {isGenerating && (
        <div
          className="
            flex
            min-h-[500px]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                mx-auto
                h-8
                w-8
                rounded-full
                border
                border-pink-300
                border-t-pink-700
              "
            />

            <p
              className="
                mt-5
                text-sm
                text-pink-900/50
              "
            >
              Creating your memories...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!isGenerating && error && (
        <div
          className="
            mx-auto
            mt-12
            max-w-md
            rounded-sm
            border
            border-pink-900/10
            bg-white/70
            px-6
            py-8
            text-center
          "
        >
          <p
            className="
              text-sm
              leading-7
              text-pink-950/60
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={onRetake}
            className="
              mt-6
              rounded-full
              border
              border-pink-900/15
              px-6
              py-3
              text-xs
              uppercase
              tracking-[0.2em]
              text-pink-900
              transition
              hover:bg-pink-50
            "
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!isGenerating &&
        !error &&
        photobooth &&
        story && (
          <div className="mt-12">
            <div
              className="
                grid
                gap-10
                lg:grid-cols-2
                lg:items-start
              "
            >
              {/* =========================
                  ORIGINAL PHOTOBOOTH
              ========================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="text-center">
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.3em]
                      text-pink-900/40
                    "
                  >
                    Original
                  </p>

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-2xl
                      text-pink-950
                    "
                  >
                    Photobooth Strip
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-pink-950/45
                    "
                  >
                    The full memory
                  </p>
                </div>

                <div
                  className="
                    mx-auto
                    mt-7
                    w-full
                    max-w-[420px]
                  "
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-sm
                      bg-white
                      shadow-[0_30px_80px_rgba(120,60,90,0.14)]
                    "
                  >
                    <img
                      src={photobooth}
                      alt="Original photobooth strip"
                      className="
                        block
                        h-auto
                        w-full
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    flex
                    justify-center
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      shareImage(
                        photobooth,
                        "three-little-moments.jpg",
                        "Three Little Moments",
                      )
                    }
                    className="
                      rounded-full
                      bg-pink-900
                      px-6
                      py-3
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-white
                      transition
                      hover:bg-pink-950
                    "
                  >
                    {sharingType === "photobooth"
                      ? "Opening..."
                      : "Share"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadImage(
                        photobooth,
                        "three-little-moments.jpg",
                      )
                    }
                    className="
                      rounded-full
                      border
                      border-pink-900/15
                      bg-white/70
                      px-6
                      py-3
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-pink-900
                      transition
                      hover:bg-pink-50
                    "
                  >
                    Download
                  </button>
                </div>
              </motion.div>

              {/* =========================
                  INSTAGRAM STORY
              ========================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="text-center">
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.3em]
                      text-pink-900/40
                    "
                  >
                    Instagram
                  </p>

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-2xl
                      text-pink-950
                    "
                  >
                    Story
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-pink-950/45
                    "
                  >
                    Ready for 9:16
                  </p>
                </div>

                <div
                  className="
                    mx-auto
                    mt-7
                    w-full
                    max-w-[360px]
                  "
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-sm
                      bg-white
                      shadow-[0_30px_80px_rgba(120,60,90,0.14)]
                    "
                  >
                    <img
                      src={story}
                      alt="Instagram Story version"
                      className="
                        block
                        h-auto
                        w-full
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    flex
                    justify-center
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      shareImage(
                        story,
                        "three-little-moments-story.jpg",
                        "Three Little Moments — Story",
                      )
                    }
                    className="
                      rounded-full
                      bg-pink-900
                      px-6
                      py-3
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-white
                      transition
                      hover:bg-pink-950
                    "
                  >
                    {sharingType === "story"
                      ? "Opening..."
                      : "Share"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadImage(
                        story,
                        "three-little-moments-story.jpg",
                      )
                    }
                    className="
                      rounded-full
                      border
                      border-pink-900/15
                      bg-white/70
                      px-6
                      py-3
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-pink-900
                      transition
                      hover:bg-pink-50
                    "
                  >
                    Download
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Bottom actions */}
            <div
              className="
                mt-16
                text-center
              "
            >
              <button
                type="button"
                onClick={onRetake}
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-pink-900/40
                  transition
                  hover:text-pink-900
                "
              >
                Take them again
              </button>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    text-xs
                    tracking-[0.15em]
                    text-pink-900/25
                    transition
                    hover:text-pink-900/60
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </motion.div>
  )
}