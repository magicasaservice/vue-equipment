import { uuid } from '@maas/vue-equipment/utils'
import { ref, computed, toValue, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useScrollLock } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useDrawerStore } from './private/useDrawerStore'

import type { DrawerOptions } from '../types/index'
import type { MaybeElementRef } from '@vueuse/core'

export type useDrawerApiOptions = Pick<DrawerOptions, 'scrollLock'> & {
  focusTarget: MaybeElementRef
}

const defaultOptions = {
  focusTarget: undefined,
  scrollLock: true,
}

export function useDrawerApi(
  id?: MaybeRef<string>,
  options?: useDrawerApiOptions
) {
  // Private state
  const positionFixedElements = ref<HTMLElement[]>([])
  const mappedId = computed(() => toValue(id) || uuid())
  const mappedOptions = defu(options, defaultOptions)

  const focusTrap = mappedOptions.focusTarget
    ? useFocusTrap(mappedOptions.focusTarget)
    : undefined

  const scrollLock =
    mappedOptions.scrollLock && typeof window !== 'undefined'
      ? useScrollLock(document.body)
      : ref(false)

  // Private methods
  const { drawerStore, addInstance, removeInstance } = useDrawerStore()

  // Public state
  const isActive = computed(() => drawerStore.value.includes(mappedId.value))

  // Public methods
  function open() {
    addInstance(mappedId.value)
  }

  function close() {
    removeInstance(mappedId.value)
  }

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
    scrollLock.value = true
  }

  function unlockScroll() {
    scrollLock.value = false
  }

  function addScrollLockPadding() {
    if (typeof window === 'undefined') return

    const scrollbarWidth = window.innerWidth - document.body.offsetWidth
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    document.body.style.paddingRight = 'var(--scrollbar-width)'
    positionFixedElements.value = [
      ...document.body.getElementsByTagName('*'),
    ].filter(
      (x) => getComputedStyle(x, null).getPropertyValue('position') === 'fixed'
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
    id: mappedId,
    isActive,
    open,
    close,
    trapFocus,
    releaseFocus,
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
  }
}

export type UseDrawerApiReturn = ReturnType<typeof useDrawerApi>
