import { useMagicEmitter } from '@maas/vue-equipment/plugins'

type UseModalCallbackArgs = {
  viewId: string
}

export function useAccordionCallback(args: UseModalCallbackArgs) {
  const { viewId } = args

  const emitter = useMagicEmitter()

  function onBeforeEnter(_el?: Element) {
    emitter.emit('beforeEnter', viewId)
  }

  function onEnter(_el?: Element) {
    emitter.emit('enter', viewId)
  }

  async function onAfterEnter(_el?: Element) {
    emitter.emit('afterEnter', viewId)
  }

  function onBeforeLeave(_el?: Element) {
    emitter.emit('beforeLeave', viewId)
  }

  function onLeave(_el?: Element) {
    emitter.emit('leave', viewId)
  }

  function onAfterLeave(_el?: Element) {
    emitter.emit('afterLeave', viewId)
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
