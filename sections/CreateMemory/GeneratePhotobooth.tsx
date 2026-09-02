export interface GeneratePhotoboothOptions {
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
      reject(new Error("Failed to load captured image"))
    }

    image.src = src
  })
}

function roundRect(
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
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  )
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius,
  )
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawSakura(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
) {
  const petalRadius = 5 * scale
  const centerRadius = 2.2 * scale

  ctx.save()

  ctx.fillStyle = "#e9a6bb"

  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5

    const px =
      x + Math.cos(angle) * petalRadius * 1.35

    const py =
      y + Math.sin(angle) * petalRadius * 1.35

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

  ctx.fillStyle = "#d78ba5"

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

  const offsetX = x + (maxWidth - width) / 2
  const offsetY = y + (maxHeight - height) / 2

  ctx.drawImage(
    image,
    offsetX,
    offsetY,
    width,
    height,
  )

  return {
    x: offsetX,
    y: offsetY,
    width,
    height,
  }
}

export async function generatePhotobooth(
  photos: string[],
  options: GeneratePhotoboothOptions = {},
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error(
      "generatePhotobooth can only run in the browser.",
    )
  }

  if (photos.length !== 3) {
    throw new Error(
      "Photobooth requires exactly 3 photos.",
    )
  }

  const {
    name = "Dea Chintya",
    date = "02 September 2026",
  } = options

  const loadedImages = await Promise.all(
    photos.map(loadImage),
  )

  /**
   * Canvas dimensions
   *
   * Width is fixed so the result has a consistent
   * premium photobooth-strip appearance.
   *
   * Height is calculated from the original image
   * aspect ratios.
   */
  const canvasWidth = 1080

  const outerPadding = 64
  const photoWidth = canvasWidth - outerPadding * 2

  const photoBorder = 20
  const innerWidth = photoWidth - photoBorder * 2

  const topArea = 190
  const bottomArea = 190

  const photoGap = 34

  const imageHeights = loadedImages.map(
    ({ width, height }) =>
      innerWidth * (height / width),
  )

  const totalPhotoHeight = imageHeights.reduce(
    (sum, height) => sum + height,
    0,
  )

  const totalHeight =
    topArea +
    bottomArea +
    totalPhotoHeight +
    photoGap * 2 +
    outerPadding * 2

  const canvas = document.createElement("canvas")

  canvas.width = canvasWidth
  canvas.height = Math.ceil(totalHeight)

  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error(
      "Unable to create canvas context.",
    )
  }

  /**
   * Background
   */
  ctx.fillStyle = "#fff8fb"
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )

  /**
   * Very subtle vertical background gradient.
   */
  const backgroundGradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height,
    )

  backgroundGradient.addColorStop(
    0,
    "#fffafc",
  )

  backgroundGradient.addColorStop(
    1,
    "#fff5f9",
  )

  ctx.fillStyle = backgroundGradient

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )

  /**
   * Header
   */
  const headerCenterX = canvasWidth / 2

  drawSakura(
    ctx,
    headerCenterX - 150,
    72,
    0.9,
  )

  drawSakura(
    ctx,
    headerCenterX + 150,
    72,
    0.9,
  )

  ctx.fillStyle = "#b96987"
  ctx.font =
    '600 22px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    "THREE LITTLE MOMENTS",
    headerCenterX,
    62,
  )

  ctx.fillStyle = "#592238"
  ctx.font =
    'italic 42px Georgia, "Times New Roman", serif'

  drawCenteredText(
    ctx,
    "from today",
    headerCenterX,
    115,
  )

  ctx.fillStyle = "#a87085"
  ctx.font =
    '400 16px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    "A little collection worth keeping.",
    headerCenterX,
    157,
  )

  /**
   * Photos
   */
  let currentY =
    outerPadding + topArea

  loadedImages.forEach(
    ({ image, width, height }, index) => {
      const imageHeight = imageHeights[index]

      const frameX = outerPadding

      const frameY = currentY

      const frameWidth = photoWidth

      const frameHeight =
        imageHeight + photoBorder * 2

      /**
       * Soft shadow
       */
      ctx.save()

      ctx.shadowColor =
        "rgba(119, 63, 83, 0.12)"

      ctx.shadowBlur = 30

      ctx.shadowOffsetY = 12

      ctx.fillStyle = "#ffffff"

      roundRect(
        ctx,
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        4,
      )

      ctx.fill()

      ctx.restore()

      /**
       * White frame
       */
      ctx.fillStyle = "#ffffff"

      roundRect(
        ctx,
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        4,
      )

      ctx.fill()

      /**
       * Actual photo
       *
       * IMPORTANT:
       * No crop.
       * No stretching.
       * Original ratio is preserved.
       */
      drawContainImage(
        ctx,
        image,
        width,
        height,
        frameX + photoBorder,
        frameY + photoBorder,
        innerWidth,
        imageHeight,
      )

      /**
       * Shot number
       */
      ctx.fillStyle = "#ffffff"

      ctx.beginPath()
      ctx.arc(
        frameX + 48,
        frameY + 48,
        25,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      ctx.fillStyle = "#8f526b"

      ctx.font =
        '600 15px Arial, Helvetica, sans-serif'

      drawCenteredText(
        ctx,
        `0${index + 1}`,
        frameX + 48,
        frameY + 48,
      )

      /**
       * Tiny sakura accent.
       */
      drawSakura(
        ctx,
        frameX + frameWidth - 42,
        frameY + 42,
        0.65,
      )

      currentY +=
        frameHeight + photoGap
    },
  )

  /**
   * Footer separator
   */
  const footerY =
    canvas.height - bottomArea + 30

  ctx.fillStyle = "#e7b6c6"

  ctx.fillRect(
    canvasWidth / 2 - 40,
    footerY,
    80,
    1,
  )

  drawSakura(
    ctx,
    canvasWidth / 2,
    footerY + 34,
    0.7,
  )

  /**
   * Name
   */
  ctx.fillStyle = "#592238"

  ctx.font =
    'italic 34px Georgia, "Times New Roman", serif'

  drawCenteredText(
    ctx,
    `${name} ♡`,
    canvasWidth / 2,
    footerY + 78,
  )

  /**
   * Date
   */
  ctx.fillStyle = "#a87085"

  ctx.font =
    '400 16px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    date,
    canvasWidth / 2,
    footerY + 113,
  )

  /**
   * Tiny signature line.
   */
  ctx.fillStyle = "#b98296"

  ctx.font =
    '400 13px Arial, Helvetica, sans-serif'

  drawCenteredText(
    ctx,
    "kept as a little memory",
    canvasWidth / 2,
    footerY + 146,
  )

  return canvas.toDataURL(
    "image/jpeg",
    0.95,
  )
}