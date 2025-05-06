<template>
  <div
    :style="{
      width: `${thumbWidth}px`,
      height: `${thumbHeight}px`,
    }"
    class="magic-player-mux-popover"
  >
    <canvas
      ref="canvas"
      :width="storyboard?.tile_width"
      :height="storyboard?.tile_height"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  toRefs,
  shallowRef,
  onMounted,
  watch,
  computed,
  inject,
  useTemplateRef,
} from 'vue'
import { useDevicePixelRatio } from '@vueuse/core'
import { usePlayerState } from '../composables/private/usePlayerState'
import { MagicPlayerInstanceId, MagicPlayerOptionsKey } from '../symbols'

interface MagicPlayerMuxPopoverProps {
  playbackId?: string
}

interface Tile {
  start: number
  x: number
  y: number
}

interface MuxStoryboard {
  url: string
  tile_width: number
  tile_height: number
  duration: number
  tiles: Tile[]
}

const { playbackId } = defineProps<MagicPlayerMuxPopoverProps>()

const instanceId = inject(MagicPlayerInstanceId, undefined)
const injectedOptions = inject(MagicPlayerOptionsKey, undefined)

if (!instanceId || !injectedOptions) {
  throw new Error(
    'MagicPlayerMuxPopover must be nested inside MagicPlayerVideoControls.'
  )
}

const { initializeState } = usePlayerState(instanceId)
const state = initializeState()
const { seekedTime } = toRefs(state)

const { pixelRatio } = useDevicePixelRatio()

const canvasRef = useTemplateRef('canvas')
const storyboard = shallowRef<MuxStoryboard | undefined>()

let context: CanvasRenderingContext2D | null | undefined = undefined
let image: HTMLImageElement | undefined = undefined

const thumbWidth = computed(() => {
  if (!storyboard.value) {
    return 0
  }

  return storyboard.value.tile_width / pixelRatio.value
})

const thumbHeight = computed(() => {
  if (!storyboard.value) {
    return 0
  }

  return storyboard.value.tile_height / pixelRatio.value
})

function getMuxId(url?: string) {
  const match = url?.match(/mux\.com\/([^\/]+)/)
  return match?.[1]?.replace(/\.(m3u8|mp4)$/, '')
}

function drawFrame(time: number | null) {
  if (!storyboard.value || !context || !image || !time) {
    return
  }

  const { tile_height, tile_width, tiles } = storyboard.value

  let closestIndex = -1
  let minDifference = Infinity

  for (let i = 0; i < tiles.length; i++) {
    const { start } = tiles[i]
    const difference = Math.abs(start - time)

    if (difference < minDifference) {
      minDifference = difference
      closestIndex = i
    }
  }

  const tile = tiles[closestIndex]

  context.drawImage(
    image,
    tile.x,
    tile.y,
    tile_width,
    tile_height,
    0,
    0,
    tile_width,
    tile_height
  )
}

async function initialize() {
  const parsedPlaybackId = getMuxId(injectedOptions?.src)
  const mappedPlaybackId = playbackId ?? parsedPlaybackId

  if (!mappedPlaybackId) {
    console.error(
      'MagicPlayerMuxPopover must be nested inside MagicPlayerProvider or a playbackId must be provided'
    )
    return
  }

  try {
    storyboard.value = await fetch(
      `https://image.mux.com/${mappedPlaybackId}/storyboard.json`
    ).then((res) => res.json())

    if (!storyboard.value) {
      throw new Error()
    }

    image = new Image()
    image.src = storyboard.value.url
    await image.decode()

    context = canvasRef.value?.getContext('2d')

    // Draw initial frame
    drawFrame(seekedTime.value)
  } catch (e: unknown) {
    console.error('Can not initialize timeline preview', e)
  }
}

// Lifecycle hooks
onMounted(() => {
  initialize()
})

watch(
  () => seekedTime?.value,
  (value) => drawFrame(value)
)
</script>

<style>
.magic-player-mux-popover {
  border-radius: var(--magic-player-popover-border-radius, 0.25rem);
  overflow: hidden;
}

.magic-player-mux-popover canvas {
  width: 100%;
  height: auto;
}
</style>
