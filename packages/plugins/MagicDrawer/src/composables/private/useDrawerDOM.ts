import { shallowRef } from 'vue'
import { defu } from 'defu'
import { useScrollLock, type MaybeElementRef } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useScrollLockPadding } from '@maas/vue-equipment/composables/useScrollLockPadding'

import type { MagicDrawerOptions } from '../../types/index'

export type UseDrawerDOMArgs = Pick<
  MagicDrawerOptions,
  'scrollLock' | 'focusTrap'
> & {
  focusTarget: MaybeElementRef
}

const defaultOptions = {
  focusTrap: false,
  focusTarget: undefined,
}

const scrollLock =
  typeof window !== 'undefined'
    ? useScrollLock(document?.documentElement)
    : shallowRef(false)

const { add, remove } = useScrollLockPadding({
  exclude: /magic-drawer(__backdrop)?/,
})

export function useDrawerDOM(args?: UseDrawerDOMArgs) {
  // Private state
  const mappedOptions = defu(args, defaultOptions)

  const focusTrap = mappedOptions.focusTarget
    ? typeof mappedOptions.focusTrap === 'boolean'
      ? useFocusTrap(mappedOptions.focusTarget)
      : useFocusTrap(mappedOptions.focusTarget, mappedOptions.focusTrap)
    : undefined

  // Public functions
  function trapFocus() {
    if (focusTrap) {
      focusTrap.activate()
    }
  }

  function releaseFocus() {
    if (focusTrap) {
      focusTrap.deactivate()
    }
  }

  function lockScroll(padding?: boolean) {
    if (padding) {
      add()
    }
    scrollLock.value = true
  }

  function unlockScroll(padding?: boolean) {
    scrollLock.value = false
    if (padding) {
      remove()
    }
  }

  return {
    trapFocus,
    releaseFocus,
    lockScroll,
    unlockScroll,
  }
}
