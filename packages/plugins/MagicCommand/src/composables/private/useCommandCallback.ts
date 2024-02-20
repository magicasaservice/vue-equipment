import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useCommandEmitter } from './../useCommandEmitter'
import type { CommandOptions } from '../../types'

type UseCommandCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: CommandOptions
  addScrollLockPadding: () => void
  removeScrollLockPadding: () => void
  lockScroll: () => void
  unlockScroll: () => void
  trapFocus: () => void
  releaseFocus: () => void
  wrapperActive: Ref<boolean>
}

export function useCommandCallback(args: UseCommandCallbackArgs) {
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
    useCommandEmitter().emit('beforeEnter', toValue(id))

    if (mappedOptions.scrollLock) {
      if (mappedOptions.scrollLockPadding) {
        addScrollLockPadding()
      }

      lockScroll()
    }
  }

  function onEnter(_el: Element) {
    useCommandEmitter().emit('enter', toValue(id))
  }

  async function onAfterEnter(_el: Element) {
    useCommandEmitter().emit('afterEnter', toValue(id))

    if (mappedOptions.focusTrap) {
      await nextTick()
      trapFocus()
    }
  }

  function onBeforeLeave(_el: Element) {
    useCommandEmitter().emit('beforeLeave', toValue(id))
  }

  function onLeave(_el: Element) {
    useCommandEmitter().emit('leave', toValue(id))
  }

  function onAfterLeave(_el: Element) {
    useCommandEmitter().emit('afterLeave', toValue(id))

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
