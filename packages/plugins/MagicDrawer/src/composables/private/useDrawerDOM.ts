import { ref, shallowRef } from 'vue'
import { defu } from 'defu'
import { useScrollLock, type MaybeElementRef } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import {
  matchClass,
  scrollbarGutterSupport,
  scrollbarWidth,
} from '@maas/vue-equipment/utils'

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
    : shallowRef(false)

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

    document.body.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth()}px`
    )

    switch (scrollbarGutterSupport()) {
      case true:
        document.documentElement.style.scrollbarGutter = 'stable'
        break
      case false:
        document.body.style.paddingRight = 'var(--scrollbar-width)'
        break
    }

    positionFixedElements.value = [
      ...document.body.getElementsByTagName('*'),
    ].filter(
      (x) =>
        getComputedStyle(x, null).getPropertyValue('position') === 'fixed' &&
        getComputedStyle(x, null).getPropertyValue('right') === '0px' &&
        !matchClass(x, exclude)
    ) as HTMLElement[]

    positionFixedElements.value.forEach(
      (elem) => (elem.style.paddingRight = 'var(--scrollbar-width)')
    )
  }

  function removeScrollLockPadding() {
    document.documentElement.style.scrollbarGutter = ''
    document.body.style.removeProperty('--scrollbar-width')
    document.body.style.paddingRight = ''
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
