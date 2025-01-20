import { nextTick, type ComputedRef, type MaybeRef, type Ref } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useFocus } from '@vueuse/core'
import type { Interaction } from '../../types/index'
import { useCommandView } from './useCommandView'
import { useCommandState } from './useCommandState'

type UseCommandTriggerArgs = {
  instanceId: MaybeRef<string>
  viewId: string
  itemId?: string
  mappedDisabled: ComputedRef<boolean>
  trigger: Interaction[]
  elRef: Ref<InstanceType<typeof Primitive> | undefined>
}

export function useCommandTrigger(args: UseCommandTriggerArgs) {
  // Private state
  const { instanceId, viewId, itemId, trigger, mappedDisabled, elRef } = args

  const { getView, selectView, unselectView } = useCommandView(instanceId)
  const view = getView(viewId)

  const { initializeState } = useCommandState(instanceId)
  const state = initializeState()

  const { focused } = useFocus(elRef)

  // Public functions
  function onEnter(e: KeyboardEvent) {
    if (focused.value && !mappedDisabled.value && !view?.active) {
      e.preventDefault()
      e.stopPropagation()

      state.active = true
      state.input.type = 'keyboard'
      state.input.view = viewId
      selectView(viewId)
    }
  }

  function onMouseenter() {
    if (
      trigger.includes('mouseenter') &&
      !mappedDisabled.value &&
      viewId &&
      view
    ) {
      state.active = true
      selectView(viewId)

      // Set current view
      state.input.view = viewId

      // // If mouseenter is the first trigger, set active to true
      // if (trigger[0] === 'mouseenter') {
      //   state.active = true
      // }

      // if (state.active) {
      //   selectView(viewId)

      //   // If the trigger is not nested inside an item, focus the view
      //   if (!itemId) {
      //     state.input.view = viewId
      //   }
      // }
    }
  }

  async function onClick(e: MouseEvent) {
    if (
      trigger.includes('click') &&
      !mappedDisabled.value &&
      e.button === 0 &&
      viewId
    ) {
      if (!state.active) {
        state.active = true
        await nextTick()
      }

      selectView(viewId)

      // Set current view
      state.input.view = viewId

      // switch (true) {
      //   case !state.active: {
      //     state.active = true
      //     selectView(viewId)
      //     // Set current view
      //     state.input.view = viewId
      //     // If the trigger is not nested inside an item, focus the view
      //     // if (!itemId) {
      //     //   state.input.view = viewId
      //     // }
      //     break
      //   }
      //   case state.active && !itemId: {
      //     state.active = false
      //     unselectView(viewId)
      //     break
      //   }
      // }
    }
  }

  return {
    onMouseenter,
    onClick,
    onEnter,
  }
}
