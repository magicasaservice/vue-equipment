import { toRefs, type MaybeRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { usePlayerState } from './usePlayerState'

export function usePlayerProvider(id: MaybeRef<string>) {
  // Private state
  const { initializeState } = usePlayerState(id)
  const state = initializeState()
  const { mouseEntered, touched } = toRefs(state)

  let cancelTouchend: (() => void) | undefined = undefined

  // Private functions
  function onTouchend() {
    cancelTouchend?.()
    cancelTouchend = undefined
    mouseEntered.value = false
  }

  // Public functions
  function onTouchstart() {
    mouseEntered.value = true
    cancelTouchend = useEventListener(document, 'touchend', onTouchend, {
      passive: true,
    })
  }

  function onMouseenter() {
    mouseEntered.value = true
  }

  function onMouseleave() {
    mouseEntered.value = false
  }

  function onPointerdown() {
    touched.value = true
  }

  return {
    onTouchstart,
    onMouseenter,
    onMouseleave,
    onPointerdown,
  }
}
