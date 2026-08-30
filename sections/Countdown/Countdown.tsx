"use client"

import { useEffect, useState } from "react"
import { motion as m } from "framer-motion"

import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function Countdown() {
  const birthday = new Date(
    "2026-08-31T01:38:00"
  ).getTime()

  const calculateTimeLeft = (): TimeLeft | null => {
    const difference =
      birthday - Date.now()

    if (difference <= 0) {
      return null
    }

    return {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ),

      hours: Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      ),

      minutes: Math.floor(
        (difference /
          (1000 * 60)) %
          60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    }
  }

  const [timeLeft, setTimeLeft] =
    useState<TimeLeft | null>(
      calculateTimeLeft()
    )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft()
      )
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const isBirthday = timeLeft === null

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
          max-w-4xl
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
          Counting the moments
        </p>

        <h2
          className="
            mt-2
            text-5xl
            md:text-7xl
            text-pink-700
          "
          style={{
            fontFamily:
              tangerine.style.fontFamily,
          }}
        >
          Until your special day
        </h2>

        {isBirthday ? (
          <m.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="mt-12"
          >
            <p
              className="
                text-4xl
                md:text-6xl
                text-pink-700
              "
              style={{
                fontFamily:
                  tangerine.style.fontFamily,
              }}
            >
              Today is your day 🎂
            </p>
          </m.div>
        ) : (
          <div
            className="
              mt-12
              grid
              grid-cols-2
              gap-4
              md:grid-cols-4
            "
          >
            <TimeUnit
              value={timeLeft.days}
              label="Days"
            />

            <TimeUnit
              value={timeLeft.hours}
              label="Hours"
            />

            <TimeUnit
              value={timeLeft.minutes}
              label="Minutes"
            />

            <TimeUnit
              value={timeLeft.seconds}
              label="Seconds"
            />
          </div>
        )}
      </m.div>
    </section>
  )
}

interface TimeUnitProps {
  value: number
  label: string
}

function TimeUnit({
  value,
  label,
}: TimeUnitProps) {
  return (
    <m.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        rounded-2xl
        bg-white/50
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      <p
        className="
          text-4xl
          md:text-5xl
          font-medium
          text-pink-700
        "
      >
        {String(value).padStart(2, "0")}
      </p>

      <p
        className="
          mt-2
          text-xs
          uppercase
          tracking-[0.2em]
          text-pink-900/60
        "
      >
        {label}
      </p>
    </m.div>
  )
}

export default Countdown