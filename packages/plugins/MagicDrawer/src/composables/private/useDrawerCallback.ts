import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useDrawerEmitter } from './../useDrawerEmitter'
import type { DrawerOptions } from '../../types'

type UseDrawerCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: DrawerOptions
  addScrollLockPadding: () => void
  removeScrollLockPadding: () => void
  lockScroll: () => void
  unlockScroll: () => void
  trapFocus: () => void
  releaseFocus: () => void
  wrapperActive: Ref<boolean>
}

export function useDrawerCallback(args: UseDrawerCallbackArgs) {
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
    useDrawerEmitter().emit('beforeEnter', toValue(id))
  }

  function onEnter(_el: Element) {
    useDrawerEmitter().emit('enter', toValue(id))
  }

  async function onAfterEnter(_el: Element) {
    useDrawerEmitter().emit('afterEnter', toValue(id))

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
    useDrawerEmitter().emit('beforeLeave', toValue(id))
  }

  function onLeave(_el: Element) {
    useDrawerEmitter().emit('leave', toValue(id))
  }

  function onAfterLeave(_el: Element) {
    useDrawerEmitter().emit('afterLeave', toValue(id))

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
