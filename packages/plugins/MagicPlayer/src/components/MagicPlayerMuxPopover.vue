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
<script setup lang="ts">
import { shallowRef, onMounted, watch, computed, type Ref } from 'vue'
import { useDevicePixelRatio } from '@vueuse/core'
import { usePlayerApi } from '../composables/usePlayerApi'

type Props = {
  id: string
  playbackId: string
}

type MuxStoryboard = {
  url: string
  tile_width: number
  tile_height: number
  duration: number
  tiles: Array<{
    start: number
    x: number
    y: number
  }>
}

const props = defineProps<Props>()

const { instance } = usePlayerApi(props.id)

const { seekedTime } = instance.value.controlsApi
const { pixelRatio } = useDevicePixelRatio()

const canvas = shallowRef() as Ref<HTMLCanvasElement>
const storyboard = shallowRef<MuxStoryboard | undefined>()
let context: CanvasRenderingContext2D | undefined = undefined
let image: HTMLImageElement | undefined = undefined

const thumbWidth = computed(() => {
  if (!storyboard.value) return 0
  return storyboard.value.tile_width / pixelRatio.value
})

const thumbHeight = computed(() => {
  if (!storyboard.value) return 0
  return storyboard.value.tile_height / pixelRatio.value
})

async function init() {
  if (!props.playbackId) return

  try {
    storyboard.value = await fetch(
      `https://image.mux.com/${props.playbackId}/storyboard.json`,
    ).then((res) => res.json())

    if (!storyboard.value) throw new Error()

    image = new Image()
    image.src = storyboard.value.url
    await image.decode()

    context = canvas.value.getContext('2d')!
    context.drawImage(image, 0, 0)
  } catch (e: any) {
    console.error('Can not initialize timeine preview.', e)
  }
}

function drawFrame(time: number) {
  if (!storyboard.value || !context || !image) return

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
    tile_height,
  )
}

onMounted(init)
watch(() => seekedTime?.value, drawFrame)
</script>

<style lang="css">
:root {
  --magic-player-popover-border-radius: 0.25rem;
}

.magic-player-mux-popover {
  border-radius: var(--magic-player-popover-border-radius);
  overflow: hidden;
}

.magic-player-mux-popover canvas {
  width: 100%;
  height: auto;
}
</style>
