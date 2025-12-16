<template>
  <div class="magic-pie" :data-flip="options?.flip" :data-id="id">
    <svg
      id="magic-pie__svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="magic-pie__mask">
        <circle cx="50" cy="50" r="50" fill="white" />
      </mask>
      <g mask="url(#magic-pie__mask)">
        <rect width="100" height="100" />
        <path :d="path" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs, onBeforeUnmount } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { usePieState } from '../composables/private/usePieState'
import type { MagicPieOptions, PiePoint } from '../types'

interface MagicPieProps {
  id: string
  options?: MagicPieOptions
}

const { id, options } = defineProps<MagicPieProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicPie',
  source: 'MagicPie',
})

const { initializeState, deleteState } = usePieState(id)
const state = initializeState()

const { percentage } = toRefs(state)

function generatePath(points: PiePoint[]): string {
  if (points.length < 2) {
    magicError.throwError({
      message: 'At least two points are required to generate a path',
      errorCode: 'missing_points',
    })
  }

  if (!points[0]) {
    magicError.throwError({
      message: 'Points contain invalid coordinates',
      errorCode: 'invalid_points',
    })
  }

  // Start with the first point
  let path = `M ${points[0][0]} ${points[0][1]}`

  // Iterate through the remaining points
  for (let i = 1; i < points.length; i++) {
    if (!points[i]) {
      continue
    }

    path += ` L ${points[i]?.[0]} ${points[i]?.[1]}`
  }

  return path
}

function generatePie(percentage: number, flip?: boolean): string {
  if (percentage < 0 || percentage > 100) {
    magicError.throwError({
      message: 'percentage needs to be between 0 and 100',
      errorCode: 'invalid_percentage',
    })
  }

  const size = 100

  const points: PiePoint[] = [
    [size / 2, size / 2],
    [size / 2, 0],
  ]

  function getEndpoint(percentage: number, size: number): PiePoint {
    const circumference = size * 4
    const distance = (percentage / 100) * circumference

    if (distance === 0) {
      return [size / 2, 0]
    }

    const position = Math.floor(distance / (size / 2)) % 8
    const remainingDistance = distance % (size / 2)

    let x = 0
    let y = 0

    switch (position) {
      case 0:
        x = size / 2 + remainingDistance
        y = 0
        break
      case 1:
        x = size
        y = remainingDistance
        break
      case 2:
        x = size
        y = size / 2 + remainingDistance
        break
      case 3:
        x = size - remainingDistance
        y = size
        break
      case 4:
        x = size / 2 - remainingDistance
        y = size
        break
      case 5:
        x = 0
        y = size - remainingDistance
        break
      case 6:
        x = 0
        y = size / 2 - remainingDistance
        break
      case 7:
        x = remainingDistance
        y = 0
    }

    return [x, y]
  }

  // Add outer edge points
  // to make sure the path does not collapse
  if (flip) {
    if (100 - percentage >= 12.5) {
      points.push([0, 0])
    }
    if (100 - percentage >= 25) {
      points.push([0, size / 2])
    }
    if (100 - percentage >= 37.5) {
      points.push([0, size])
    }
    if (100 - percentage >= 50) {
      points.push([size / 2, size])
    }
    if (100 - percentage >= 62.5) {
      points.push([size, size])
    }
    if (100 - percentage >= 75) {
      points.push([size, size / 2])
    }
    if (100 - percentage >= 87.5) {
      points.push([size, 0])
    }
  } else {
    if (percentage >= 12.5) {
      points.push([size, 0])
    }
    if (percentage >= 25) {
      points.push([size, size / 2])
    }
    if (percentage >= 37.5) {
      points.push([size, size])
    }
    if (percentage >= 50) {
      points.push([size / 2, size])
    }
    if (percentage >= 62.5) {
      points.push([0, size])
    }
    if (percentage >= 75) {
      points.push([0, size / 2])
    }
    if (percentage >= 87.5) {
      points.push([0, 0])
    }
  }

  points.push(getEndpoint(percentage, size))
  return generatePath(points)
}

const path = computed(() => {
  return generatePie(percentage.value, options?.flip)
})

// Lifecycle
onBeforeUnmount(() => {
  deleteState()
})
</script>

<style>
.magic-pie {
  position: relative;

  & path {
    fill: var(--magic-pie-foreground, currentColor);
  }

  & rect {
    fill: var(--magic-pie-background, transparent);
  }
}

#magic-pie__svg {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
