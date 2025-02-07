import { toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

export function useCookieCallback(instanceId: MaybeRef<string>) {
  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', toValue(instanceId))
  }

  function onEnter() {
    emitter.emit('enter', toValue(instanceId))
  }

  async function onAfterEnter() {
    emitter.emit('afterEnter', toValue(instanceId))
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', toValue(instanceId))
  }

  function onLeave() {
    emitter.emit('leave', toValue(instanceId))
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', toValue(instanceId))
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
