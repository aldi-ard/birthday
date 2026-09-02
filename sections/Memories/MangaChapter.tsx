"use client"

import { motion as m } from "framer-motion"
import type { MemoryChapter } from "./memories.data"
import MangaPanel from "./MangaPanel"

interface MangaChapterProps {
  chapter: MemoryChapter
  chapterIndex: number
}

export default function MangaChapter({
  chapter,
  chapterIndex,
}: MangaChapterProps) {
  return (
    <div className="relative">
      {/* Chapter heading */}
      <div className="mb-16 text-center md:mb-24">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[10px] uppercase tracking-[0.4em] text-pink-950/40"
        >
          Chapter {chapter.number}
        </m.p>

        <m.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.1,
          }}
          className="mt-3 font-serif text-4xl text-pink-900 md:text-6xl"
        >
          {chapter.title}
        </m.h3>

        {chapter.subtitle && (
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
            className="mx-auto mt-4 max-w-md text-sm italic leading-6 text-pink-950/50"
          >
            {chapter.subtitle}
          </m.p>
        )}
      </div>

      {/* Panels */}
      <div className="space-y-20 md:space-y-32">
        {chapter.panels.map((panel, index) => (
          <MangaPanel
            key={panel.id}
            panel={panel}
            priority={chapterIndex === 0 && index === 0}
          />
        ))}
      </div>
    </div>
  )
}