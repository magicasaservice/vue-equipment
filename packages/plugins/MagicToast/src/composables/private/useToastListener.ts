import type { MaybeRef } from 'vue'
import { useToastState } from './useToastState'

export function useToastListener(instanceId: MaybeRef<string>) {
  const { initializeState } = useToastState(instanceId)
  const state = initializeState()

  function onMouseenter() {
    if (state.options.layout?.expand === 'hover') {
      state.expanded = true
    }
  }

  function onMouseleave() {
    if (state.options.layout?.expand === 'hover') {
      state.expanded = false
    }
  }

  async function onClick() {
    if (state.options.layout?.expand === 'click') {
      state.expanded = true
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
    onClick,
    outsideClickCallback,
  }
}
