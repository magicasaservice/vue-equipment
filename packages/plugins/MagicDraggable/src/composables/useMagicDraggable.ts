import { toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'

import type { DraggableSnapPoint } from '../types/index'

export function useMagicDraggable(id: MaybeRef<string>) {
  // Public functions
  function snapTo(snapPoint: DraggableSnapPoint, duration?: number) {
    useMagicEmitter().emit('snapTo', {
      id: toValue(id),
      snapPoint,
      duration,
    })
  }

  return {
    snapTo,
  }
}

export type UseMagicDrawerReturn = ReturnType<typeof useMagicDraggable>
