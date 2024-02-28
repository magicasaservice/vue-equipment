import { ref, computed, toValue, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useScrollLock, type MaybeElementRef } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { uuid, matchClass } from '@maas/vue-equipment/utils'
import { useCommandStore } from './private/useCommandStore'
import { useCommandItem } from './private/useCommandItem'
import { useCommandView } from './private/useCommandView'

import { type CommandOptions } from '../types/index'

export type UseCommandApiOptions = Pick<CommandOptions, 'scrollLock'> & {
  focusTarget: MaybeElementRef
}

const defaultOptions = {
  focusTarget: undefined,
  scrollLock: true,
}

export function useCommandApi(
  id: MaybeRef<string>,
  options?: UseCommandApiOptions
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

  // Public state
  const isActive = computed(() =>
    commandStore.value.map((item) => item.id).includes(mappedId.value)
  )

  // Private methods
  const { commandStore, addInstance, removeInstance } = useCommandStore()

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

    const exclude = new RegExp(/magic-command(__backdrop)?/)

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

  const { selectItem, selectLastItem } = useCommandItem(mappedId)
  const { selectView, selectLastView } = useCommandView()

  return {
    isActive,
    open,
    close,
    trapFocus,
    releaseFocus,
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
    selectItem,
    selectLastItem,
    selectView,
    selectLastView,
  }
}