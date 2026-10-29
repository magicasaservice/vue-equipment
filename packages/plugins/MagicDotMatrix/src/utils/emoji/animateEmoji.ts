import { motions } from './motions'
import { pickMotion } from './pickMotion'
import type {
  DotMatrixEmojiAnimation,
  DotMatrixLayeredFrame,
  MagicDotMatrixEmojiOptions,
} from '../../types/index'
import type { EmojiMotion, EmojiPose } from './motions'

type Color = [red: number, green: number, blue: number]

type Canvas = {
  context: CanvasRenderingContext2D
  width: number
  height: number
}

type DrawArgs = {
  canvas: Canvas
  source: HTMLCanvasElement
  pose: EmojiPose
  fit: number
}

type SampleArgs = {
  canvas: Canvas
  cols: number
  rows: number
  threshold: number
}

type DistanceArgs = {
  from: Color
  to: Color
}

type NearestArgs = {
  color: Color
  centroids: Array<Color>
}

type QuantizeArgs = {
  colors: Array<Color>
  count: number
}

export type AnimateEmojiArgs = Required<MagicDotMatrixEmojiOptions> & {
  emoji: string
}

// Rendering resolution only: every dot averages a square of this many pixels.
const cellSize = 24
const fontSize = 320
const fontFamily =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'

function createContext(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d', { willReadFrequently: true })
}

function renderSource(emoji: string): HTMLCanvasElement | undefined {
  const measure = createContext(1, 1)

  if (!measure) {
    return undefined
  }

  measure.font = `${fontSize}px ${fontFamily}`
  const context = createContext(
    Math.ceil(measure.measureText(emoji).width) + fontSize,
    fontSize * 2
  )

  if (!context) {
    return undefined
  }

  const { width, height } = context.canvas
  context.font = `${fontSize}px ${fontFamily}`
  context.fillStyle = '#fff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(emoji, width / 2, height / 2)

  const { data } = context.getImageData(0, 0, width, height)
  let left = width
  let top = height
  let right = -1
  let bottom = -1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((data[(y * width + x) * 4 + 3] ?? 0) > 0) {
        left = Math.min(left, x)
        right = Math.max(right, x)
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
      }
    }
  }

  if (right < 0) {
    return undefined
  }

  const cropped = createContext(right - left + 1, bottom - top + 1)

  if (!cropped) {
    return undefined
  }

  cropped.drawImage(
    context.canvas,
    left,
    top,
    cropped.canvas.width,
    cropped.canvas.height,
    0,
    0,
    cropped.canvas.width,
    cropped.canvas.height
  )

  return cropped.canvas
}

function draw({ canvas, source, pose, fit }: DrawArgs) {
  const { context, width, height } = canvas
  const side = Math.min(width, height)
  const box = fit * side
  const ratio = box / Math.max(source.width, source.height)
  const sourceWidth = source.width * ratio
  const sourceHeight = source.height * ratio
  const centerX = width / 2 + (pose.x ?? 0) * side
  const centerY = height / 2 + (pose.y ?? 0) * side
  const [pivotX, pivotY] = pose.pivot ?? [0.5, 0.5]
  const originX = centerX + (pivotX - 0.5) * sourceWidth
  const originY = centerY + (pivotY - 0.5) * sourceHeight
  const left = centerX - sourceWidth / 2
  const top = centerY - sourceHeight / 2

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, width, height)
  context.translate(originX, originY)
  context.rotate(((pose.rotate ?? 0) * Math.PI) / 180)
  context.transform(1, 0, pose.skew ?? 0, 1, 0, 0)
  context.scale(pose.scaleX ?? pose.scale ?? 1, pose.scaleY ?? pose.scale ?? 1)
  context.translate(-originX, -originY)

  if (!pose.ripple) {
    context.drawImage(source, left, top, sourceWidth, sourceHeight)
    return
  }

  const strips = Math.max(1, Math.round(sourceWidth / 10))

  for (let strip = 0; strip < strips; strip++) {
    const offset =
      pose.ripple.amplitude *
      box *
      Math.sin(Math.PI * 2 * (strip / strips - pose.ripple.phase))

    context.drawImage(
      source,
      (strip / strips) * source.width,
      0,
      source.width / strips + 1,
      source.height,
      left + (strip / strips) * sourceWidth,
      top + offset,
      sourceWidth / strips + 1,
      sourceHeight
    )
  }
}

function sample({
  canvas,
  cols,
  rows,
  threshold,
}: SampleArgs): Array<Color | undefined> {
  const { context, width, height } = canvas
  const { data } = context.getImageData(0, 0, width, height)

  return Array.from({ length: cols * rows }, (_, index) => {
    const startX = (index % cols) * cellSize
    const startY = Math.floor(index / cols) * cellSize
    const total: Color = [0, 0, 0]
    let alpha = 0

    for (let y = startY; y < startY + cellSize; y++) {
      for (let x = startX; x < startX + cellSize; x++) {
        const offset = (y * width + x) * 4
        const weight = data[offset + 3] ?? 0
        alpha += weight
        total[0] += (data[offset] ?? 0) * weight
        total[1] += (data[offset + 1] ?? 0) * weight
        total[2] += (data[offset + 2] ?? 0) * weight
      }
    }

    if (alpha / (cellSize * cellSize * 255) < threshold) {
      return undefined
    }

    return [total[0] / alpha, total[1] / alpha, total[2] / alpha]
  })
}

