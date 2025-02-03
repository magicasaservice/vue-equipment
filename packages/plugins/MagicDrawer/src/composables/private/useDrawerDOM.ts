import { ref } from 'vue'
import { defu } from 'defu'
import { useScrollLock, type MaybeElementRef } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { matchClass } from '@maas/vue-equipment/utils'

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
  scrollLock: true,
}

const scrollLock =
  typeof window !== 'undefined'
    ? useScrollLock(document?.documentElement)
    : ref(false)

export function useDrawerDOM(args?: UseDrawerDOMArgs) {
  // Private state
  const positionFixedElements = ref<HTMLElement[]>([])
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

  function lockScroll() {
    if (mappedOptions.scrollLock) {
      scrollLock.value = true
    }
  }

  function unlockScroll() {
    if (mappedOptions.scrollLock) {
      scrollLock.value = false
    }
  }

  function addScrollLockPadding() {
    if (typeof window === 'undefined') return

    const exclude = new RegExp(/magic-drawer(__backdrop)?/)

    const scrollbarWidth = window.innerWidth - document.body.offsetWidth
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    document.body.style.paddingRight = 'var(--scrollbar-width)'
    positionFixedElements.value = [
      ...document.body.getElementsByTagName('*'),
    ].filter(
      (x) =>
        getComputedStyle(x, null).getPropertyValue('position') === 'fixed' &&
        !matchClass(x, exclude)
    ) as HTMLElement[]
    positionFixedElements.value.forEach(
      (elem) => (elem.style.paddingRight = 'var(--scrollbar-width)')
    )
  }

  function removeScrollLockPadding() {
    document.body.style.paddingRight = ''
    document.body.style.removeProperty('--scrollbar-width')
    positionFixedElements.value.forEach(
      (elem) => (elem.style.paddingRight = '')
    )
  }

  return {
    trapFocus,
    releaseFocus,
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
  }
}
