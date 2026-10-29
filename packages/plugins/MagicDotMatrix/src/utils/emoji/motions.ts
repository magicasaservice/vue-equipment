import type { DotMatrixEmojiMotion } from '../../types/index'

// Offsets are fractions of the grid’s shorter side, particle positions are
// fractions of its width and height, so every motion scales with the grid.
export type EmojiPose = {
  x?: number
  y?: number
  rotate?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  skew?: number
  pivot?: [x: number, y: number]
  ripple?: { amplitude: number; phase: number }
}

export type EmojiParticle = {
  x: number
  y: number
  color: string
}

export type EmojiMotionContext = {
  progress: number
  index: number
  heading: number
  tint: string | undefined
}

export type EmojiMotion = {
  frames: number
  interval: number
  fit: number
  shine?: [from: number, to: number]
  pose: (context: EmojiMotionContext) => EmojiPose
  particles?: (context: EmojiMotionContext) => Array<EmojiParticle>
}

type OscillateArgs = {
  progress: number
  cycles?: number
  phase?: number
}

type PulseArgs = {
  progress: number
  from: number
  to: number
}

type DriftArgs = {
  progress: number
  offset: number
}

type StreakArgs = {
  progress: number
  heading: number
  color: string
}

function oscillate({ progress, cycles = 1, phase = 0 }: OscillateArgs) {
  return Math.sin(Math.PI * 2 * (progress * cycles + phase))
}

function pulse({ progress, from, to }: PulseArgs) {
  return progress < from || progress > to
    ? 0
    : Math.sin((Math.PI * (progress - from)) / (to - from))
}

function easeOut(progress: number) {
  return 1 - (1 - progress) ** 3
}

function drift({ progress, offset }: DriftArgs) {
  return (progress + offset) % 1
}

function streaks({ progress, heading, color }: StreakArgs) {
  const angle = (heading * Math.PI) / 180
  const backX = -Math.cos(angle)
  const backY = -Math.sin(angle)

  return [-0.3, 0, 0.3].map((lane, index) => {
    const travel = drift({ progress, offset: index / 3 }) * 1.4 - 0.7

    return {
      x: 0.5 - backY * lane + backX * travel,
      y: 0.5 + backX * lane + backY * travel,
      color,
    }
  })
}

