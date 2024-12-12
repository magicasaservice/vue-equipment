import { toValue, type MaybeRef, type Ref } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import type { MenuState } from '../../types'
import { ModeScrollLock } from '../../utils/modeScrollLockDefaults'

type UseMenuCallbackArgs = {
  state: MenuState
  instanceId: MaybeRef<string>
  viewId: string
  innerActive: Ref<boolean>
  wrapperActive: Ref<boolean>
  lockScroll: () => void
  unlockScroll: () => void
  addScrollLockPadding: () => void
  removeScrollLockPadding: () => void
}

export function useMenuCallback(args: UseMenuCallbackArgs) {
  const {
    state,
    instanceId,
    viewId,
    innerActive,
    wrapperActive,
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
  } = args

  const emitter = useMagicEmitter()

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

    if (scrollLock) {
      lockScroll()

      if (typeof scrollLock === 'object' && scrollLock.padding) {
        addScrollLockPadding()
      }
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

    if (scrollLock) {
      unlockScroll()

      if (typeof scrollLock === 'object' && scrollLock.padding) {
        removeScrollLockPadding()
      }
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
