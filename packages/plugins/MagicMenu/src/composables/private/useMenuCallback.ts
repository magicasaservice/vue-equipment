import { toValue, type MaybeRef, type Ref } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMenuDOM } from './useMenuDOM'
import { ModeScrollLock } from '../../utils/modeScrollLockDefaults'

import type { MenuState } from '../../types'

type UseMenuCallbackArgs = {
  state: MenuState
  instanceId: MaybeRef<string>
  viewId: string
  innerActive: Ref<boolean>
  wrapperActive: Ref<boolean>
  parentTree: string[]
}

export function useMenuCallback(args: UseMenuCallbackArgs) {
  const { state, instanceId, viewId, innerActive, wrapperActive, parentTree } =
    args

  const emitter = useMagicEmitter()
  const { lockScroll, unlockScroll } = useMenuDOM()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', { id: toValue(instanceId), viewId })
  }

  function onEnter() {
    emitter.emit('enter', { id: toValue(instanceId), viewId })
  }

  function onAfterEnter() {
    emitter.emit('afterEnter', { id: toValue(instanceId), viewId })

    const scrollLock =
      state.options.scrollLock ?? ModeScrollLock[state.options.mode].value

    // Only lock scroll if this is the top-level menu
    if (scrollLock && parentTree.length === 2) {
      lockScroll(typeof scrollLock === 'object' && scrollLock.padding)
    }
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', { id: toValue(instanceId), viewId })
  }

  function onLeave() {
    emitter.emit('leave', { id: toValue(instanceId), viewId })
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', { id: toValue(instanceId), viewId })

    const scrollLock =
      state.options.scrollLock ?? ModeScrollLock[state.options.mode].value

    // Only unlock scroll if this is the top-level menu
    if (scrollLock && parentTree.length === 2) {
      unlockScroll(typeof scrollLock === 'object' && scrollLock.padding)
    }

    // Only disable wrapperActive if innerActive is false
    if (!innerActive.value) {
      wrapperActive.value = false
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
