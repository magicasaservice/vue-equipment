import { toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useMetaViewport } from '@maas/vue-equipment/composables/useMetaViewport'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type { MagicDrawerOptions } from '../../types'
import type { DrawerActive } from '../../types'
import { useDrawerDOM } from './useDrawerDOM'

type UseDrawerCallbackArgs = {
  id: MaybeRef<string>
  options: MagicDrawerOptions
  trapFocus: () => void
  releaseFocus: () => void
  active: DrawerActive
  wasActive: Ref<boolean>
}

export function useDrawerCallback(args: UseDrawerCallbackArgs) {
  const { id, options, trapFocus, releaseFocus, active, wasActive } = args

  const { lockScroll, unlockScroll } = useDrawerDOM()
  const { setMetaViewport, resetMetaViewport } = useMetaViewport()
  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))

    if (options.scrollLock) {
      lockScroll(
        typeof options.scrollLock === 'object' && options.scrollLock.padding
      )
    }

    if (options.preventZoom) {
      setMetaViewport()
    }
  }

  function onEnter() {
    emitter.emit('enter', toValue(id))
  }

  async function onAfterEnter() {
    emitter.emit('afterEnter', toValue(id))

    if (options.focusTrap) {
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

    if (options.scrollLock) {
      unlockScroll(
        typeof options.scrollLock === 'object' && options.scrollLock.padding
      )
    }

    if (options.focusTrap) {
      releaseFocus()
    }

    if (options.preventZoom) {
      resetMetaViewport()
    }

    active.wrapperActive = false
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
