<template>
  <div class="grid grid-cols-2 justify-items-center gap-4 py-8 md:grid-cols-4">
    <magic-dot-matrix
      v-for="emoji in emojis"
      :id="`magic-dot-matrix-emoji-demo-${emoji.name}`"
      :key="emoji.name"
      class="w-32 rounded-xl p-3"
      :sequence="emoji.sequence"
      :options="emoji.options"
    />
  </div>
</template>

<script lang="ts" setup>
import { toIndex } from '@maas/vue-equipment/plugins/MagicDotMatrix'
import type { DotMatrixLayeredFrame } from '@maas/vue-equipment/plugins/MagicDotMatrix'

type Art = Array<string>
type Point = [col: number, row: number]

type PaintArgs = {
  base: Art
  top: Art
  offset?: Point
}

type PlotArgs = {
  points: Array<Point>
  layer: number
}

type SpanArgs = {
  from: number
  to: number
  row: number
}

type HoldArgs = {
  art: Art
  count: number
}

type EmberArgs = {
  flame: Art
  ember: Point
}

type UnderlinesArgs = {
  from: number
  to: number
}

type ShineArgs = {
  art: Art
  diagonal: number
}

const size = 10

function blank(): Art {
  return Array.from({ length: size }, () => '.'.repeat(size))
}

function paint({ base, top, offset = [0, 0] }: PaintArgs): Art {
  const [x, y] = offset

  return base.map((line, row) =>
    [...line]
      .map((char, col) => {
        const source = top[row - y]?.[col - x] ?? '.'
        return source === '.' ? char : source
      })
      .join('')
  )
}

function plot({ points, layer }: PlotArgs): Art {
  return blank().map((line, row) =>
    [...line]
      .map((char, col) =>
        points.some(([x, y]) => x === col && y === row) ? `${layer}` : char
      )
      .join('')
  )
}

function span({ from, to, row }: SpanArgs): Array<Point> {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => [
    from + index,
    row,
  ])
}

function hold({ art, count }: HoldArgs): Array<Art> {
  return Array.from({ length: count }, () => art)
}

function toFrame(art: Art): DotMatrixLayeredFrame {
  const layers: DotMatrixLayeredFrame = Array.from({ length: 9 }, () => [])

  art.forEach((line, row) => {
    ;[...line].forEach((char, col) => {
      layers[Number(char) - 1]?.push(toIndex({ col, row, cols: size }))
    })
  })

  return layers
}

const flameCalm: Art = [
  '....1.....',
  '...11.....',
  '...111....',
  '..1111..1.',
  '..11211.1.',
  '.1112211..',
  '.11223211.',
  '.12233221.',
  '.12333321.',
  '..122221..',
]

const flameRising: Art = [
  '.....1....',
  '....11....',
  '....111...',
  '...1121...',
  '.1.11221..',
  '.11122211.',
  '.11223211.',
  '.12233221.',
  '.12333321.',
  '..122221..',
]

const flameFlaring: Art = [
  '...1......',
  '...11.....',
  '..111...1.',
  '..1111..1.',
  '..11211.11',
  '.11122111.',
  '.11223211.',
  '.12233221.',
  '.12333321.',
  '..122221..',
]

function withEmber({ flame, ember }: EmberArgs): Art {
  return paint({ base: flame, top: plot({ points: [ember], layer: 2 }) })
}

const fire = [
  flameCalm,
  withEmber({ flame: flameRising, ember: [8, 2] }),
  withEmber({ flame: flameFlaring, ember: [6, 1] }),
  withEmber({ flame: flameRising, ember: [7, 0] }),
  flameCalm,
  flameFlaring,
]

const digits: Art = [
  '..........',
  '.1..1...1.',
  '11.1.1.1.1',
  '.1.1.1.1.1',
  '.1.1.1.1.1',
  '.1..1...1.',
  '..........',
  '..........',
  '..........',
  '..........',
]

function underlines({ from, to }: UnderlinesArgs): Art {
  const upper = plot({
    points: span({ from: Math.max(0, from), to: Math.min(9, to), row: 7 }),
    layer: 1,
  })
  const lower = plot({
    points: span({
      from: Math.max(2, from - 2),
      to: Math.min(9, to - 2),
      row: 9,
    }),
    layer: 1,
  })

  return paint({ base: paint({ base: digits, top: upper }), top: lower })
}

