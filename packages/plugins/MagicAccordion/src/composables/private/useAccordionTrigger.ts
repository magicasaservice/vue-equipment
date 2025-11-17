import { type ComputedRef, type MaybeRef, type Ref } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import { useFocus } from '@vueuse/core'
import { useAccordionView } from './useAccordionView'

import type { Interaction } from '../../types'

interface UseAccordionTriggerArgs {
  instanceId: MaybeRef<string>
  viewId: string
  trigger: Interaction
  mappedDisabled: ComputedRef<boolean>
  elRef: Ref<InstanceType<typeof VuePrimitive> | null>
}

export function useAccordionTrigger(args: UseAccordionTriggerArgs) {
  const { instanceId, viewId, elRef, mappedDisabled, trigger } = args

  const { selectView, unselectView, getView } = useAccordionView(instanceId)
  const view = getView(viewId)

  const { focused } = useFocus(elRef)

  function onMouseenter() {
    if (!mappedDisabled.value && trigger === 'mouseenter') {
      selectView(viewId)
    }
  }

  function onClick() {
    if (!mappedDisabled.value && trigger === 'click') {
      if (view?.active) {
        unselectView(viewId)
      } else {
        selectView(viewId)
      }
    }
  }

  function onKeypress(e: KeyboardEvent) {
    if (focused.value && !mappedDisabled.value && !view?.active) {
      e.preventDefault()
      e.stopPropagation()

      if (view?.active) {
        unselectView(viewId)
      } else {
        selectView(viewId)
      }
    }
  }

  return {
    onMouseenter,
    onClick,
    onKeypress,
  }
}
