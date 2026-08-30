"use client"

import { useEffect, useRef } from "react"
import { sakuraDecoration } from "@/themes/sakura/decoration"

interface SakuraParticlesProps {
  intensity?: number
}

interface Petal {
  x: number
  y: number
  size: number
  speed: number
  rotation: number
  rotationSpeed: number
  sway: number
  swaySpeed: number
  swayOffset: number
  opacity: number
  depth: number
}

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

function SakuraParticles({
  intensity = 1,
  }: SakuraParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const intensityRef = useRef(intensity)


  useEffect(() => {
  intensityRef.current = intensity
}, [intensity])

  useEffect(() => {
    const currentIntensity = intensity
    let time = 0
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext("2d")

    if (!context) return

    let animationFrame: number

    const resizeCanvas = () => {
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      )

      canvas.width =
        window.innerWidth * pixelRatio

      canvas.height =
        window.innerHeight * pixelRatio

      canvas.style.width =
        `${window.innerWidth}px`

      canvas.style.height =
        `${window.innerHeight}px`

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      )
    }

    resizeCanvas()

    window.addEventListener(
      "resize",
      resizeCanvas
    )

    const {
      count,
      size,
      speed,
      opacity,
      sway,
      swaySpeed,
      rotationSpeed,
    } = sakuraDecoration.petals

    const petals: Petal[] = []

    for (let i = 0; i < count; i++) {
        const depth = Math.random()
      petals.push({
        x:
            Math.random() *
            window.innerWidth,

        y:
            Math.random() *
            window.innerHeight,

        depth,

        size: randomBetween(
            size.min,
            size.max
        ),

       speed:
        randomBetween(
            speed.min,
            speed.max
        ) *
        (0.6 + depth * 0.4),

        rotation:
            Math.random() *
            Math.PI *
            2,

        rotationSpeed: randomBetween(
            rotationSpeed.min,
            rotationSpeed.max
        ),

        sway: randomBetween(
            sway.min,
            sway.max
        ),

        swaySpeed: randomBetween(
            swaySpeed.min,
            swaySpeed.max
        ),

        swayOffset:
            Math.random() *
            Math.PI *
            2,

        opacity: randomBetween(
            opacity.min,
            opacity.max
        ),
        })
    }

    const drawPetal = (
      petal: Petal
    ) => {
      context.save()

      context.translate(
        petal.x,
        petal.y
      )

      context.rotate(
        petal.rotation
      )

      context.globalAlpha =
        petal.opacity *
        (0.5 + petal.depth * 0.5) *
        currentIntensity

      context.beginPath()

      context.moveTo(
        0,
        -petal.size
      )

      context.bezierCurveTo(
        petal.size,
        -petal.size,
        petal.size,
        petal.size,
        0,
        petal.size
      )

      context.bezierCurveTo(
        -petal.size,
        petal.size,
        -petal.size,
        -petal.size,
        0,
        -petal.size
      )

      context.fillStyle =
        "#f9a8d4"

      context.fill()

      context.restore()
    }

    const animate = () => {
      time += 0.01
      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      )

      petals.forEach((petal) => {
        petal.y +=
          petal.speed *
          currentIntensity

        petal.x +=
            Math.sin(
                time *
                petal.swaySpeed *
                100 +
                petal.swayOffset
            ) *
            petal.sway *
            0.01 *
            currentIntensity

            petal.rotation +=
            petal.rotationSpeed *
            (0.6 + petal.depth * 0.4)

        if (
          petal.y >
          window.innerHeight +
            petal.size
        ) {
          petal.y =
            -petal.size

          petal.x =
            Math.random() *
            window.innerWidth
        }

        drawPetal(petal)
      })

      animationFrame =
        requestAnimationFrame(
          animate
        )
    }

    animate()

    return () => {
      cancelAnimationFrame(
        animationFrame
      )

      window.removeEventListener(
        "resize",
        resizeCanvas
      )
    }
  }, [])



  return (
    <canvas
      ref={canvasRef}
      className="
        pointer-events-none
        fixed
        inset-0
        z-[10]
      "
    />
  )
}

export default SakuraParticles