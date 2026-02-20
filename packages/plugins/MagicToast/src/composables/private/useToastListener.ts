import { type MaybeRef } from 'vue'
import { useToastState } from './useToastState'

export function useToastListener(instanceId: MaybeRef<string>) {
  const { initializeState } = useToastState(instanceId)
  const state = initializeState()

  function onMouseenter() {
    if (state.options.layout?.expand === 'hover') {
      state.expanded = true

      // Pause timeouts
      state.views.forEach((view) => {
        view.timeout?.pause()
      })
    }
  }

  function onMouseleave() {
    if (state.options.layout?.expand === 'hover') {
      state.expanded = false

      // Play timeouts
      state.views.forEach((view) => {
        view.timeout?.play()
      })
    }
  }

  function outsideClickCallback() {
    if (state.options.layout?.expand === 'click') {
      state.expanded = false
    }
  }

  return {
    onMouseenter,
    onMouseleave,
    outsideClickCallback,
  }
}
