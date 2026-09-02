"use client"

import { motion as m } from "framer-motion"

interface PhotoPreviewProps {
  image: string
  onRetake: () => void
  onShare: () => void
  onClose: () => void
}

export default function PhotoPreview({
  image,
  onRetake,
  onShare,
  onClose,
}: PhotoPreviewProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-pink-950/90
        p-5
      "
    >
      <div className="w-full max-w-md">

        {/* =====================================================
            STORY FRAME
        ====================================================== */}
        <div
          className="
            relative
            aspect-[9/16]
            w-full
            overflow-hidden
            rounded-3xl
            bg-black
            shadow-2xl
          "
        >

          {/* ===================================================
              PHOTO
          ==================================================== */}
          <img
            src={image}
            alt="Birthday selfie"
            className="
              absolute
              inset-0
              h-full
              w-full
              fill
            "
          />

          {/* ===================================================
              GRADIENT
          ==================================================== */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-b
              from-black/30
              via-transparent
              to-black/60
            "
          />

          {/* ===================================================
              SAKURA
          ==================================================== */}
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute left-5 top-6 text-3xl">
              🌸
            </span>

            <span className="absolute right-6 top-14 text-2xl">
              🌸
            </span>

            <span className="absolute bottom-32 left-6 text-2xl">
              🌸
            </span>

            <span className="absolute bottom-20 right-5 text-3xl">
              🌸
            </span>
          </div>

          {/* ===================================================
              TOP
          ==================================================== */}
          <div className="absolute left-0 right-0 top-8 text-center text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">
              A little memory
            </p>
          </div>

          {/* ===================================================
              CLOSE
          ==================================================== */}
          <button
            onClick={onClose}
            aria-label="Close photo preview"
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

          {/* ===================================================
              BOTTOM STORY
          ==================================================== */}
          <div
            className="
              absolute
              bottom-10
              left-0
              right-0
              px-6
              text-center
              text-white
            "
          >
            <p className="text-3xl md:text-4xl">
              A moment to keep.
            </p>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/75">
              Today was beautiful because you were here.
            </p>

            <div className="mx-auto mt-5 h-px w-12 bg-white/50" />

            <p className="mt-4 text-lg">
              Dea Chintya ♡
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/50">
              02 September 2026
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTROLS
        ====================================================== */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onRetake}
            className="
              flex-1
              rounded-full
              border
              border-white/30
              px-5
              py-3
              text-sm
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/10
              active:scale-95
            "
          >
            Retake
          </button>

          <button
            onClick={onShare}
            className="
              flex-1
              rounded-full
              bg-white
              px-5
              py-3
              text-sm
              font-medium
              text-pink-800
              transition
              hover:bg-white/90
              active:scale-95
            "
          >
            Share ♡
          </button>
        </div>
      </div>
    </m.div>
  )
}
