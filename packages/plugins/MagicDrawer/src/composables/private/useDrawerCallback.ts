import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useMetaViewport } from '@maas/vue-equipment/composables/useMetaViewport'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type { MagicDrawerOptions } from '../../types'
import { useDrawerDOM } from './useDrawerDOM'

type UseDrawerCallbackArgs = {
  id: MaybeRef<string>
  mappedOptions: MagicDrawerOptions
  trapFocus: () => void
  releaseFocus: () => void
  wrapperActive: Ref<boolean>
  wasActive: Ref<boolean>
}

export function useDrawerCallback(args: UseDrawerCallbackArgs) {
  const {
    id,
    mappedOptions,

    trapFocus,
    releaseFocus,
    wrapperActive,
    wasActive,
  } = args

  const { lockScroll, unlockScroll } = useDrawerDOM()
  const { setMetaViewport, resetMetaViewport } = useMetaViewport()
  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))

    if (mappedOptions.scrollLock) {
      lockScroll(
        typeof mappedOptions.scrollLock === 'object' &&
          mappedOptions.scrollLock.padding
      )
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
      unlockScroll(
        typeof mappedOptions.scrollLock === 'object' &&
          mappedOptions.scrollLock.padding
      )
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
