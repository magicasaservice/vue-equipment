import {
  ref,
  watch,
  toValue,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type Ref,
  type MaybeRef,
} from 'vue'
import { useDrawerEmitter } from './../useDrawerEmitter'
import { useElementBounding, useRafFn } from '@vueuse/core'

import type { DrawerEvents } from '../../types'
import type { DefaultOptions } from '../../utils/defaultOptions'

import { clampValue, mapValue } from '@maas/vue-equipment/utils'

interface UseDrawerProgressArgs {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | undefined>
  drawerRef: Ref<HTMLDivElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
  overshoot: MaybeRef<number>
}

export function useDrawerProgress(args: UseDrawerProgressArgs) {
  const { id, drawerRef, elRef, position, overshoot } = args

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
  const progress = ref({ x: 0, y: 0 })

  // Private method
  function rafCallback() {
    drawerRect.update()
    elRect.update()
    calculateProgress()
  }

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
    useDrawerEmitter().emit('progress', {
      id: toValue(id),
      x,
      y,
    })
  })

  function beforeCallback(payload: DrawerEvents[keyof DrawerEvents]) {
    if (payload === toValue(id)) {
      resume()
    }
  }

  function beforeSnapCallback(payload: DrawerEvents['beforeSnap']) {
    if (payload.id === toValue(id)) {
      snapResume()
    }
  }

  function beforeDragCallback(payload: DrawerEvents['beforeDrag']) {
    if (payload.id === toValue(id)) {
      dragResume()
    }
  }

  async function afterCallback(payload: DrawerEvents[keyof DrawerEvents]) {
    await nextTick()

    if (payload === toValue(id)) {
      pause()
      await nextTick()
      rafCallback()
    }
  }

  async function afterSnapCallback(payload: DrawerEvents['afterSnap']) {
    await nextTick()

    if (payload.id === toValue(id)) {
      snapPause()
      await nextTick()
      rafCallback()
    }
  }

  async function afterDragCallback(payload: DrawerEvents['drag']) {
    await nextTick()

    if (payload.id === toValue(id)) {
      dragPause()
      await nextTick()
      rafCallback()
    }
  }

  onMounted(() => {
    useDrawerEmitter().on('beforeEnter', beforeCallback)
    useDrawerEmitter().on('afterEnter', afterCallback)
    useDrawerEmitter().on('beforeDrag', beforeDragCallback)
    useDrawerEmitter().on('afterDrag', afterDragCallback)
    useDrawerEmitter().on('beforeSnap', beforeSnapCallback)
    useDrawerEmitter().on('afterSnap', afterSnapCallback)
    useDrawerEmitter().on('beforeLeave', beforeCallback)
    useDrawerEmitter().on('afterLeave', afterCallback)
  })

  onBeforeUnmount(() => {
    useDrawerEmitter().off('beforeEnter', beforeCallback)
    useDrawerEmitter().off('afterEnter', afterCallback)
    useDrawerEmitter().off('beforeDrag', beforeDragCallback)
    useDrawerEmitter().off('afterDrag', afterDragCallback)
    useDrawerEmitter().off('beforeSnap', beforeSnapCallback)
    useDrawerEmitter().off('afterSnap', afterSnapCallback)
    useDrawerEmitter().off('beforeLeave', beforeCallback)
    useDrawerEmitter().off('afterLeave', afterCallback)
  })

  return { progress }
}
