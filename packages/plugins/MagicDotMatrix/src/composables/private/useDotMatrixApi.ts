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
import type { DotMatrixSequence } from '../../types/index'

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
  const activeIndices = computed(
    () => new Set(toValue(sequence)[state.frame] ?? [])
  )

  // Private functions
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
    () => state.frame,
    (frame) => {
      emitter.emit('frameChange', { id: toValue(instanceId), frame })
    }
  )

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
    activeIndices,
    initialize,
  }
}
