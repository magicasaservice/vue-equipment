import { ref, shallowRef } from 'vue'
import { defu } from 'defu'
import { useScrollLock, type MaybeElementRef } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import {
  matchClass,
  scrollbarGutterSupport,
  scrollbarWidth,
} from '@maas/vue-equipment/utils'

import type { MagicModalOptions } from '../../types/index'

export type useModalDOMArgs = Pick<
  MagicModalOptions,
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

export function useModalDOM(args?: useModalDOMArgs) {
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
    if (typeof window === 'undefined') {
      return
    }

    const exclude = new RegExp(/magic-modal(__backdrop)?/)

    document.body.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth()}px`
    )

    positionFixedElements.value = [
      ...document.body.getElementsByTagName('*'),
    ].filter(
      (x) =>
        getComputedStyle(x, null).getPropertyValue('position') === 'fixed' &&
        getComputedStyle(x, null).getPropertyValue('right') === '0px' &&
        !matchClass(x, exclude)
    ) as HTMLElement[]

    switch (scrollbarGutterSupport()) {
      case true:
        document.documentElement.style.scrollbarGutter = 'stable'
        positionFixedElements.value.forEach((elem) => {
          elem.style.scrollbarGutter = 'stable'
          elem.style.overflow = 'auto'
        })
        break
      case false:
        document.body.style.paddingRight = 'var(--scrollbar-width)'
        positionFixedElements.value.forEach(
          (elem) => (elem.style.paddingRight = 'var(--scrollbar-width)')
        )
        break
    }
  }

  function removeScrollLockPadding() {
    document.documentElement.style.scrollbarGutter = ''
    document.body.style.removeProperty('--scrollbar-width')
    document.body.style.paddingRight = ''
    positionFixedElements.value.forEach((elem) => {
      elem.style.paddingRight = ''
      elem.style.scrollbarGutter = ''
      elem.style.overflow = ''
    })
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
