import { toValue, toRefs, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useTrayState } from './private/useTrayState'

import type { TraySide, TraySnapPoint, MagicTrayOptions } from '../types/index'

export function useMagicTray(id: MaybeRef<string>, options?: MagicTrayOptions) {
  const { initializeState } = useTrayState(toValue(id))
  const state = initializeState(options)
  const { progress, activeSnapPoint } = toRefs(state)
  const emitter = useMagicEmitter()

  // Public functions
  function snapTo(side: TraySide, snapPoint: TraySnapPoint, duration?: number) {
    emitter.emit('snapTo', {
      id: toValue(id),
      snapPoint: { side, point: snapPoint },
      duration,
    })
  }

  return {
    progress,
    activeSnapPoint,
    state,
    snapTo,
  }
}

export type UseMagicTrayReturn = ReturnType<typeof useMagicTray>
