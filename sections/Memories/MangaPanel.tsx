"use client"

import Image from "next/image"
import { motion as m } from "framer-motion"
import type { MemoryPanel } from "./memories.data"

interface MangaPanelProps {
  panel: MemoryPanel
  priority?: boolean
}

export default function MangaPanel({
  panel,
  priority = false,
}: MangaPanelProps) {
  return (
    <m.article
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      {/* HERO */}
      {panel.layout === "hero" && (
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[4/5] overflow-hidden border border-pink-950/10 bg-white shadow-[0_15px_50px_rgba(100,40,60,0.08)] md:aspect-[16/10]">
            <Image
              src={panel.image}
              alt={panel.caption ?? "Memory"}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {panel.caption && (
            <p className="mt-4 text-center font-serif text-sm italic text-pink-950/60">
              {panel.caption}
            </p>
          )}
        </div>
      )}

      {/* SPLIT */}
      {panel.layout === "split" && (
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-square overflow-hidden border border-pink-950/10 bg-white shadow-[0_15px_50px_rgba(100,40,60,0.08)]">
            <Image
              src={panel.image}
              alt={panel.caption ?? "Memory"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="px-4 text-center md:px-0 md:text-left">
            {panel.quote && (
              <blockquote className="font-serif text-2xl leading-relaxed text-pink-900 md:text-3xl">
                “{panel.quote}”
              </blockquote>
            )}

            {panel.caption && (
              <p className="mt-5 text-sm leading-7 text-pink-950/50">
                {panel.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* PORTRAIT */}
      {panel.layout === "portrait" && (
        <div className="mx-auto max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden border border-pink-950/10 bg-white shadow-[0_15px_50px_rgba(100,40,60,0.08)]">
            <Image
              src={panel.image}
              alt={panel.caption ?? "Memory"}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover"
            />
          </div>

          {panel.caption && (
            <p className="mt-4 text-center font-serif text-sm italic text-pink-950/60">
              {panel.caption}
            </p>
          )}
        </div>
      )}

      {/* WIDE */}
      {panel.layout === "wide" && (
        <div className="mx-auto max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden border border-pink-950/10 bg-white shadow-[0_15px_50px_rgba(100,40,60,0.08)]">
            <Image
              src={panel.image}
              alt={panel.caption ?? "Memory"}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {panel.caption && (
            <p className="mt-4 text-center font-serif text-sm italic text-pink-950/60">
              {panel.caption}
            </p>
          )}
        </div>
      )}
    </m.article>
  )
}