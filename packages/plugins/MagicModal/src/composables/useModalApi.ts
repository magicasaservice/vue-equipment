import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { MaybeElementRef, MaybeRef, toValue, useScrollLock } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { useModalStore } from './useModalStore'

export type useModalApiOptions = {
  focusTarget?: MaybeElementRef
  scrollLock?: boolean
}

const defaultOptions = {
  focusTarget: undefined,
  scrollLock: true,
}

export function useModalApi(
  id?: MaybeRef<string>,
  options?: useModalApiOptions
) {
  // Private state
  const positionFixedElements = ref<HTMLElement[]>([])
  const mappedId = computed(() => toValue(id) || uuidv4())
  const mappedOptions = { ...defaultOptions, ...options }

  const focusTrap = mappedOptions.focusTarget
    ? useFocusTrap(mappedOptions.focusTarget)
    : undefined

  const scrollLock = mappedOptions.scrollLock
    ? useScrollLock(document.body)
    : ref(false)

  // Private methods
  const { modalStore, addIdToStore, removeIdFromStore } = useModalStore()

  // Public state
  const isActive = computed(() => modalStore.value.includes(mappedId.value))

  // Public methods
  function open() {
    addIdToStore(mappedId.value)
  }

  function close() {
    removeIdFromStore(mappedId.value)
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
    const scrollbarWidth = window.innerWidth - document.body.offsetWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    positionFixedElements.value = [
      ...document.body.getElementsByTagName('*'),
    ].filter(
      (x) => getComputedStyle(x, null).getPropertyValue('position') === 'fixed'
    ) as HTMLElement[]
    positionFixedElements.value.forEach(
      (elem) => (elem.style.paddingRight = `${scrollbarWidth}px`)
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

export type UseModalApiReturn = ReturnType<typeof useModalApi>
