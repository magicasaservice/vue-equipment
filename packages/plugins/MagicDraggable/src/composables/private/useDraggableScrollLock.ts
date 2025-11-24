import { shallowRef } from 'vue'
import { useScrollLock } from '@vueuse/core'
import { useScrollLockPadding } from '@maas/vue-equipment/composables/useScrollLockPadding'

const scrollLock =
  typeof window !== 'undefined'
    ? useScrollLock(document?.documentElement)
    : shallowRef(false)

const { add, remove } = useScrollLockPadding({ exclude: /magic-draggable/ })

export function useDraggableScrollLock() {
  // Public functions
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
    lockScroll,
    unlockScroll,
  }
}