function shine({ art, diagonal }: ShineArgs): Art {
  return art.map((line, row) =>
    [...line]
      .map((char, col) => {
        const distance = col + row - diagonal
        return char !== '.' && distance >= 0 && distance <= 1 ? '2' : char
      })
      .join('')
  )
}

const underlined = underlines({ from: 0, to: 11 })

const hundred = [
  ...[1, 3, 5, 7, 9, 11].map((to) => underlines({ from: 0, to })),
  ...Array.from({ length: 18 }, (_, index) =>
    shine({ art: underlined, diagonal: index })
  ),
  ...hold({ art: underlined, count: 6 }),
  ...[2, 4, 6, 8, 10, 12].map((from) => underlines({ from, to: 11 })),
  ...hold({ art: digits, count: 2 }),
]

const ship: Art = [
  '........22',
  '.......222',
  '......1112',
  '.....1331.',
  '....1331..',
  '...11311..',
  '..21111...',
  '.22111....',
  '.2212.....',
  '...22.....',
]

const exhausts: Array<Art> = [['54'], ['45'], ['.5'], ['45'], ['55']]

const stars = [
  { diagonal: 2, phase: 0 },
  { diagonal: 5, phase: 6 },
  { diagonal: 16, phase: 3 },
]

const rocket = Array.from({ length: size }, (_, tick) => {
  const field = plot({
    points: stars.map(({ diagonal, phase }): Point => {
      const col = Math.min(size - 1, diagonal) - ((tick + phase) % size)
      return [col, diagonal - col]
    }),
    layer: 6,
  })
  const flying = paint({
    base: ship,
    top: exhausts[tick % exhausts.length] ?? [],
    offset: [0, 9],
  })

  return paint({ base: field, top: flying })
})

const hand: Art = [
  '...11.....',
  '...11.....',
  '..1112....',
  '.11111111.',
  '.11112222.',
  '.11111111.',
  '.11112222.',
  '.11111111.',
  '..111122..',
]

const sparkle = plot({
  points: [
    [8, 0],
    [7, 1],
    [9, 1],
  ],
  layer: 3,
})

const resting = paint({ base: blank(), top: hand, offset: [0, 1] })
const raised = paint({
  base: paint({ base: blank(), top: hand }),
  top: sparkle,
})

const thumbsUp = [
  ...hold({ art: resting, count: 6 }),
  ...hold({ art: raised, count: 2 }),
  resting,
  ...hold({ art: raised, count: 2 }),
  ...hold({ art: resting, count: 4 }),
]

const emojis = [
  { name: 'fire', art: fire, interval: 110 },
  { name: 'hundred', art: hundred, interval: 70 },
  { name: 'rocket', art: rocket, interval: 90 },
  { name: 'thumbs-up', art: thumbsUp, interval: 90 },
].map(({ name, art, interval }) => ({
  name,
  sequence: art.map(toFrame),
  options: { cols: size, rows: size, interval },
}))
</script>

<style>
[data-id^='magic-dot-matrix-emoji-demo'] {
  --magic-dot-matrix-radius: 0.5;
  background: #000;
}

[data-id='magic-dot-matrix-emoji-demo-fire'] {
  --magic-dot-matrix-inactive-color: #2a1712;
  --magic-dot-matrix-color-1: #f2612c;
  --magic-dot-matrix-color-2: #fbc23f;
  --magic-dot-matrix-color-3: #fff4d6;
}

[data-id='magic-dot-matrix-emoji-demo-hundred'] {
  --magic-dot-matrix-inactive-color: #2a1214;
  --magic-dot-matrix-color-1: #ef3b3b;
  --magic-dot-matrix-color-2: #ffe3e3;
}

[data-id='magic-dot-matrix-emoji-demo-rocket'] {
  --magic-dot-matrix-inactive-color: #141729;
  --magic-dot-matrix-color-1: #e9edf3;
  --magic-dot-matrix-color-2: #e8414a;
  --magic-dot-matrix-color-3: #4aa8f0;
  --magic-dot-matrix-color-4: #f57b2a;
  --magic-dot-matrix-color-5: #ffd24a;
  --magic-dot-matrix-color-6: #5a5f8c;
}

[data-id='magic-dot-matrix-emoji-demo-thumbs-up'] {
  --magic-dot-matrix-inactive-color: #231a14;
  --magic-dot-matrix-color-1: #c99268;
  --magic-dot-matrix-color-2: #7a4a2c;
  --magic-dot-matrix-color-3: #ffd24a;
}
</style>
