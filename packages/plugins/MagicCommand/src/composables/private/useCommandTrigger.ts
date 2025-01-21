import { nextTick, type ComputedRef, type MaybeRef, type Ref } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useFocus } from '@vueuse/core'
import type { Action, Interaction } from '../../types/index'
import { useCommandView } from './useCommandView'
import { useCommandState } from './useCommandState'

type UseCommandTriggerArgs = {
  instanceId: MaybeRef<string>
  viewId: string
  mappedDisabled: ComputedRef<boolean>
  mappedActive?: ComputedRef<boolean>
  trigger: Interaction[]
  action: Action
  elRef: Ref<InstanceType<typeof Primitive> | undefined>
}

export function useCommandTrigger(args: UseCommandTriggerArgs) {
  // Private state
  const {
    instanceId,
    viewId,
    trigger,
    action,
    mappedDisabled,
    mappedActive,
    elRef,
  } = args

  const { getView, selectView, unselectView } = useCommandView(instanceId)
  const view = getView(viewId)

  const { initializeState } = useCommandState(instanceId)
  const state = initializeState()

  const { focused } = useFocus(elRef)

  // Public functions
  async function onEnter(e: KeyboardEvent) {
    if (
      (focused.value || mappedActive?.value) &&
      !mappedDisabled.value &&
      !view?.active
    ) {
      e.preventDefault()
      e.stopPropagation()

      state.input.type = 'keyboard'

      switch (action) {
        case 'close':
          unselectView(viewId)
          break
        case 'open':
          if (!state.active) {
            state.active = true
            await nextTick()
          }

          selectView(viewId)
          break
      }
    }
  }

  async function onMouseenter() {
    if (
      trigger.includes('mouseenter') &&
      !mappedDisabled.value &&
      viewId &&
      view
    ) {
      switch (action) {
        case 'close':
          unselectView(viewId)
          break
        case 'open':
          if (!state.active) {
            state.active = true
            await nextTick()
          }

          selectView(viewId)
          break
      }
    }
  }

  async function onClick(e: MouseEvent) {
    if (
      trigger.includes('click') &&
      !mappedDisabled.value &&
      e.button === 0 &&
      viewId
    ) {
      switch (action) {
        case 'close':
          unselectView(viewId)
          break
        case 'open':
          if (!state.active) {
            state.active = true
            await nextTick()
          }

          selectView(viewId)
          break
      }
    }
  }

  return {
    onMouseenter,
    onClick,
    onEnter,
  }
}
