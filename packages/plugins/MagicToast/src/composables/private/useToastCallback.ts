import { ref, toValue, type Ref, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import type { ActiveToast, MagicToastOptions, Toast } from './../../types'

type UseToastCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: MagicToastOptions
  count: Ref<number | undefined>
  firstToast: Ref<Toast | undefined>
}

export function useToastCallback(args: UseToastCallbackArgs) {
  const { id, mappedOptions, count, firstToast } = args

  const activeToasts = ref<ActiveToast[]>([])
  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))
  }

  function onEnter() {
    emitter.emit('enter', toValue(id))
    if (
      count.value &&
      mappedOptions.layout?.max &&
      count.value > mappedOptions.layout.max
    ) {
      firstToast.value?.remove()
    }
  }

  function onAfterEnter(el: Element) {
    emitter.emit('afterEnter', toValue(id))

    const mappedEl = el as HTMLElement
    const style = window.getComputedStyle(mappedEl)

    activeToasts.value = [
      ...activeToasts.value,
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

  function onBeforeLeave() {
    emitter.emit('beforeLeave', toValue(id))
  }

  function onLeave(el: Element) {
    emitter.emit('leave', toValue(id))
    activeToasts.value = activeToasts.value.filter((item) => item.id !== el.id)
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', toValue(id))
  }

  return {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    activeToasts,
  }
}
