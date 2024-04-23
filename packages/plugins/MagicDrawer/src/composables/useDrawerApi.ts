import { ref, computed, toValue, type MaybeRef } from 'vue'
import { defu } from 'defu'
import { useScrollLock, type MaybeElementRef } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { uuid, matchClass } from '@maas/vue-equipment/utils'
import { useDrawerStore } from './private/useDrawerStore'
import { useDrawerState } from './private/useDrawerState'
import { useDrawerEmitter } from './useDrawerEmitter'

import type { DrawerEvents, DrawerOptions, SnapPoint } from '../types/index'

export type UseDrawerApiOptions = Pick<
  DrawerOptions,
  'scrollLock' | 'focusTrap'
> & {
  focusTarget: MaybeElementRef
}

const defaultOptions = {
  focusTrap: false,
  focusTarget: undefined,
  scrollLock: true,
}

export function useDrawerApi(
  id?: MaybeRef<string>,
  options?: UseDrawerApiOptions
) {
  // Private state
  const positionFixedElements = ref<HTMLElement[]>([])
  const mappedId = computed(() => toValue(id) || uuid())
  const mappedOptions = defu(options, defaultOptions)

  const focusTrap = mappedOptions.focusTarget
    ? typeof mappedOptions.focusTrap === 'boolean'
      ? useFocusTrap(mappedOptions.focusTarget)
      : useFocusTrap(mappedOptions.focusTarget, mappedOptions.focusTrap)
    : undefined

  const scrollLock =
    mappedOptions.scrollLock && typeof window !== 'undefined'
      ? useScrollLock(document.body)
      : ref(false)

  // Private methods
  const { drawerStore, addInstance, removeInstance } = useDrawerStore()
  const { deleteState } = useDrawerState(mappedId.value)

  function progressCallback(payload: DrawerEvents['progress']) {
    if (payload.id === mappedId.value) {
      progress.value.x = payload.x
      progress.value.y = payload.y
    }
  }

  // Public state
  const isActive = computed(() => drawerStore.value.includes(mappedId.value))
  const progress = ref({ x: 0, y: 0 })

  // Public methods
  function open() {
    addInstance(mappedId.value)
  }

  function close() {
    removeInstance(mappedId.value)
    deleteState()
  }

  function snapTo(snapPoint: SnapPoint, duration?: number) {
    useDrawerEmitter().emit('snapTo', {
      id: mappedId.value,
      snapPoint,
      duration,
    })
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

  function initialize() {
    useDrawerEmitter().on('progress', progressCallback)
  }

  function destroy() {
    useDrawerEmitter().off('progress', progressCallback)
  }

  return {
    id: mappedId,
    isActive,
    progress,
    open,
    close,
    snapTo,
    trapFocus,
    releaseFocus,
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
    initialize,
    destroy,
  }
}

export type UseDrawerApiReturn = ReturnType<typeof useDrawerApi>
