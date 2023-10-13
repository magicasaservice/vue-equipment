import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useModalEmitter } from './../useModalEmitter'
import type { ModalOptions } from '../../types'

type Args = {
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

export function useModalCallback({
  id,
  mappedOptions,
  addScrollLockPadding,
  removeScrollLockPadding,
  lockScroll,
  unlockScroll,
  trapFocus,
  releaseFocus,
  wrapperActive,
}: Args) {
  function onBeforeEnter(_el: Element) {
    useModalEmitter().emit('beforeEnter', toValue(id))
  }

  function onEnter(_el: Element) {
    useModalEmitter().emit('enter', toValue(id))
  }

  async function onAfterEnter(el: Element) {
    useModalEmitter().emit('afterEnter', toValue(id))

    if (mappedOptions.scrollLock) {
      if (mappedOptions.scrollLockPadding) {
        addScrollLockPadding()
      }

      lockScroll()
    }

    if (mappedOptions.focusTrap) {
      await nextTick()
      trapFocus()
    }
  }

  function onBeforeLeave(_el: Element) {
    useModalEmitter().emit('beforeLeave', toValue(id))
  }

  function onLeave(el: Element) {
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
