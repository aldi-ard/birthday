"use client"

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
      x +
      Math.cos(angle) *
        petalRadius *
        1.3

    const py =
      y +
      Math.sin(angle) *
        petalRadius *
        1.3

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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()

  ctx.moveTo(
    x + radius,
    y,
  )

  ctx.lineTo(
    x + width - radius,
    y,
  )

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

  ctx.lineTo(
    x,
    y + radius,
  )

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y,
  )

  ctx.closePath()
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

  const width =
    sourceWidth * ratio

  const height =
    sourceHeight * ratio

  const drawX =
    x +
    (maxWidth - width) / 2

  const drawY =
    y +
    (maxHeight - height) / 2

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

/* =========================================================
   LANDSCAPE STORY
========================================================= */

function drawLandscapeStory(
  ctx: CanvasRenderingContext2D,
  images: LoadedImage[],
  name: string,
  date: string,
) {
  const width = 1080
  const height = 1920

  /*
   * Background
   */
  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      height,
    )

  gradient.addColorStop(
    0,
    "#fffafd",
  )

  gradient.addColorStop(
    0.5,
    "#fff7fa",
  )

  gradient.addColorStop(
    1,
    "#fff1f6",
  )

  ctx.fillStyle = gradient

  ctx.fillRect(
    0,
    0,
    width,
    height,
  )

  /*
   * Decorations
   */
  drawSakura(
    ctx,
    90,
    120,
    0.8,
  )

  drawSakura(
    ctx,
    width - 90,
    170,
    0.55,
  )

  drawSakura(
    ctx,
    width - 80,
    height - 130,
    0.7,
  )

  /*
   * Header
   */
  ctx.fillStyle = "#a65f7d"

  ctx.font =
    "600 21px Arial, Helvetica, sans-serif"

  drawCenteredText(
    ctx,
    "THREE LITTLE MOMENTS",
    width / 2,
    100,
  )

  ctx.fillStyle = "#5b243d"

  ctx.font =
    'italic 48px Georgia, "Times New Roman", serif'

  drawCenteredText(
    ctx,
    "today was beautiful",
    width / 2,
    155,
  )

  ctx.fillStyle = "#a9798d"

  ctx.font =
    "400 16px Arial, Helvetica, sans-serif"

  drawCenteredText(
    ctx,
    "A few little moments worth keeping.",
    width / 2,
    200,
  )

  /*
   * Photos
   */
  const horizontalPadding = 70
  const slotWidth =
    width -
    horizontalPadding * 2

  const slotHeight = 410
  const slotGap = 35

  const firstY = 260

  images.forEach(
    ({ image, width: sourceWidth, height: sourceHeight }, index) => {
      const slotY =
        firstY +
        index *
          (slotHeight + slotGap)

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

      const padding = 18

      drawContainImage(
        ctx,
        image,
        sourceWidth,
        sourceHeight,
        horizontalPadding + padding,
        slotY + padding,
        slotWidth - padding * 2,
        slotHeight - padding * 2,
      )

      /*
       * Number
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
        "600 15px Arial, Helvetica, sans-serif"

      drawCenteredText(
        ctx,
        `0${index + 1}`,
        horizontalPadding + 48,
        slotY + 48,
      )

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

  /*
   * Footer
   */
  const footerY = 1625

  ctx.fillStyle = "#e5b0c2"

  ctx.fillRect(
    width / 2 - 45,
    footerY,
    90,
    1,
  )

  drawSakura(
    ctx,
    width / 2,
    footerY + 40,
    0.65,
  )

  ctx.fillStyle = "#5b243d"

  ctx.font =
    'italic 38px Georgia, "Times New Roman", serif'

  drawCenteredText(
    ctx,
    `${name} ♡`,
    width / 2,
    footerY + 88,
  )

  ctx.fillStyle = "#a8788c"

  ctx.font =
    "400 16px Arial, Helvetica, sans-serif"

  drawCenteredText(
    ctx,
    date,
    width / 2,
    footerY + 125,
  )

  ctx.font =
    "400 14px Arial, Helvetica, sans-serif"

  drawCenteredText(
    ctx,
    "a little memory from today",
    width / 2,
    footerY + 160,
  )

  ctx.fillStyle = "#efcbd7"

  ctx.fillRect(
    width / 2 - 90,
    1840,
    180,
    1,
  )
}

/* =========================================================
   PORTRAIT STORY
========================================================= */

function drawPortraitStory(
  ctx: CanvasRenderingContext2D,
  images: LoadedImage[],
  name: string,
  date: string,
) {
  const width = 1080
  const height = 1920

  /*
   * Background
   */
  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height,
    )

  gradient.addColorStop(
    0,
    "#fffafd",
  )

  gradient.addColorStop(
    0.55,
    "#fff7fa",
  )

  gradient.addColorStop(
    1,
    "#fff0f5",
  )

  ctx.fillStyle = gradient

  ctx.fillRect(
    0,
    0,
    width,
    height,
  )

  /*
   * Large decorative sakura.
   */
  drawSakura(
    ctx,
    930,
    115,
    1,
  )

  drawSakura(
    ctx,
    105,
    500,
    0.55,
  )

  drawSakura(
    ctx,
    965,
    1130,
    0.5,
  )

  /*
   * Header — intentionally
   * not centered like landscape.
   */
  ctx.textAlign = "left"
  ctx.textBaseline = "alphabetic"

  ctx.fillStyle = "#a65f7d"

  ctx.font =
    "600 18px Arial, Helvetica, sans-serif"

  ctx.fillText(
    "THREE LITTLE MOMENTS",
    78,
    95,
  )

  ctx.fillStyle = "#5b243d"

  ctx.font =
    'italic 72px Georgia, "Times New Roman", serif'

  ctx.fillText(
    "today was",
    78,
    170,
  )

  ctx.fillText(
    "beautiful.",
    78,
    245,
  )

  ctx.fillStyle = "#a9798d"

  ctx.font =
    "400 15px Arial, Helvetica, sans-serif"

  ctx.fillText(
    "three little pieces of today",
    80,
    280,
  )

  /*
   * Editorial photo configuration.
   *
   * Positions deliberately alternate:
   *
   * 01 → right
   * 02 → left
   * 03 → right
   */
  const photoWidth = 620
  const photoHeight = 390

  const positions = [
    {
      x: 390,
      y: 345,
      rotation: -1.5,
    },
    {
      x: 70,
      y: 775,
      rotation: 1.3,
    },
    {
      x: 390,
      y: 1205,
      rotation: -1,
    },
  ]

  images.forEach(
    (
      { image, width: sourceWidth, height: sourceHeight },
      index,
    ) => {
      const position =
        positions[index]

      ctx.save()

      /*
       * Slight rotation gives the
       * editorial scrapbook feel.
       */
      const centerX =
        position.x +
        photoWidth / 2

      const centerY =
        position.y +
        photoHeight / 2

      ctx.translate(
        centerX,
        centerY,
      )

      ctx.rotate(
        (position.rotation *
          Math.PI) /
          180,
      )

      /*
       * Shadow.
       */
      ctx.shadowColor =
        "rgba(100, 50, 75, 0.14)"

      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 15

      ctx.fillStyle = "#ffffff"

      drawRoundedRect(
        ctx,
        -photoWidth / 2,
        -photoHeight / 2,
        photoWidth,
        photoHeight,
        5,
      )

      ctx.fill()

      ctx.shadowColor = "transparent"

      /*
       * Inner image.
       */
      const padding = 18

      drawContainImage(
        ctx,
        image,
        sourceWidth,
        sourceHeight,
        -photoWidth / 2 + padding,
        -photoHeight / 2 + padding,
        photoWidth - padding * 2,
        photoHeight - padding * 2,
      )

      ctx.restore()

      /*
       * Number placed outside
       * the photo.
       */
      ctx.fillStyle = "#8d536c"

      ctx.font =
        'italic 28px Georgia, "Times New Roman", serif'

      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      ctx.fillText(
        `0${index + 1}`,
        position.x -
          (index === 1 ? 0 : 70),
        position.y +
          photoHeight +
          35,
      )

      /*
       * Small line.
       */
      ctx.fillStyle = "#dfb4c4"

      ctx.fillRect(
        position.x +
          (index === 1 ? 70 : 0),
        position.y +
          photoHeight +
          35,
        45,
        1,
      )
    },
  )

  /*
   * Side vertical phrase.
   */
  ctx.save()

  ctx.translate(
    1000,
    720,
  )

  ctx.rotate(
    Math.PI / 2,
  )

  ctx.fillStyle = "#b47b90"

  ctx.font =
    "400 13px Arial, Helvetica, sans-serif"

  ctx.textAlign = "left"
  ctx.textBaseline = "middle"

  ctx.fillText(
    "SOME MOMENTS DESERVE TO STAY",
    0,
    0,
  )

  ctx.restore()

  /*
   * Footer.
   */
  ctx.fillStyle = "#e4b3c3"

  ctx.fillRect(
    80,
    1660,
    120,
    1,
  )

  ctx.fillStyle = "#5b243d"

  ctx.font =
    'italic 42px Georgia, "Times New Roman", serif'

  ctx.textAlign = "left"

  ctx.fillText(
    `${name} ♡`,
    80,
    1720,
  )

  ctx.fillStyle = "#a8788c"

  ctx.font =
    "400 16px Arial, Helvetica, sans-serif"

  ctx.fillText(
    date,
    80,
    1755,
  )

  ctx.font =
    "400 14px Arial, Helvetica, sans-serif"

  ctx.fillText(
    "kept as a little memory",
    80,
    1790,
  )

  /*
   * Final decoration.
   */
  drawSakura(
    ctx,
    930,
    1760,
    0.7,
  )

  ctx.fillStyle = "#efcbd7"

  ctx.fillRect(
    80,
    1840,
    920,
    1,
  )
}

/* =========================================================
   MAIN GENERATOR
========================================================= */

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

  const images =
    await Promise.all(
      photos.map(loadImage),
    )

  /*
   * Determine orientation from
   * actual captured image.
   */
  const firstImage = images[0]

  const aspectRatio =
    firstImage.width /
    firstImage.height

  const isPortrait =
    aspectRatio < 1

  console.log(
    "[Story Generator]",
    {
      width: firstImage.width,
      height: firstImage.height,
      aspectRatio,
      layout: isPortrait
        ? "portrait"
        : "landscape",
    },
  )

  const canvas =
    document.createElement("canvas")

  canvas.width = 1080
  canvas.height = 1920

  const ctx =
    canvas.getContext("2d")

  if (!ctx) {
    throw new Error(
      "Unable to create canvas context.",
    )
  }

  if (isPortrait) {
    drawPortraitStory(
      ctx,
      images,
      name,
      date,
    )
  } else {
    drawLandscapeStory(
      ctx,
      images,
      name,
      date,
    )
  }

  return canvas.toDataURL(
    "image/jpeg",
    0.95,
  )
}