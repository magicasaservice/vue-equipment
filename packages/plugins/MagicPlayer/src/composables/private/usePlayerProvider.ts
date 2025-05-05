import { toRefs, type MaybeRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { isIOS } from '@maas/vue-equipment/utils'
import { usePlayerState } from './usePlayerState'

export function usePlayerProvider(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = usePlayerState(id)
  const state = initializeState()
  const { mouseEntered, touched } = toRefs(state)

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined

  // Private functions
  function onPointerup() {
    touched.value = false

    cancelPointerup?.()
    cancelTouchend?.()
    cancelPointerup = undefined
    cancelTouchend = undefined
  }

  // Public functions
  function onMouseenter() {
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
  }

  function onPointerdown() {
    touched.value = true

    // Add listeners
    cancelPointerup = useEventListener(document, 'pointerup', onPointerup)

    // Pointerup doesn’t fire on iOS, so we need to use touchend
    cancelTouchend = isIOS()
      ? useEventListener(document, 'touchend', onPointerup)
      : undefined
  }

  return {
    onMouseenter,
    onMouseleave,
    onPointerdown,
  }
}
