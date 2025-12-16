<template>
  <div class="magic-noise" :data-loading="!isReady">
    <div class="magic-noise__inner">
      <canvas ref="canvas" class="magic-noise__canvas" />
      <canvas ref="offCanvas" class="magic-noise__off-canvas" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
  onUnmounted,
  watch,
  useTemplateRef,
  onBeforeUnmount,
} from 'vue'
import { useResizeObserver, useDebounceFn } from '@vueuse/core'
import { useNoiseApi } from '../composables/private/useNoiseApi'
import type { MagicNoiseOptions } from '../types'

interface MagicNoiseProps {
  options?: MagicNoiseOptions
  pause?: boolean
}

const { pause = false, options } = defineProps<MagicNoiseProps>()

const canvasRef = useTemplateRef('canvas')
const offCanvasRef = useTemplateRef('offCanvas')

const noiseApi = useNoiseApi({
  canvasRef,
  offCanvasRef,
  options,
})

const {
  initialize,
  drawControls,
  transferControls,
  throttledDraw,
  throttledRotateAndTransfer,
  isReady,
} = noiseApi

const resizeObserver = useResizeObserver(
  canvasRef,
  useDebounceFn(initialize, 100)
)

watch(
  () => pause,
  (pause) => {
    if (pause) {
      drawControls.value?.pause()
      transferControls.value?.pause()
    } else {
      drawControls.value?.resume()
      transferControls.value?.resume()
    }
  }
)

onMounted(() => {
  throttledDraw()
  throttledRotateAndTransfer()
})

onBeforeUnmount(() => {
  resizeObserver.stop()
})

onUnmounted(() => {
  isReady.value = false
  transferControls.value?.pause()
  drawControls.value?.pause()
})
</script>

<style>
:root {
  --magic-noise-loading-transition: color 300ms ease, opacity 300ms ease;
}

.magic-noise {
  position: relative;
  user-select: none;
  transition: var(--magic-noise-loading-transition);
  background: var(--magic-noise-background, #000);
  &[data-loading='true'] {
    background: var(--magic-noise-loading-background, #000);
    & > .magic-noise__inner {
      opacity: 0;
    }
  }
}

.magic-noise__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: var(--magic-noise-loading-transition);
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
