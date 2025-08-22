import { toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useToastView } from './useToastView'
import { useToastState } from './useToastState'

export function useToastCallback(instanceId: MaybeRef<string>) {
  const { initializeState } = useToastState(instanceId)
  const state = initializeState()
  const emitter = useMagicEmitter()

  const { deleteView, getView } = useToastView(instanceId)

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(instanceId))
  }

  function onEnter() {
    emitter.emit('enter', toValue(instanceId))

    // Remove oldest view once threshold is reached
    if (
      state.views.length &&
      state.options.layout?.max &&
      state.views.length > state.options.layout.max
    ) {
      deleteView(state.views[0].id)
    }
  }

  function onAfterEnter(el: Element) {
    emitter.emit('afterEnter', toValue(instanceId))

    // Save dimensions
    const mappedEl = el as HTMLElement
    const view = getView(mappedEl.dataset.id ?? '')

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
    const mappedEl = el as HTMLElement
    const view = getView(mappedEl.dataset.id ?? '')

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
