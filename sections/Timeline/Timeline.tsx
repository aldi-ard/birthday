"use client"

import TimelineEvent from "./TimelineEvent"
import TimelineLine from "./TimelineLine"
import { timelineEvents } from "./timeline.data"

export default function Timeline() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fffafc]
        px-6
        py-32
        md:py-48
      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-[15%]
          h-[300px]
          w-[300px]
          rounded-full
          bg-pink-200/20
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-150px]
          top-[55%]
          h-[350px]
          w-[350px]
          rounded-full
          bg-rose-200/20
          blur-[120px]
        "
      />

      {/* HEADER */}

      <div className="relative mx-auto mb-28 max-w-2xl text-center">
        <span
          className="
            font-serif
            text-4xl
            italic
            text-pink-700
          "
        >
          Our Story
        </span>

        <h2
          className="
            mt-4
            text-4xl
            font-medium
            tracking-tight
            text-pink-950
            md:text-6xl
          "
        >
          A little timeline
        </h2>

        <p
          className="
            mx-auto
            mt-6
            max-w-md
            text-sm
            leading-7
            text-pink-950/50
            md:text-base
          "
        >
          Some moments are ordinary when they happen,
          but become precious when we look back at them.
        </p>
      </div>

      {/* TIMELINE */}

      <div className="relative mx-auto max-w-6xl">
        <TimelineLine />

        <div className="relative space-y-28 md:space-y-40">
          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* END */}

      <div className="relative mt-32 text-center md:mt-48">
        <p
          className="
            font-serif
            text-2xl
            italic
            text-pink-700/70
          "
        >
          And the story continues...
        </p>

        <span className="mt-4 block text-xl text-pink-400">
          ♡
        </span>
      </div>
    </section>
  )
}