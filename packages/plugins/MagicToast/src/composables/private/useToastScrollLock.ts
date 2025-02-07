import { ref } from 'vue'
import { useScrollLock } from '@vueuse/core'
import { matchClass } from '@maas/vue-equipment/utils'

const scrollLock =
  typeof window !== 'undefined'
    ? useScrollLock(document?.documentElement)
    : ref(false)

export function useToastScrollLock() {
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

    const exclude = new RegExp(/magic-toast/)

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
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
  }
}
