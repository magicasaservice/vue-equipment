import { ref, toValue, type Ref, type MaybeRef } from 'vue'
import type { ActiveElement, ToastOptions, Toast } from './../../types'
import { useToastEmitter } from './../useToastEmitter'

type Args = {
  id: MaybeRef<string>
  mappedOptions: ToastOptions
  count: Ref<number | undefined>
  oldest: Ref<Toast | undefined>
}

export function useToastCallback({ id, mappedOptions, count, oldest }: Args) {
  const activeElements = ref<ActiveElement[]>([])

  function onBeforeEnter(_el: Element) {
    useToastEmitter().emit('beforeEnter', toValue(id))
  }

  function onEnter(_el: Element) {
    useToastEmitter().emit('enter', toValue(id))
    if (
      count.value &&
      mappedOptions.layout?.max &&
      count.value > mappedOptions.layout.max
    ) {
      oldest.value?.remove()
    }
  }

  function onAfterEnter(el: Element) {
    useToastEmitter().emit('afterEnter', toValue(id))

    const mappedEl = el as HTMLElement
    const style = window.getComputedStyle(mappedEl)

    activeElements.value = [
      ...activeElements.value,
      {
        id: el.id,
        height: mappedEl.offsetHeight,
        padding: {
          top: parseInt(style.paddingTop),
          bottom: parseInt(style.paddingBottom),
        },
      },
    ]
  }

  function onBeforeLeave(_el: Element) {
    useToastEmitter().emit('beforeLeave', toValue(id))
  }

  function onLeave(el: Element) {
    useToastEmitter().emit('leave', toValue(id))
    activeElements.value = activeElements.value.filter(
      (item) => item.id !== el.id,
    )
  }

  function onAfterLeave(_el: Element) {
    useToastEmitter().emit('afterLeave', toValue(id))
  }

  return {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    activeElements,
  }
}
