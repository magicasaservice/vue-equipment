<template>
  <canvas
    ref="canvas"
    :width="storyboard?.tile_width"
    :height="storyboard?.tile_height"
  />
</template>
<script setup lang="ts">
import { shallowRef, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

type Props = {
  time: number
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
const canvas = shallowRef() as Ref<HTMLCanvasElement>
let context: CanvasRenderingContext2D | undefined = undefined
const storyboard = shallowRef<MuxStoryboard | undefined>()
let image: HTMLImageElement | undefined = undefined

async function init() {
  if (!props.playbackId) return

  try {
    storyboard.value = await fetch(
      `https://image.mux.com/${props.playbackId}/storyboard.json`
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
    tile_height
  )
}

onMounted(init)
watch(() => props.time, drawFrame)
</script>
