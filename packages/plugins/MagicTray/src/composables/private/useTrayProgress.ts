import { watch, toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { clampValue } from '@maas/vue-equipment/utils'
import { useTraySnap } from './useTraySnap'

import type { TrayState, MagicTraySide } from '../../types'

type UseTrayProgressArgs = {
  id: MaybeRef<string>
  state: TrayState
}

const SIDES: MagicTraySide[] = ['top', 'right', 'bottom', 'left']

export function useTrayProgress(args: UseTrayProgressArgs) {
  const { id, state } = args
  const emitter = useMagicEmitter()
  const { padding, contentExtent } = useTraySnap({ id, state })

  // Recompute progress (0 = open, 1 = fully clipped) whenever an inset changes
  watch(
    () => ({ ...state.dragged }),
    (dragged) => {
      for (const side of SIDES) {
        const extent = contentExtent(side)
        const value = extent
          ? clampValue((dragged[side] - padding(side)) / extent, 0, 1)
          : 0

        if (value !== state.progress[side]) {
          state.progress[side] = value

          emitter.emit('progress', {
            id: toValue(id),
            side,
            value,
          })
        }
      }
    },
    { deep: true }
  )

  return {}
}
