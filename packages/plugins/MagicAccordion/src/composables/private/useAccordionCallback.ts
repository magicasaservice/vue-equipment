import { toValue, type MaybeRef } from 'vue'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

type UseModalCallbackArgs = {
  viewId: string
  instanceId: MaybeRef<string>
}

export function useAccordionCallback(args: UseModalCallbackArgs) {
  const { viewId, instanceId } = args

  const emitter = useMagicEmitter()

  function onBeforeEnter(_el?: Element) {
    emitter.emit('beforeEnter', { id: toValue(instanceId), viewId })
  }

  function onEnter(_el?: Element) {
    emitter.emit('enter', { id: toValue(instanceId), viewId })
  }

  async function onAfterEnter(_el?: Element) {
    emitter.emit('afterEnter', { id: toValue(instanceId), viewId })
  }

  function onBeforeLeave(_el?: Element) {
    emitter.emit('beforeLeave', { id: toValue(instanceId), viewId })
  }

  function onLeave(_el?: Element) {
    emitter.emit('leave', { id: toValue(instanceId), viewId })
  }

  function onAfterLeave(_el?: Element) {
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
