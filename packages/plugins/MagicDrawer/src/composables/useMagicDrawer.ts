import { computed, toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useDrawerStore } from './private/useDrawerStore'
import { useDrawerState } from './private/useDrawerState'

import type { SnapPoint } from '../types/index'

export function useMagicDrawer(id: MaybeRef<string>) {
  // Private methods
  const { drawerStore, addInstance, removeInstance } = useDrawerStore()
  const { deleteState, findState } = useDrawerState(toValue(id))

  const { progress } = findState()

  // Public state
  const isActive = computed(() => drawerStore.value.includes(toValue(id)))

  // Public methods
  function open() {
    addInstance(toValue(id))
  }

  function close() {
    removeInstance(toValue(id))
    deleteState()
  }

  function snapTo(snapPoint: SnapPoint, duration?: number) {
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
