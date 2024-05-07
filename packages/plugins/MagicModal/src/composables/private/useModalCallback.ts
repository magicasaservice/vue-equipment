import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import type { ModalOptions } from '../../types'

type UseModalCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: ModalOptions
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

  function onBeforeEnter(_el?: Element) {
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

  function onEnter(_el?: Element) {
    emitter.emit('enter', toValue(id))
  }

  async function onAfterEnter(_el?: Element) {
    emitter.emit('afterEnter', toValue(id))

    if (mappedOptions.focusTrap) {
      await nextTick()
      trapFocus()
    }
  }

  function onBeforeLeave(_el?: Element) {
    emitter.emit('beforeLeave', toValue(id))
  }

  function onLeave(_el?: Element) {
    emitter.emit('leave', toValue(id))
  }

  function onAfterLeave(_el?: Element) {
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
