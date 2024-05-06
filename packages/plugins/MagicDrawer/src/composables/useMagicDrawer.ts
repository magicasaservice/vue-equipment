import { computed, toValue, type MaybeRef } from 'vue'
import mitt from 'mitt'
import { uuid } from '@maas/vue-equipment/utils'
import { useDrawerStore } from './private/useDrawerStore'
import { useDrawerState } from './private/useDrawerState'

import type { SnapPoint, DrawerEvents } from '../types/index'

const emitter = mitt<DrawerEvents>()

export function useMagicDrawer(id?: MaybeRef<string>) {
  // Private state
  const mappedId = computed(() => toValue(id) || uuid())

  // Private methods
  const { drawerStore, addInstance, removeInstance } = useDrawerStore()
  const { deleteState, findState } = useDrawerState(mappedId.value)

  const { progress } = findState()

  // Public state
  const isActive = computed(() => drawerStore.value.includes(mappedId.value))

  // Public methods
  function open() {
    addInstance(mappedId.value)
  }

  function close() {
    removeInstance(mappedId.value)
    deleteState()
  }

  function snapTo(snapPoint: SnapPoint, duration?: number) {
    emitter.emit('snapTo', {
      id: mappedId.value,
      snapPoint,
      duration,
    })
  }

  return {
    id: mappedId,
    emitter,
    isActive,
    progress,
    open,
    close,
    snapTo,
  }
}

export type UseMagicDrawerReturn = ReturnType<typeof useMagicDrawer>
