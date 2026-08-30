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
}

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

function SakuraParticles({
  intensity = 1,
}: SakuraParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
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
      petals.push({
        x:
          Math.random() *
          window.innerWidth,

        y:
          Math.random() *
          window.innerHeight,

        size: randomBetween(
          size.min,
          size.max
        ),

        speed: randomBetween(
          speed.min,
          speed.max
        ),

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
        petal.opacity * intensity

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
      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      )

      petals.forEach((petal) => {
        petal.y +=
          petal.speed *
          intensity

        petal.x +=
          Math.sin(
            petal.y *
              petal.swaySpeed +
              petal.swayOffset
          ) *
          0.4

        petal.rotation +=
          petal.rotationSpeed

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
  }, [intensity])

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