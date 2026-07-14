import { computed, toValue, toRefs, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useDrawerState } from './private/useDrawerState'

import type { MagicDrawerSnapPoint, MagicDrawerOptions } from '../types/index'

export function useMagicDrawer(id: MaybeRef<string>, options?: MagicDrawerOptions) {
  const { initializeState } = useDrawerState(toValue(id))
  const state = initializeState(options)
  const { progress, active } = toRefs(state)
  const emitter = useMagicEmitter()

  // Public state
  const isActive = computed(() => active.value)

  // Public functions
  function open() {
    active.value = true
  }

  function close() {
    active.value = false
  }

  function snapTo(snapPoint: MagicDrawerSnapPoint, duration?: number) {
    emitter.emit('snapTo', {
      id: toValue(id),
      snapPoint,
      duration,
    })
  }

  return {
    isActive,
    progress,
    state,
    open,
    close,
    snapTo,
  }
}

export type UseMagicDrawerReturn = ReturnType<typeof useMagicDrawer>
