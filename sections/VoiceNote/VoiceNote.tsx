"use client"

import { useEffect, useRef, useState } from "react"
import { motion as m } from "framer-motion"
import VoiceWaveForm from "./VoiceWaveForm"

import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

function VoiceNote() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = async () => {
    const audio = audioRef.current

    if (!audio) return

    if (audio.paused) {
      await audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current

    if (!audio) return

    setCurrentTime(audio.currentTime)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current

    if (!audio) return

    setDuration(audio.duration)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)

    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = audioRef.current

    if (!audio) return

    const newTime = Number(event.target.value)

    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) {
      return "0:00"
    }

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${String(seconds).padStart(2, "0")}`
  }

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    return () => {
      audio.pause()
    }
  }, [])

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        px-6
        py-32
        md:py-40
      "
    >
      <audio
        ref={audioRef}
        src="/audio/birthday-message.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Heading */}

      <m.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="
          mx-auto
          max-w-3xl
          text-center
        "
      >
        <p
          className="
            text-2xl
            text-pink-800
          "
          style={{
            fontFamily:
              yellowtail.style.fontFamily,
          }}
        >
          One more thing
        </p>

        <h2
          className="
            mt-2
            text-5xl
            text-pink-700
            md:text-7xl
          "
          style={{
            fontFamily:
              tangerine.style.fontFamily,
          }}
        >
          A little message for you
        </h2>
      </m.div>


      {/* Player */}

      <m.div
        initial={{
          opacity: 0,
          y: 60,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 1.1,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mx-auto
          mt-14
          max-w-xl
        "
      >
        <div
          className="
            rounded-3xl
            bg-white/60
            p-6
            shadow-xl
            backdrop-blur-sm
            md:p-8
          "
        >

          {/* Microphone */}

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-pink-100
              text-3xl
            "
          >
            🎙️
          </div>
          
                    <div className="mt-6">
        <VoiceWaveForm
            isPlaying={isPlaying}
        />
        </div>

          {/* Message */}

          <p
            className="
              mt-6
              text-center
              text-sm
              leading-7
              text-pink-900/70
            "
          >
            Listen when you have a quiet
            moment.
          </p>


          {/* Play button */}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={
                isPlaying
                  ? "Pause voice note"
                  : "Play voice note"
              }
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-pink-600
                text-xl
                text-white
                shadow-lg
                transition-transform
                hover:scale-105
                active:scale-95
              "
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>
          </div>


          {/* Progress */}

          <div className="mt-8">

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Voice note progress"
              className="
                w-full
                cursor-pointer
                accent-pink-600
              "
            />

            <div
              className="
                mt-2
                flex
                justify-between
                text-xs
                text-pink-900/50
              "
            >
              <span>
                {formatTime(currentTime)}
              </span>

              <span>
                {formatTime(duration)}
              </span>
            </div>

          </div>

        </div>
      </m.div>
    </section>
  )
}

export default VoiceNote