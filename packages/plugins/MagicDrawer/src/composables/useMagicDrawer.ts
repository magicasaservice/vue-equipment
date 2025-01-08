import { computed, toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useDrawerState } from './private/useDrawerState'

import type { DrawerSnapPoint } from '../types/index'

export function useMagicDrawer(id: MaybeRef<string>) {
  // Private methods
  const { initializeState } = useDrawerState(toValue(id))

  const { progress, active } = initializeState()

  // Public state
  const isActive = computed(() => active.value)

  // Public methods
  function open() {
    active.value = true
  }

  function close() {
    active.value = false
  }

  function snapTo(snapPoint: DrawerSnapPoint, duration?: number) {
    useMagicEmitter().emit('snapTo', {
      id: toValue(id),
      snapPoint,
      duration,
    })
  }

  return {
    isActive,
    progress,
    open,
    close,
    snapTo,
  }
}

export type UseMagicDrawerReturn = ReturnType<typeof useMagicDrawer>
