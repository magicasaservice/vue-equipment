import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  toRefs,
  toValue,
  watch,
} from 'vue'
import { useElementBounding, useRafFn } from '@vueuse/core'
import { clampValue, mapValue } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useDrawerState } from './useDrawerState'

import type { MaybeRef, Ref } from 'vue'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

import type { RequiredMagicDrawerOptions } from '../../types'

interface UseDrawerProgressArgs {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
  drawerRef: Ref<HTMLDivElement | null>
  position: MaybeRef<RequiredMagicDrawerOptions['position']>
  overshoot: MaybeRef<number>
}

export function useDrawerProgress(args: UseDrawerProgressArgs) {
  const { id, drawerRef, elRef, position, overshoot } = args
  const { initializeState } = useDrawerState(id)
  const emitter = useMagicEmitter()

  // Private state
  const state = initializeState()
  const { draggedX, draggedY, wrapperRect } = toRefs(state)

  // The open and close transitions run in CSS, so while one plays only the
  // DOM knows where the panel is
  let transitioning = false
  const drawerRect = useElementBounding(drawerRef)
  const elRect = useElementBounding(elRef)

  const maxX = computed(
    () => drawerRect.width.value - elRect.width.value + toValue(overshoot)
  )

  const maxY = computed(
    () => drawerRect.height.value - elRect.height.value + toValue(overshoot)
  )

  // Public state
  const { progress } = toRefs(state)

  // Private functions
  // Clamp to 0..1 and drop the -0 that mapValue can produce
  function setProgress(x: number, y: number) {
    progress.value = {
      x: clampValue(x, 0, 1) || 0,
      y: clampValue(y, 0, 1) || 0,
    }
  }

  // Progress from the translation along the drawer’s axis: 1 at rest, 0 once
  // the panel has travelled its full extent toward closed
  function calculate() {
    const rect = wrapperRect.value

    if (!rect) {
      setProgress(0, 0)
      return
    }

    const extentX = rect.width - toValue(overshoot)
    const extentY = rect.height - toValue(overshoot)

    switch (toValue(position)) {
      case 'top':
      case 'bottom':
        setProgress(0, extentY ? 1 - Math.abs(draggedY.value) / extentY : 0)
        break
      case 'left':
      case 'right':
        setProgress(extentX ? 1 - Math.abs(draggedX.value) / extentX : 0, 0)
        break
    }
  }

  function measure() {
    drawerRect.update()
    elRect.update()

    let rawX = 0
    let rawY = 0

    switch (toValue(position)) {
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
          maxY.value,
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

    setProgress(rawX, rawY)
  }

  const { pause, resume } = useRafFn(measure, { immediate: false })

  function beforeTransition(payload: MagicEmitterEvents['beforeEnter']) {
    if (payload === toValue(id)) {
      transitioning = true
      resume()
    }
  }

  async function afterTransition(payload: MagicEmitterEvents['afterEnter']) {
    await nextTick()

    if (payload === toValue(id)) {
      pause()
      transitioning = false
      calculate()
    }
  }

  watch([draggedX, draggedY, wrapperRect, () => toValue(overshoot)], () => {
    if (!transitioning) {
      calculate()
    }
  })

  watch([() => progress.value.x, () => progress.value.y], ([x, y]) => {
    emitter.emit('progress', {
      id: toValue(id),
      x,
      y,
    })
  })

  onMounted(() => {
    emitter.on('beforeEnter', beforeTransition)
    emitter.on('afterEnter', afterTransition)
    emitter.on('beforeLeave', beforeTransition)
    emitter.on('afterLeave', afterTransition)
  })

  onBeforeUnmount(() => {
    emitter.off('beforeEnter', beforeTransition)
    emitter.off('afterEnter', afterTransition)
    emitter.off('beforeLeave', beforeTransition)
    emitter.off('afterLeave', afterTransition)
  })

  return { progress }
}
