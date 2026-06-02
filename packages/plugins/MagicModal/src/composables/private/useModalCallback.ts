import { toValue, nextTick, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useModalDOM } from './useModalDOM'
import type { MagicModalOptions } from '../../types'
import type { ModalActive } from '../../symbols'

type UseModalCallbackArgs = {
  id: MaybeRef<string>
  options: MagicModalOptions
  trapFocus: () => void
  releaseFocus: () => void
  active: ModalActive
}

export function useModalCallback(args: UseModalCallbackArgs) {
  const { id, options, trapFocus, releaseFocus, active } = args

  const emitter = useMagicEmitter()
  const { lockScroll, unlockScroll } = useModalDOM()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))

    if (options.scrollLock) {
      lockScroll(
        typeof options.scrollLock === 'object' &&
          options.scrollLock.padding
      )
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
        typeof options.scrollLock === 'object' &&
          options.scrollLock.padding
      )
    }

    if (options.focusTrap) {
      releaseFocus()
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
