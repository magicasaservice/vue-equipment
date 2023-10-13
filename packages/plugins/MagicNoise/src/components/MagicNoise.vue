<template>
  <div class="magic-noise" :class="{ '-loading': !isReady }">
    <div :class="{ '-loading': !isReady }" class="magic-noise__inner">
      <canvas ref="canvasRef" class="magic-noise__canvas" />
      <canvas ref="offCanvasRef" class="magic-noise__off-canvas" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, computed, watch, ref, shallowRef } from 'vue'
import { useResizeObserver, useDebounceFn } from '@vueuse/core'
import { useNoiseApi } from '../composables/useNoiseApi'

interface Props {
  pixelSize?: number
  tiles?: number
  fps?: number
  color?: string
  pause?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pixelSize: 2,
  tiles: 32,
  fps: 8,
  color: '#000',
  pause: false,
})

const canvasRef = shallowRef<HTMLCanvasElement | undefined>(undefined)
const offCanvasRef = shallowRef<HTMLCanvasElement | undefined>(undefined)

const options = computed(() => {
  return {
    pixelSize: props.pixelSize,
    tiles: props.tiles,
    fps: props.fps,
    color: props.color,
  }
})

const noiseApi = useNoiseApi({ canvasRef, offCanvasRef, options })
const {
  initialize,
  drawControls,
  transferControls,
  throttledDraw,
  throttledRotateAndTransfer,
  isReady,
} = noiseApi

useResizeObserver(canvasRef, useDebounceFn(initialize, 100))

watch(
  () => props.pause,
  (pause) => {
    if (pause) {
      drawControls.value?.pause()
      transferControls.value?.pause()
    } else {
      drawControls.value?.resume()
      transferControls.value?.resume()
    }
  },
)

onMounted(() => {
  throttledDraw()
  throttledRotateAndTransfer()
})

onUnmounted(() => {
  isReady.value = false
  transferControls.value?.pause()
  drawControls.value?.pause()
})
</script>

<style lang="css">
:root {
  --magic-noise-loading-background: #000;
  --magic-noise-loading-transition: color 300ms ease, opacity 300ms ease;
}

.magic-noise {
  position: relative;
  user-select: none;
  transition: var(--magic-noise-loading-transition);
  &.-loading {
    background: var(--magic-noise-loading-background);
  }
}

.magic-noise__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: var(--magic-noise-loading-transition);
  &.-loading {
    opacity: 0;
  }
}

.magic-noise__canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

.magic-noise__off-canvas {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>