export const motions = {
  beat: {
    frames: 16,
    interval: 70,
    fit: 0.84,
    pose: ({ progress }) => ({
      scale:
        1 +
        0.16 * pulse({ progress, from: 0, to: 0.14 }) +
        0.1 * pulse({ progress, from: 0.2, to: 0.32 }),
    }),
  },
  flicker: {
    frames: 12,
    interval: 90,
    fit: 0.9,
    pose: ({ progress }) => ({
      pivot: [0.5, 1],
      scaleY:
        1 +
        0.07 * oscillate({ progress, cycles: 2 }) +
        0.04 * oscillate({ progress, cycles: 5, phase: 0.3 }),
      skew: 0.12 * oscillate({ progress, phase: 0.1 }),
    }),
    particles: ({ progress }) =>
      [0, 0.5].map((offset) => {
        const rise = drift({ progress: progress * 1.5, offset })
        return {
          x: 0.7 + Math.sin(rise * 9) * 0.08,
          y: 0.3 - rise * 0.4,
          color: '#ffd24a',
        }
      }),
  },
  swing: {
    frames: 20,
    interval: 70,
    fit: 0.84,
    pose: ({ progress }) => ({
      pivot: [0.5, 0],
      rotate: 22 * oscillate({ progress }),
    }),
  },
  wave: {
    frames: 20,
    interval: 70,
    fit: 0.74,
    pose: ({ progress }) => ({
      pivot: [0.5, 1],
      y: 0.06,
      rotate:
        progress < 0.6
          ? 20 * oscillate({ progress: progress / 0.6, cycles: 2 })
          : 0,
    }),
  },
  fly: {
    frames: 10,
    interval: 80,
    fit: 0.86,
    pose: ({ progress, heading }) => {
      const angle = ((heading + 90) * Math.PI) / 180
      return {
        x: 0.025 * Math.cos(angle) * oscillate({ progress }),
        y: 0.025 * Math.sin(angle) * oscillate({ progress }),
      }
    },
    particles: ({ progress, heading }) =>
      streaks({ progress, heading, color: '#8a90b8' }),
  },
  drive: {
    frames: 8,
    interval: 80,
    fit: 0.78,
    pose: ({ index }) => ({ y: index % 4 === 0 ? 0.045 : 0.07 }),
    particles: ({ progress, heading }) => {
      const behind = Math.cos((heading * Math.PI) / 180) < 0 ? 1 : -1
      const lines = [0.29, 0.51].map((y, index) => {
        const travel = drift({ progress, offset: index / 2 }) * 0.2
        return {
          x: behind > 0 ? 0.8 + travel : 0.2 - travel,
          y,
          color: '#8a90b8',
        }
      })
      const road = [0.05, 0.35, 0.65, 0.95].map((x) => ({
        x: (((x + behind * progress * 0.3) % 1) + 1) % 1,
        y: 0.95,
        color: '#4c5070',
      }))
      return [...lines, ...road]
    },
  },
  bounce: {
    frames: 14,
    interval: 70,
    fit: 0.72,
    pose: ({ progress }) => {
      const landed = progress < 0.08 || progress > 0.92
      return {
        pivot: [0.5, 1],
        y: 0.14 - 0.26 * Math.sin(Math.PI * progress),
        scaleX: landed ? 1.12 : 1,
        scaleY: landed ? 0.85 : 1,
      }
    },
  },
  hop: {
    frames: 18,
    interval: 70,
    fit: 0.8,
    pose: ({ progress }) => ({
      pivot: [0.5, 1],
      y:
        0.1 -
        0.14 *
          (pulse({ progress, from: 0, to: 0.22 }) +
            pulse({ progress, from: 0.26, to: 0.48 })),
    }),
  },
  spin: {
    frames: 16,
    interval: 70,
    fit: 0.9,
    pose: ({ progress }) => ({ rotate: 360 * progress }),
  },
  flip: {
    frames: 16,
    interval: 70,
    fit: 0.9,
    pose: ({ progress }) => {
      const turn = Math.cos(Math.PI * 2 * progress)
      return { scaleX: Math.sign(turn || 1) * Math.max(0.2, Math.abs(turn)) }
    },
  },
  float: {
    frames: 20,
    interval: 80,
    fit: 0.82,
    pose: ({ progress }) => ({
      y: 0.07 * oscillate({ progress }),
      rotate: 5 * oscillate({ progress, phase: 0.25 }),
    }),
  },
  twinkle: {
    frames: 16,
    interval: 80,
    fit: 0.8,
    pose: ({ progress }) => ({
      scale: 1 + 0.08 * oscillate({ progress, cycles: 2 }),
    }),
    particles: ({ progress }) =>
      [
        { x: 0.11, y: 0.13, offset: 0 },
        { x: 0.91, y: 0.17, offset: 0.33 },
        { x: 0.88, y: 0.9, offset: 0.66 },
        { x: 0.14, y: 0.87, offset: 0.5 },
      ].flatMap(({ x, y, offset }) =>
        drift({ progress, offset }) < 0.3 ? [{ x, y, color: '#fff' }] : []
      ),
  },
  shake: {
    frames: 16,
    interval: 60,
    fit: 0.86,
    pose: ({ progress, index }) => {
      const side = index % 2 ? 1 : -1
      return progress < 0.5 ? { x: 0.045 * side, rotate: 4 * side } : {}
    },
  },
  rain: {
    frames: 12,
    interval: 80,
    fit: 0.68,
    pose: () => ({ y: -0.14 }),
    particles: ({ progress, tint }) =>
      [
        { x: 0.25, offset: 0 },
        { x: 0.45, offset: 0.5 },
        { x: 0.65, offset: 0.25 },
        { x: 0.85, offset: 0.75 },
      ].map(({ x, offset }) => ({
        x,
        y: 0.61 + drift({ progress, offset }) * 0.4,
        color: tint ?? '#5aa7ff',
      })),
  },
  snow: {
    frames: 20,
    interval: 90,
    fit: 0.8,
    pose: () => ({ y: 0.09 }),
    particles: ({ progress }) =>
      [
        { x: 0.15, offset: 0 },
        { x: 0.4, offset: 0.6 },
        { x: 0.65, offset: 0.3 },
        { x: 0.9, offset: 0.85 },
      ].map(({ x, offset }) => {
        const fall = drift({ progress, offset })
        return {
          x: x + Math.sin(fall * 6 + offset * 10) * 0.06,
          y: fall * 1.1 - 0.05,
          color: '#fff',
        }
      }),
  },
  sleep: {
    frames: 20,
    interval: 90,
    fit: 0.74,
    pose: ({ progress }) => ({
      x: -0.1,
      y: 0.12 + 0.015 * oscillate({ progress }),
    }),
    particles: ({ progress }) =>
      [0, 0.5].map((offset) => {
        const rise = drift({ progress, offset })
        return {
          x: 0.65 + rise * 0.3 + Math.sin(rise * 12) * 0.04,
          y: 0.4 - rise * 0.35,
          color: '#fff',
        }
      }),
  },
  rock: {
    frames: 12,
    interval: 70,
    fit: 0.86,
    pose: ({ progress }) => ({
      pivot: [0.5, 0.9],
      rotate: 12 * oscillate({ progress, cycles: 2 }),
    }),
  },
  burst: {
    frames: 18,
    interval: 70,
    fit: 0.78,
    pose: ({ progress }) => ({
      scale:
        progress < 0.15
          ? 0.8 + 0.3 * easeOut(progress / 0.15)
          : 1.1 - 0.1 * Math.min(1, (progress - 0.15) * 5),
    }),
    particles: ({ progress }) => {
      const colors = ['#ff5aa5', '#ffd24a', '#4ad8ff', '#7cff6b']
      return Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2 + 0.3
        const radius = 0.2 + progress * 0.45
        return {
          x: 0.5 + Math.cos(angle) * radius,
          y: 0.5 + Math.sin(angle) * radius,
          color: colors[index % colors.length] ?? '#fff',
        }
      })
    },
  },
  stamp: {
    frames: 30,
    interval: 70,
    fit: 0.86,
    shine: [0.35, 0.65],
    pose: ({ progress }) => {
      if (progress < 0.12) {
        return { scale: 1.5 - 0.6 * easeOut(progress / 0.12) }
      }
      if (progress < 0.2) {
        return { scale: 0.9 + 0.1 * easeOut((progress - 0.12) / 0.08) }
      }
      return {}
    },
  },
  gleam: {
    frames: 28,
    interval: 70,
    fit: 0.86,
    shine: [0.3, 0.6],
    pose: ({ progress }) => ({ y: 0.02 * oscillate({ progress }) }),
  },
  flag: {
    frames: 12,
    interval: 80,
    fit: 0.9,
    pose: ({ progress }) => ({ ripple: { amplitude: 0.07, phase: progress } }),
  },
  sway: {
    frames: 24,
    interval: 80,
    fit: 0.88,
    pose: ({ progress }) => ({
      pivot: [0.5, 1],
      rotate: 7 * oscillate({ progress }),
    }),
  },
  love: {
    frames: 20,
    interval: 80,
    fit: 0.78,
    pose: ({ progress }) => ({
      y: 0.06 + 0.03 * oscillate({ progress, cycles: 2 }),
    }),
    particles: ({ progress }) =>
      [
        { x: 0.15, offset: 0 },
        { x: 0.87, offset: 0.5 },
      ].map(({ x, offset }) => {
        const rise = drift({ progress, offset })
        return {
          x: x + Math.sin(rise * 10) * 0.04,
          y: 0.75 - rise * 0.7,
          color: '#ff4f8b',
        }
      }),
  },
  steam: {
    frames: 16,
    interval: 90,
    fit: 0.72,
    pose: () => ({ y: 0.14 }),
    particles: ({ progress }) =>
      [0.4, 0.6].map((x, index) => {
        const rise = drift({ progress, offset: index / 2 })
        return {
          x: x + Math.sin(rise * 8 + index) * 0.06,
          y: 0.35 - rise * 0.3,
          color: '#d9d9d9',
        }
      }),
  },
  look: {
    frames: 24,
    interval: 80,
    fit: 0.86,
    pose: ({ progress }) => {
      if (progress >= 0.2 && progress < 0.45) {
        return { x: -0.07 }
      }
      if (progress >= 0.55 && progress < 0.8) {
        return { x: 0.07 }
      }
      return {}
    },
  },
  nod: {
    frames: 16,
    interval: 70,
    fit: 0.86,
    pose: ({ progress }) => ({
      y:
        0.06 *
        (pulse({ progress, from: 0, to: 0.18 }) +
          pulse({ progress, from: 0.22, to: 0.4 })),
    }),
  },
  tilt: {
    frames: 24,
    interval: 80,
    fit: 0.84,
    pose: ({ progress }) => {
      const lean =
        progress < 0.3
          ? easeOut(progress / 0.3)
          : progress < 0.7
            ? 1
            : 1 - easeOut((progress - 0.7) / 0.3)
      return { pivot: [0.5, 1], x: 0.04 * lean, rotate: 20 * lean }
    },
  },
  swim: {
    frames: 20,
    interval: 80,
    fit: 0.8,
    pose: ({ progress }) => ({
      x: 0.09 * oscillate({ progress }),
      y: 0.03 * oscillate({ progress, cycles: 2 }),
      rotate: 6 * oscillate({ progress, cycles: 2 }),
    }),
    particles: ({ progress }) => [
      {
        x: 0.2,
        y: 0.65 - drift({ progress: progress * 2, offset: 0 }) * 0.6,
        color: '#a8dcff',
      },
    ],
  },
  flap: {
    frames: 12,
    interval: 70,
    fit: 0.84,
    pose: ({ progress }) => ({
      scaleX: 1 - 0.35 * Math.abs(oscillate({ progress, cycles: 2 })),
      y: 0.04 * oscillate({ progress }),
    }),
  },
  clap: {
    frames: 10,
    interval: 70,
    fit: 0.84,
    pose: ({ progress }) => ({
      scaleX: 1 - 0.25 * pulse({ progress, from: 0, to: 0.5 }),
    }),
  },
  bob: {
    frames: 20,
    interval: 80,
    fit: 0.86,
    pose: ({ progress }) => ({
      y: 0.055 * oscillate({ progress }),
      rotate: 6 * oscillate({ progress, phase: 0.25 }),
    }),
  },
  pop: {
    frames: 34,
    interval: 70,
    fit: 0.92,
    shine: [0.4, 0.68],
    pose: ({ progress }) => {
      if (progress < 0.12) {
        return { scale: easeOut(progress / 0.12) }
      }
      if (progress > 0.9) {
        return { scale: 1 - easeOut((progress - 0.9) / 0.1) }
      }
      return {}
    },
  },
} satisfies Record<DotMatrixEmojiMotion, EmojiMotion>
