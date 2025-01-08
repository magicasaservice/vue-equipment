import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import type { MagicModalOptions } from '../../types'

type UseModalCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: MagicModalOptions
  addScrollLockPadding: () => void
  removeScrollLockPadding: () => void
  lockScroll: () => void
  unlockScroll: () => void
  trapFocus: () => void
  releaseFocus: () => void
  wrapperActive: Ref<boolean>
}

export function useModalCallback(args: UseModalCallbackArgs) {
  const {
    id,
    mappedOptions,
    addScrollLockPadding,
    removeScrollLockPadding,
    lockScroll,
    unlockScroll,
    trapFocus,
    releaseFocus,
    wrapperActive,
  } = args

  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))

    if (mappedOptions.scrollLock) {
      if (
        typeof mappedOptions.scrollLock === 'object' &&
        mappedOptions.scrollLock.padding
      ) {
        addScrollLockPadding()
      }

      lockScroll()
    }
  }

  function onEnter() {
    emitter.emit('enter', toValue(id))
  }

  async function onAfterEnter() {
    emitter.emit('afterEnter', toValue(id))

    if (mappedOptions.focusTrap) {
      await nextTick()
      trapFocus()
    }
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', toValue(id))
  }

  function onLeave() {
    emitter.emit('leave', toValue(id))
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', toValue(id))

    if (mappedOptions.scrollLock) {
      unlockScroll()
      if (
        typeof mappedOptions.scrollLock === 'object' &&
        mappedOptions.scrollLock.padding
      ) {
        removeScrollLockPadding()
      }
    }

    if (mappedOptions.focusTrap) {
      releaseFocus()
    }

    wrapperActive.value = false
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
