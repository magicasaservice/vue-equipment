import { toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

type UseModalCallbackArgs = {
  viewId: string
  instanceId: MaybeRef<string>
}

export function useAccordionCallback(args: UseModalCallbackArgs) {
  const { viewId, instanceId } = args

  const emitter = useMagicEmitter()

  function onBeforeEnter() {
    emitter.emit('beforeEnter', { id: toValue(instanceId), viewId })
  }

  function onEnter() {
    emitter.emit('enter', { id: toValue(instanceId), viewId })
  }

  async function onAfterEnter() {
    emitter.emit('afterEnter', { id: toValue(instanceId), viewId })
  }

  function onBeforeLeave() {
    emitter.emit('beforeLeave', { id: toValue(instanceId), viewId })
  }

  function onLeave() {
    emitter.emit('leave', { id: toValue(instanceId), viewId })
  }

  function onAfterLeave() {
    emitter.emit('afterLeave', { id: toValue(instanceId), viewId })
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
