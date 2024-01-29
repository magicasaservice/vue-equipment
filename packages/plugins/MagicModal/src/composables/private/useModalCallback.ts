import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useModalEmitter } from './../useModalEmitter'
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

  function onBeforeEnter(_el: Element) {
    useModalEmitter().emit('beforeEnter', toValue(id))

    if (mappedOptions.scrollLock) {
      if (mappedOptions.scrollLockPadding) {
        addScrollLockPadding()
      }

      lockScroll()
    }
  }

  function onEnter(_el: Element) {
    useModalEmitter().emit('enter', toValue(id))
  }

  async function onAfterEnter(_el: Element) {
    useModalEmitter().emit('afterEnter', toValue(id))

    if (mappedOptions.focusTrap) {
      await nextTick()
      trapFocus()
    }
  }

  function onBeforeLeave(_el: Element) {
    useModalEmitter().emit('beforeLeave', toValue(id))
  }

  function onLeave(_el: Element) {
    useModalEmitter().emit('leave', toValue(id))
  }

  function onAfterLeave(_el: Element) {
    useModalEmitter().emit('afterLeave', toValue(id))

    if (mappedOptions.scrollLock) {
      unlockScroll()
      if (mappedOptions.scrollLockPadding) {
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
