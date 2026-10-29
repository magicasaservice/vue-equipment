import {
  computed,
  toValue,
  watch,
  type MaybeRef,
  type MaybeRefOrGetter,
} from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useDotMatrixState } from './useDotMatrixState'
import { defaultOptions } from '../../utils/defaultOptions'
import type {
  DotMatrixFrame,
  DotMatrixLayeredFrame,
  DotMatrixSequence,
} from '../../types/index'

export type UseDotMatrixApiParams = {
  instanceId: MaybeRef<string>
  sequence: MaybeRefOrGetter<DotMatrixSequence>
}

export function useDotMatrixApi({
  instanceId,
  sequence,
}: UseDotMatrixApiParams) {
  // Private state
  const { initializeState } = useDotMatrixState(instanceId)
  const state = initializeState()

  const emitter = useMagicEmitter()

  const maxLoops = computed(() => {
    switch (state.options.loop) {
      case true:
      case undefined:
        return Infinity
      case false:
        return 1
      default:
        return Math.max(1, state.options.loop)
    }
  })

  // Public state
  const tones = computed(() => {
    const frame = toValue(sequence)[state.frame] ?? []
    const layers = isLayered(frame) ? frame : [frame]
    const mapped = new Map<number, number>()

    layers.forEach((layer, index) => {
      layer.forEach((dot) => mapped.set(dot, index + 1))
    })

    return mapped
  })

  // Private functions
  function isLayered(
    frame: DotMatrixFrame | DotMatrixLayeredFrame
  ): frame is DotMatrixLayeredFrame {
    return frame.some((entry) => Array.isArray(entry))
  }

  function advance() {
    const length = toValue(sequence).length

    if (length === 0) {
      return
    }

    const next = (state.frame + 1) % length

    if (next === 0) {
      state.loops++
      if (state.loops >= maxLoops.value) {
        state.playing = false
        emitter.emit('finish', { id: toValue(instanceId) })
        return
      }
    }

    state.frame = next
  }

  const { pause, resume } = useIntervalFn(
    advance,
    () => state.options.interval ?? defaultOptions.interval,
    { immediate: false }
  )

  function sync() {
    pause()
    if (state.playing && toValue(sequence).length > 0) {
      resume()
    }
  }

  // Public functions
  function initialize() {
    if (!(state.options.autoplay ?? defaultOptions.autoplay)) {
      state.playing = false
    }

    sync()
  }

  watch(
    () => toValue(sequence),
    () => {
      state.frame = 0
      state.loops = 0
      sync()
    }
  )

  watch(() => state.playing, sync)

  return {
    tones,
    initialize,
  }
}
