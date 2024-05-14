import {
  watch,
  toValue,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type Ref,
  type MaybeRef,
} from 'vue'
import { useElementBounding, useRafFn } from '@vueuse/core'
import { clampValue, mapValue } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useDrawerState } from './useDrawerState'

import type { MagicDrawerEvents } from '../../types'
import type { DefaultOptions } from '../../utils/defaultOptions'
import type { ValueOf } from '@maas/vue-equipment/utils'

interface UseDrawerProgressArgs {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | undefined>
  drawerRef: Ref<HTMLDivElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
  overshoot: MaybeRef<number>
}

export function useDrawerProgress(args: UseDrawerProgressArgs) {
  const { id, drawerRef, elRef, position, overshoot } = args
  const { findState } = useDrawerState(id)

  // Private state
  const drawerRect = useElementBounding(drawerRef)
  const elRect = useElementBounding(elRef)

  const maxX = computed(
    () => drawerRect.width.value - elRect.width.value + toValue(overshoot)
  )
  const maxY = computed(
    () => drawerRect.height.value - elRect.height.value + toValue(overshoot)
  )

  // Public state
  const { progress } = findState()

  // Private method
  function rafCallback() {
    drawerRect.update()
    elRect.update()
    calculateProgress()
  }

  const emitter = useMagicEmitter()

  const { pause: snapPause, resume: snapResume } = useRafFn(rafCallback, {
    immediate: false,
  })

  const { pause: dragPause, resume: dragResume } = useRafFn(rafCallback, {
    immediate: false,
  })

  const { pause, resume } = useRafFn(rafCallback, {
    immediate: false,
  })

  function calculateProgress() {
    let rawX = 0
    let rawY = 0

    switch (position) {
      case 'bottom':
        rawY = mapValue(
          elRect.top.value,
          drawerRect.height.value,
          maxY.value,
          0,
          1
        )
        break
      case 'top':
        rawY = mapValue(
          elRect.top.value * -1,
          drawerRect.height.value,
          maxX.value,
          0,
          1
        )
        break
      case 'left':
        rawX = mapValue(
          elRect.left.value * -1,
          drawerRect.width.value,
          maxX.value,
          0,
          1
        )
        break
      case 'right':
        rawX = mapValue(
          elRect.left.value,
          drawerRect.width.value,
          maxX.value,
          0,
          1
        )
        break
    }

    // Clamp the values between 0 and 1
    const x = clampValue(rawX, 0, 1)
    const y = clampValue(rawY, 0, 1)

    progress.value = { x, y }
  }

  watch([() => progress.value.x, () => progress.value.y], ([x, y]) => {
    emitter.emit('progress', {
      id: toValue(id),
      x,
      y,
    })
  })

  function beforeCallback(payload: ValueOf<MagicDrawerEvents>) {
    if (payload === toValue(id)) {
      resume()
    }
  }

  function beforeSnapCallback(payload: MagicDrawerEvents['beforeSnap']) {
    if (payload.id === toValue(id)) {
      snapResume()
    }
  }

  function beforeDragCallback(payload: MagicDrawerEvents['beforeDrag']) {
    if (payload.id === toValue(id)) {
      dragResume()
    }
  }

  async function afterCallback(payload: ValueOf<MagicDrawerEvents>) {
    await nextTick()

    if (payload === toValue(id)) {
      pause()
      await nextTick()
      rafCallback()
    }
  }

  async function afterSnapCallback(payload: MagicDrawerEvents['afterSnap']) {
    await nextTick()

    if (payload.id === toValue(id)) {
      snapPause()
      await nextTick()
      rafCallback()
    }
  }

  async function afterDragCallback(payload: MagicDrawerEvents['drag']) {
    await nextTick()

    if (payload.id === toValue(id)) {
      dragPause()
      await nextTick()
      rafCallback()
    }
  }

  onMounted(() => {
    emitter.on('beforeEnter', beforeCallback)
    emitter.on('afterEnter', afterCallback)
    emitter.on('beforeDrag', beforeDragCallback)
    emitter.on('afterDrag', afterDragCallback)
    emitter.on('beforeSnap', beforeSnapCallback)
    emitter.on('afterSnap', afterSnapCallback)
    emitter.on('beforeLeave', beforeCallback)
    emitter.on('afterLeave', afterCallback)
  })

  onBeforeUnmount(() => {
    emitter.off('beforeEnter', beforeCallback)
    emitter.off('afterEnter', afterCallback)
    emitter.off('beforeDrag', beforeDragCallback)
    emitter.off('afterDrag', afterDragCallback)
    emitter.off('beforeSnap', beforeSnapCallback)
    emitter.off('afterSnap', afterSnapCallback)
    emitter.off('beforeLeave', beforeCallback)
    emitter.off('afterLeave', afterCallback)
  })

  return { progress }
}
