import { ref, shallowRef } from 'vue'
import { useScrollLock } from '@vueuse/core'
import {
  matchClass,
  scrollbarGutterSupport,
  scrollbarWidth,
} from '@maas/vue-equipment/utils'

const scrollLock =
  typeof window !== 'undefined'
    ? useScrollLock(document?.documentElement)
    : shallowRef(false)

export function useMenuDOM() {
  // Private state
  const positionFixedElements = ref<HTMLElement[]>([])

  // Public functions

  function lockScroll() {
    scrollLock.value = true
  }

  function unlockScroll() {
    scrollLock.value = false
  }

  function addScrollLockPadding() {
    if (typeof window === 'undefined') return

    const exclude = new RegExp(/magic-menu/)

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
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
  }
}
