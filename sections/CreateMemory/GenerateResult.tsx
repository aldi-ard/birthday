export interface GenerateStoryOptions {
  name?: string
  date?: string
}

interface LoadedImage {
  image: HTMLImageElement
  width: number
  height: number
}

function loadImage(src: string): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }

    image.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    image.src = src
  })
}

function drawSakura(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
) {
  const petalRadius = 7 * scale
  const centerRadius = 2.5 * scale

  ctx.save()

  ctx.fillStyle = "#e6a1b8"

  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5

    const px =
      x + Math.cos(angle) * petalRadius * 1.3

    const py =
      y + Math.sin(angle) * petalRadius * 1.3

    ctx.beginPath()
    ctx.arc(
      px,
      py,
      petalRadius,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  ctx.fillStyle = "#d484a0"

  ctx.beginPath()
  ctx.arc(
    x,
    y,
    centerRadius,
    0,
    Math.PI * 2,
  )
  ctx.fill()

  ctx.restore()
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, x, y)
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sourceWidth: number,
  sourceHeight: number,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
) {
  const ratio = Math.min(
    maxWidth / sourceWidth,
    maxHeight / sourceHeight,
  )

  const width = sourceWidth * ratio
  const height = sourceHeight * ratio

  const drawX =
    x + (maxWidth - width) / 2

  const drawY =
    y + (maxHeight - height) / 2

  ctx.drawImage(
    image,
    drawX,
    drawY,
    width,
    height,
  )

  return {
    x: drawX,
    y: drawY,
    width,
    height,
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()

  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius,
  )

  ctx.lineTo(
    x + width,
    y + height - radius,
  )

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  )

  ctx.lineTo(
    x + radius,
    y + height,
  )

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius,
  )

  ctx.lineTo(x, y + radius)

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y,
  )

  ctx.closePath()
}

export async function generateStory(
  photos: string[],
  options: GenerateStoryOptions = {},
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error(
      "generateStory can only run in the browser.",
    )
  }

  if (photos.length !== 3) {
    throw new Error(
      "Instagram Story requires exactly 3 photos.",
    )
  }

  const {
    name = "Dea Chintya",
    date = "02 September 2026",
  } = options

  const images = await Promise.all(
    photos.map(loadImage),
  )

  /**
   * Instagram Story
   *
   * Standard 9:16 canvas.
   */
  const canvasWidth = 1080
  const canvasHeight = 1920

  const canvas = document.createElement("canvas")

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error(
      "Unable to create canvas context.",
    )
  }

  /**
   * Background
   */
  const backgroundGradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvasHeight,
    )

  backgroundGradient.addColorStop(
    0,
    "#fffafd",
  )

  backgroundGradient.addColorStop(
    0.5,
    "#fff7fa",
  )

  backgroundGradient.addColorStop(
    1,
    "#fff1f6",
  )

  ctx.fillStyle = backgroundGradient

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight,
  )

  /**
   * Decorative sakura.
   */
  drawSakura(
    ctx,
    90,
    120,
    0.8,
  )

  drawSakura(
    ctx,
    canvasWidth - 90,
    170,
    0.55,
  )

  drawSakura(
    ctx,
    canvasWidth - 80,
    canvasHeight - 130,
    0.7,
  )

  /**
   * Header
   */
  ctx.fillStyle = "#a65f7d"

  ctx.font =
    '600 21px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    "THREE LITTLE MOMENTS",
    canvasWidth / 2,
    100,
  )

  ctx.fillStyle = "#5b243d"

  ctx.font =
    'italic 48px Georgia, "Times New Roman", serif'

  drawCenteredText(
    ctx,
    "today was beautiful",
    canvasWidth / 2,
    155,
  )

  ctx.fillStyle = "#a9798d"

  ctx.font =
    '400 16px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    "A few little moments worth keeping.",
    canvasWidth / 2,
    200,
  )

  /**
   * Photo layout
   *
   * Three fixed slots.
   *
   * The image is "contain" fitted,
   * therefore:
   *
   * - no crop
   * - no stretch
   * - original aspect ratio preserved
   */
  const horizontalPadding = 70
  const slotWidth =
    canvasWidth - horizontalPadding * 2

  const slotHeight = 410
  const slotGap = 35

  const firstSlotY = 260

  images.forEach(
    ({ image, width, height }, index) => {
      const slotY =
        firstSlotY +
        index * (slotHeight + slotGap)

      /**
       * White photo paper.
       */
      ctx.save()

      ctx.shadowColor =
        "rgba(100, 50, 75, 0.12)"

      ctx.shadowBlur = 28

      ctx.shadowOffsetY = 10

      ctx.fillStyle = "#ffffff"

      drawRoundedRect(
        ctx,
        horizontalPadding,
        slotY,
        slotWidth,
        slotHeight,
        8,
      )

      ctx.fill()

      ctx.restore()

      /**
       * Inner safe area.
       */
      const innerPadding = 18

      const photoAreaX =
        horizontalPadding + innerPadding

      const photoAreaY =
        slotY + innerPadding

      const photoAreaWidth =
        slotWidth - innerPadding * 2

      const photoAreaHeight =
        slotHeight - innerPadding * 2

      /**
       * Soft background behind
       * contain image.
       */
      ctx.fillStyle = "#fffafb"

      ctx.fillRect(
        photoAreaX,
        photoAreaY,
        photoAreaWidth,
        photoAreaHeight,
      )

      /**
       * Full image.
       *
       * This is the key:
       * image ratio remains untouched.
       */
      drawContainImage(
        ctx,
        image,
        width,
        height,
        photoAreaX,
        photoAreaY,
        photoAreaWidth,
        photoAreaHeight,
      )

      /**
       * Number marker.
       */
      ctx.fillStyle = "#ffffff"

      ctx.beginPath()

      ctx.arc(
        horizontalPadding + 48,
        slotY + 48,
        25,
        0,
        Math.PI * 2,
      )

      ctx.fill()

      ctx.fillStyle = "#89516b"

      ctx.font =
        '600 15px Arial, Helvetica, sans-serif'

      drawCenteredText(
        ctx,
        `0${index + 1}`,
        horizontalPadding + 48,
        slotY + 48,
      )

      /**
       * Sakura accent.
       */
      drawSakura(
        ctx,
        horizontalPadding +
          slotWidth -
          42,
        slotY + 42,
        0.5,
      )
    },
  )

  /**
   * Footer
   */
  const footerY = 1625

  ctx.fillStyle = "#e5b0c2"

  ctx.fillRect(
    canvasWidth / 2 - 45,
    footerY,
    90,
    1,
  )

  drawSakura(
    ctx,
    canvasWidth / 2,
    footerY + 40,
    0.65,
  )

  ctx.fillStyle = "#5b243d"

  ctx.font =
    'italic 38px Georgia, "Times New Roman", serif'

  drawCenteredText(
    ctx,
    `${name} ♡`,
    canvasWidth / 2,
    footerY + 88,
  )

  ctx.fillStyle = "#a8788c"

  ctx.font =
    '400 16px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    date,
    canvasWidth / 2,
    footerY + 125,
  )

  ctx.font =
    '400 14px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    "a little memory from today",
    canvasWidth / 2,
    footerY + 160,
  )

  /**
   * Final decorative line.
   */
  ctx.fillStyle = "#efcbd7"

  ctx.fillRect(
    canvasWidth / 2 - 90,
    1840,
    180,
    1,
  )

  return canvas.toDataURL(
    "image/jpeg",
    0.95,
  )
}