import { toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import type { MenuState } from '../../types'

type UseMenuCallbackArgs = {
  state: MenuState
  instanceId: MaybeRef<string>
  viewId: string
  lockScroll: () => void
  unlockScroll: () => void
}

export function useMenuCallback(args: UseMenuCallbackArgs) {
  const { state, instanceId, viewId, lockScroll, unlockScroll } = args

  const emitter = useMagicEmitter()

  function onBeforeEnter(_el: Element) {
    emitter.emit('beforeEnter', { id: toValue(instanceId), view: viewId })
  }

  function onEnter(_el: Element) {
    emitter.emit('enter', { id: toValue(instanceId), view: viewId })
  }

  function onAfterEnter(_el: Element) {
    emitter.emit('afterEnter', { id: toValue(instanceId), view: viewId })

    switch (state.options.mode) {
      case 'dropdown':
        lockScroll()
        break
      case 'menubar':
        break
      case 'navigation':
        break
      case 'context':
        lockScroll()
        break
    }
  }

  function onBeforeLeave(_el: Element) {
    emitter.emit('beforeLeave', { id: toValue(instanceId), view: viewId })
  }

  function onLeave(_el: Element) {
    emitter.emit('leave', { id: toValue(instanceId), view: viewId })
  }

  function onAfterLeave(_el: Element) {
    emitter.emit('afterLeave', { id: toValue(instanceId), view: viewId })

    switch (state.options.mode) {
      case 'dropdown':
        unlockScroll()
        break
      case 'menubar':
        break
      case 'navigation':
        break
      case 'context':
        unlockScroll()
        break
    }
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
