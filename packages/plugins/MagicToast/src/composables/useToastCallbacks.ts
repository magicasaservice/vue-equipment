import { ref } from 'vue'
import type { ActiveElement } from './../types/index'

export function useToastCallbacks({ count, mappedOptions, oldest }: any) {
  const activeElements = ref<ActiveElement[]>([])

  function onBeforeEnter(el: Element) {}

  function onEnter(el: Element) {
    if (
      count.value &&
      mappedOptions.layout?.max &&
      count.value > mappedOptions.layout.max
    ) {
      oldest.value?.remove()
    }
  }

  function onAfterEnter(el: Element) {
    const mappedEl = el as HTMLElement
    activeElements.value = [
      ...activeElements.value,
      { id: el.id, height: mappedEl.offsetHeight },
    ]
  }

  function onBeforeLeave(el: Element) {}

  function onLeave(el: Element) {
    activeElements.value = activeElements.value.filter(
      (item) => item.id !== el.id,
    )
  }

  function onAfterLeave(el: Element) {}

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
