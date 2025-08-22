import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useMetaViewport } from '@maas/vue-equipment/composables/useMetaViewport'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type { MagicDrawerOptions } from '../../types'

type UseDrawerCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: MagicDrawerOptions
  addScrollLockPadding: () => void
  removeScrollLockPadding: () => void
  lockScroll: () => void
  unlockScroll: () => void
  trapFocus: () => void
  releaseFocus: () => void
  wrapperActive: Ref<boolean>
  wasActive: Ref<boolean>
}

export function useDrawerCallback(args: UseDrawerCallbackArgs) {
  const {
    id,
    mappedOptions,
    addScrollLockPadding,
    removeScrollLockPadding,
    lockScroll,
    unlockScroll,
    trapFocus,
    releaseFocus,
    wrapperActive,
    wasActive,
  } = args

  const { setMetaViewport, resetMetaViewport } = useMetaViewport()
  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))

    if (mappedOptions.scrollLock) {
      if (
        typeof mappedOptions.scrollLock === 'object' &&
        mappedOptions.scrollLock.padding
      ) {
        addScrollLockPadding()
      }

      lockScroll()
    }

    if (mappedOptions.preventZoom) {
      setMetaViewport()
    }
  }

  function onEnter() {
    emitter.emit('enter', toValue(id))
  }

  async function onAfterEnter() {
    emitter.emit('afterEnter', toValue(id))

    if (mappedOptions.focusTrap) {
      await nextTick()
      trapFocus()
    }

    wasActive.value = true
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', toValue(id))
  }

  function onLeave() {
    emitter.emit('leave', toValue(id))
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', toValue(id))

    if (mappedOptions.scrollLock) {
      unlockScroll()
      if (
        typeof mappedOptions.scrollLock === 'object' &&
        mappedOptions.scrollLock.padding
      ) {
        removeScrollLockPadding()
      }
    }

    if (mappedOptions.focusTrap) {
      releaseFocus()
    }

    if (mappedOptions.preventZoom) {
      resetMetaViewport()
    }

    wrapperActive.value = false
  }

  return {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
  }
}
