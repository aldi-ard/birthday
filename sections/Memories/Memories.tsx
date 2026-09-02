"use client"

import { motion as m } from "framer-motion"

import MangaChapter from "./MangaChapter"
import { memoryChapters } from "./memories.data"

export default function Memories() {
  return (
    <section className="relative overflow-hidden bg-[#fffafc] px-6 py-32 md:py-48">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />

        <div className="absolute -right-32 top-[45%] h-96 w-96 rounded-full bg-rose-100/30 blur-3xl" />
      </div>

      {/* Intro */}
      <div className="relative mx-auto mb-32 max-w-2xl text-center md:mb-48">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.4em] text-pink-950/40"
        >
          Memories
        </m.p>

        <m.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.1,
          }}
          className="mt-4 font-serif text-5xl text-pink-900 md:text-7xl"
        >
          Our little story
        </m.h2>

        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.4,
          }}
          className="mx-auto mt-6 max-w-md text-sm leading-7 text-pink-950/50"
        >
          A collection of little moments that became
          something worth remembering.
        </m.p>
      </div>

      {/* Chapters */}
      <div className="relative mx-auto max-w-5xl">
        <div className="space-y-48 md:space-y-72">
          {memoryChapters.map((chapter, index) => (
            <MangaChapter
              key={chapter.number}
              chapter={chapter}
              chapterIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Ending */}
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative mt-48 text-center"
      >
        <div className="mx-auto h-px w-16 bg-pink-300/60" />

        <p className="mt-8 font-serif text-xl italic text-pink-900/70">
          And the story continues...
        </p>
      </m.div>
    </section>
  )
}