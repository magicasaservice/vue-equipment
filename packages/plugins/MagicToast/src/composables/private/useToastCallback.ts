import { toValue, computed, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useToastView } from './useToastView'
import { useToastState } from './useToastState'

// interface UseToastCallbackArgs {
//   instanceId: MaybeRef<string>
//   viewId: string
// }

export function useToastCallback(instanceId: MaybeRef<string>) {
  // const { instanceId } = args
  const { initializeState } = useToastState(instanceId)
  const state = initializeState()
  const emitter = useMagicEmitter()

  const { deleteView, getView } = useToastView(instanceId)

  const count = computed(() => state.views.length)

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(instanceId))
  }

  function onEnter() {
    emitter.emit('enter', toValue(instanceId))
    if (
      count.value &&
      state.options.layout?.max &&
      count.value > state.options.layout.max
    ) {
      deleteView(state.views[0].id)
    }
  }

  function onAfterEnter(el: Element) {
    emitter.emit('afterEnter', toValue(instanceId))

    const view = getView(el.id)

    if (view) {
      const mappedEl = el as HTMLElement
      const style = window.getComputedStyle(mappedEl)

      const dimensions = {
        height: mappedEl.offsetHeight,
        padding: {
          top: parseInt(style.paddingTop),
          bottom: parseInt(style.paddingBottom),
        },
      }

      view.dimensions = dimensions
    }
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', toValue(instanceId))
  }

  function onLeave() {
    emitter.emit('leave', toValue(instanceId))
  }

  function onAfterLeave(el: Element) {
    const view = getView(el.id)

    if (view) {
      deleteView(view.id)
    }

    emitter.emit('afterLeave', toValue(instanceId))
  }

  return {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
  }
}
