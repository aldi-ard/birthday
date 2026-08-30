"use client"

import { motion as m } from "framer-motion"

interface VoiceWaveformProps {
  isPlaying: boolean
}

const bars = [
  20, 35, 50, 30, 65,
  40, 75, 45, 60, 30,
  55, 70, 35, 50, 25,
]

function VoiceWaveform({
  isPlaying,
}: VoiceWaveformProps) {
  return (
    <div
      className="
        flex
        h-16
        items-center
        justify-center
        gap-1
      "
      aria-hidden="true"
    >
      {bars.map((height, index) => (
        <m.span
          key={index}
          initial={{
            height: `${height}%`,
          }}
          animate={
            isPlaying
              ? {
                  height: [
                    `${height * 0.6}%`,
                    `${height}%`,
                    `${height * 0.75}%`,
                    `${height}%`,
                  ],
                }
              : {
                  height: `${height * 0.6}%`,
                }
          }
          transition={
            isPlaying
              ? {
                  duration:
                    0.8 + (index % 4) * 0.15,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: index * 0.03,
                }
              : {
                  duration: 0.4,
                  ease: "easeOut",
                }
          }
          className="
            w-1
            rounded-full
            bg-pink-300
          "
        />
      ))}
    </div>
  )
}

export default VoiceWaveform