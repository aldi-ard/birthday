"use client"

import HeroBackground from "./HeroBackground"
import HeroDecoration from "./HeroDecoration"
import { motion as m, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  yellowtail,
  tangerine,
} from "@/themes/sakura/font"

function Hero() {
  const heroRef = useRef < HTMLElement | null > (null)


  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: [
      "start start",
      "end start",
    ],
  })
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.6],
    [0, -120]
  )
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    [1, 0]
  )
  const subtitleY = useTransform(
    scrollYProgress,
    [0, 0.7],
    [0, -60]
  )
  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0, 0.6],
    [1, 0]
  )
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.08]
  )
  const scrollOpacity = useTransform(
    scrollYProgress,
    [0, 0.15],
    [1, 0]
  )
  return (

    <section
      ref={heroRef}
      className="
            relative
            min-h-screen
            w-full
            overflow-hidden
            flex
            items-center
            justify-center
        "
    >
      <m.div
        style={{
          scale: backgroundScale,
        }}
        className="
            absolute
            inset-0
            -z-10
            "
      >
        <HeroBackground />
      </m.div>
      <HeroDecoration scrollYProgress={scrollYProgress} />
      <m.div
        className="
    relative
    z-20
    flex
    flex-col
    items-center
    text-center
  "
      >
        {/* Happy Birthday */}
        <m.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.3,
          }}
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
            Happy Birthday
          </p>
        </m.div>


        {/* Name */}
        <m.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <m.h1
            style={{
              fontFamily:
                tangerine.style.fontFamily,

              y: titleY,
              opacity: titleOpacity,
            }}
            className="
        mt-2
        text-6xl
        md:text-8xl
        text-pink-700
      "
          >
            Dea Chintya
          </m.h1>
        </m.div>


        {/* Subtitle */}
        <m.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 1.2,
          }}
        >
          <m.p
            className="
        mt-6
        text-sm
        tracking-[0.3em]
        uppercase
        text-pink-500
      "
            style={{
              y: subtitleY,
              opacity: subtitleOpacity,
            }}
          >
            A little story made for you
          </m.p>
        </m.div>
      </m.div>
      <m.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: 2,
        }}
      >
        <m.div
          style={{
            opacity: scrollOpacity,
          }}
          className="
        absolute
        bottom-10
        left-1/2
        -translate-x-1/2
        z-20
        flex
        flex-col
        items-center
        gap-2
        text-pink-500
        "
        >
          <span className="text-xs tracking-widest uppercase">
            Scroll
          </span>

          <m.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-xl"
          >
            ↓
          </m.div>
        </m.div>
      </m.div>
    </section>
  )
}

export default Hero