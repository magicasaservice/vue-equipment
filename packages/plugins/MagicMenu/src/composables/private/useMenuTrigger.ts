import { type ComputedRef, type MaybeRef, type Ref } from 'vue'
import { useMagicKeys, useFocus } from '@vueuse/core'
import type { Interaction } from '../../types/index'
import { useMenuView } from './useMenuView'
import { useMenuState } from './useMenuState'

type UseMenuTriggerArgs = {
  instanceId: MaybeRef<string>
  viewId: string
  itemId?: string
  mappedDisabled: ComputedRef<boolean>
  mappedTrigger: ComputedRef<Interaction[]>
  elRef: Ref<HTMLElement | undefined>
}

export function useMenuTrigger(args: UseMenuTriggerArgs) {
  // Private state
  const { instanceId, viewId, itemId, mappedTrigger, mappedDisabled, elRef } =
    args

  const { getView, selectView, unselectView } = useMenuView(instanceId)
  const view = getView(viewId)

  const { initializeState } = useMenuState(instanceId)
  const state = initializeState()

  const { focused } = useFocus(elRef)
  const { shift, control } = useMagicKeys()

  // Private functions

  function onRightClick(e: MouseEvent) {
    switch (e.button) {
      case 2:
        selectView(viewId)
        state.active = true

        // Save coordinates, later used for float positioning
        if (view) {
          view.state.clicked = { x: e.clientX, y: e.clientY }
        }

        // If the trigger is not nested inside an item, focus the view
        if (!itemId) {
          state.input.view = viewId
        }
        break
      default:
        state.active = false
        unselectView(viewId)
    }
  }

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
      mappedTrigger.value.includes('mouseenter') &&
      !mappedDisabled.value &&
      viewId &&
      view
    ) {
      // If mouseenter is the first trigger, set active to true
      if (mappedTrigger.value[0] === 'mouseenter') {
        state.active = true
      }

      let delay = 0
      switch (state.options.mode) {
        case 'navigation':
          delay = 200
          break
      }

      if (state.active) {
        selectView(viewId, delay)

        // If the trigger is not nested inside an item, focus the view
        if (!itemId) {
          state.input.view = viewId
        }
      }
    }
  }

  function onClick(e: MouseEvent) {
    if (
      mappedTrigger.value.includes('click') &&
      !mappedDisabled.value &&
      e.button === 0 &&
      viewId
    ) {
      let delay = 0
      switch (state.options.mode) {
        case 'navigation':
          delay = 200
          break
      }

      switch (true) {
        case !state.active:
          state.active = true
          selectView(viewId, delay)

          // If the trigger is not nested inside an item, focus the view
          if (!itemId) {
            state.input.view = viewId
          }
          break
        case state.active && !itemId:
          state.active = false
          unselectView(viewId)
          break
      }
    }

    if (mappedTrigger.value.includes('right-click') && viewId) {
      e.preventDefault()
      if (control.value || shift.value) {
        onRightClick(
          new MouseEvent(e.type, {
            ...e,
            button: 2,
            clientX: e.clientX,
            clientY: e.clientY,
          })
        )
      } else {
        onRightClick(e)
      }
    }
  }

  return {
    onMouseenter,
    onClick,
    onEnter,
  }
}