function distance({ from, to }: DistanceArgs) {
  return (
    (from[0] - to[0]) ** 2 + (from[1] - to[1]) ** 2 + (from[2] - to[2]) ** 2
  )
}

function nearest({ color, centroids }: NearestArgs) {
  let best = 0
  let bestDistance = Infinity

  centroids.forEach((centroid, index) => {
    const gap = distance({ from: centroid, to: color })
    if (gap < bestDistance) {
      best = index
      bestDistance = gap
    }
  })

  return best
}

// Farthest-point seeding keeps the result deterministic, k-means refines it.
function quantize({ colors, count }: QuantizeArgs): Array<Color> {
  const centroids = colors.slice(0, 1)

  while (centroids.length > 0 && centroids.length < count) {
    let farthest: Color | undefined
    let gap = 0

    for (const color of colors) {
      const closest = Math.min(
        ...centroids.map((centroid) => distance({ from: centroid, to: color }))
      )
      if (closest > gap) {
        gap = closest
        farthest = color
      }
    }

    if (!farthest || gap === 0) {
      break
    }

    centroids.push(farthest)
  }

  for (let round = 0; round < 8; round++) {
    const sums = centroids.map((): { total: Color; count: number } => ({
      total: [0, 0, 0],
      count: 0,
    }))

    for (const color of colors) {
      const sum = sums[nearest({ color, centroids })]
      if (sum) {
        sum.total[0] += color[0]
        sum.total[1] += color[1]
        sum.total[2] += color[2]
        sum.count++
      }
    }

    sums.forEach(({ total, count }, index) => {
      if (count > 0) {
        centroids[index] = [
          total[0] / count,
          total[1] / count,
          total[2] / count,
        ]
      }
    })
  }

  return centroids
}

function toHex(color: Color) {
  const channels = color.map((channel) =>
    Math.round(channel).toString(16).padStart(2, '0')
  )
  return `#${channels.join('')}`
}

function toFrame(dots: Array<number>): DotMatrixLayeredFrame {
  const layers: DotMatrixLayeredFrame = Array.from(
    { length: Math.max(0, ...dots) },
    () => []
  )

  dots.forEach((layer, index) => {
    layers[layer - 1]?.push(index)
  })

  return layers
}

export function animateEmoji({
  emoji,
  cols,
  rows,
  colors: colorCount,
  threshold,
}: AnimateEmojiArgs): DotMatrixEmojiAnimation {
  const { name, heading, tint } = pickMotion(emoji)
  const motion: EmojiMotion = motions[name]
  const empty = {
    motion: name,
    interval: motion.interval,
    sequence: [],
    colors: [],
  }
  const source = emoji ? renderSource(emoji) : undefined
  const context = createContext(cols * cellSize, rows * cellSize)

  if (!source || !context) {
    return empty
  }

  const canvas = { context, width: cols * cellSize, height: rows * cellSize }

  const sampled = Array.from({ length: motion.frames }, (_, index) => {
    const progress = index / motion.frames
    draw({
      canvas,
      source,
      pose: motion.pose({ progress, index, heading, tint }),
      fit: motion.fit,
    })
    return sample({ canvas, cols, rows, threshold })
  })

  const lit = sampled.flat().filter((color) => color !== undefined)
  const centroids = quantize({ colors: lit, count: colorCount })
  const counts = centroids.map(() => 0)

  lit.forEach((color) => {
    const index = nearest({ color, centroids })
    counts[index] = (counts[index] ?? 0) + 1
  })

  const order = centroids
    .map((_, index) => index)
    .sort((first, second) => (counts[second] ?? 0) - (counts[first] ?? 0))
  const palette = order.flatMap((index) => {
    const centroid = centroids[index]
    return centroid ? [toHex(centroid)] : []
  })
  const extras = new Map<string, number>()

  function extraLayer(color: string) {
    const layer = extras.get(color) ?? palette.length + extras.size + 1
    extras.set(color, layer)
    return layer
  }

  const sequence = sampled.map((cells, index) => {
    const progress = index / motion.frames
    const dots = cells.map((color) =>
      color ? order.indexOf(nearest({ color, centroids })) + 1 : 0
    )
    const particles =
      motion.particles?.({ progress, index, heading, tint }) ?? []

    particles.forEach((particle) => {
      const col = Math.round(particle.x * cols - 0.5)
      const row = Math.round(particle.y * rows - 0.5)
      const dot = row * cols + col
      if (col >= 0 && row >= 0 && col < cols && row < rows && !dots[dot]) {
        dots[dot] = extraLayer(particle.color)
      }
    })

    if (motion.shine) {
      const [from, to] = motion.shine
      const sweep = (progress - from) / (to - from)

      if (sweep >= 0 && sweep <= 1) {
        const diagonal = sweep * (cols + rows + 1) - 2
        dots.forEach((layer, dot) => {
          const offset = (dot % cols) + Math.floor(dot / cols) - diagonal
          if (layer && offset >= 0 && offset <= 1.5) {
            dots[dot] = extraLayer('#fff')
          }
        })
      }
    }

    return toFrame(dots)
  })

  return {
    motion: name,
    interval: motion.interval,
    sequence,
    colors: [...palette, ...extras.keys()],
  }
}
