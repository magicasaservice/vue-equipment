import { toValue, type MaybeRef, type Ref } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import type { Interaction } from '../../types'
import { useAccordionView } from './useAccordionView'
import { useFocus } from '@vueuse/core'

interface UseAccordionTriggerArgs {
  instanceId: MaybeRef<string>
  viewId: string
  trigger: Interaction
  disabled: MaybeRef<boolean>
  elRef: Ref<InstanceType<typeof Primitive> | undefined>
}

export function useAccordionTrigger(args: UseAccordionTriggerArgs) {
  const { instanceId, viewId, elRef, disabled, trigger } = args

  const { selectView, unselectView, getView } = useAccordionView(instanceId)
  const view = getView(viewId)

  const { focused } = useFocus(elRef)

  function onMouseenter() {
    if (!toValue(disabled) && trigger === 'mouseenter') {
      selectView(viewId)
    }
  }

  function onClick() {
    if (!toValue(disabled) && trigger === 'click') {
      if (view?.active) {
        unselectView(viewId)
      } else {
        selectView(viewId)
      }
    }
  }

  function onEnter(e: KeyboardEvent) {
    if (focused.value && !toValue(disabled) && !view?.active) {
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
    onEnter,
  }
}
