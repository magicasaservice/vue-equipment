import { toValue, type MaybeRef, type Ref } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

type UseCookieCallbackArgs = {
  id: MaybeRef<string>
  wrapperActive?: Ref<boolean>
}

export function useCookieCallback(args: UseCookieCallbackArgs) {
  const { id, wrapperActive } = args
  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(id))
  }

  function onEnter() {
    emitter.emit('enter', toValue(id))
  }

  async function onAfterEnter() {
    emitter.emit('afterEnter', toValue(id))
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', toValue(id))
  }

  function onLeave() {
    emitter.emit('leave', toValue(id))
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', toValue(id))

    if (wrapperActive) {
      wrapperActive.value = false
    }
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
