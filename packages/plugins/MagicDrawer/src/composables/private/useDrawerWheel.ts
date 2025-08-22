import {
  computed,
  toValue,
  toRefs,
  type Ref,
  type MaybeRef,
  type ComputedRef,
} from 'vue'
import { unrefElement } from '@vueuse/core'
import WheelGestures, { type WheelEventState } from 'wheel-gestures'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useDrawerState } from './useDrawerState'

import type { DrawerDefaultOptions } from '../../types'

type UseDrawerWheelArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
  position: MaybeRef<DrawerDefaultOptions['position']>
  disabled: ComputedRef<boolean>
}

export function useDrawerWheel(args: UseDrawerWheelArgs) {
  const { id, elRef, position, disabled } = args

  const { logError } = useMagicError({
    prefix: 'MagicDrawer',
    source: 'useDrawerWheel',
  })

  const { initializeState } = useDrawerState(toValue(id))
  const state = initializeState()

  const { dragging, wheeling } = toRefs(state)

  let startEvent: PointerEvent

  const axis = computed(() => {
    switch (toValue(position)) {
      case 'left':
      case 'right':
        return 'x'
      case 'top':
      case 'bottom':
        return 'y'
      default:
        return undefined
    }
  })

  const wheelGestures = WheelGestures({
    preventWheelAction: disabled ? false : axis.value,
    reverseSign: [true, true, false], // Reverse scroll direction for x and y axis
  })

  let unobserveTargetNode: ReturnType<
    ReturnType<typeof WheelGestures>['observe']
  >

  let cancelWheel: ReturnType<ReturnType<typeof WheelGestures>['on']>

  function createPointerEvent(
    type: 'pointermove' | 'pointerup',
    state: WheelEventState
  ) {
    const [moveX, moveY] = state.axisMovement

    if (!startEvent) {
      return new PointerEvent(type)
    }

    return new PointerEvent(type, {
      clientX: startEvent.clientX + moveX,
      clientY: startEvent.clientY + moveY,
      screenX: startEvent.screenX + moveX,
      screenY: startEvent.screenY + moveY,
      button: 0,
      bubbles: true,
      cancelable: true,
      composed: true,
    })
  }

  function dispatchEvent(event: UIEvent) {
    unrefElement(elRef)?.dispatchEvent(event)
  }

  function onWheelStarted(state: WheelEventState) {
    try {
      startEvent = new PointerEvent('pointerdown', state.event)
      dispatchEvent(startEvent)
      wheeling.value = true
    } catch (e) {
      logError(String(e))
      return destroyWheelListener()
    }
  }

  function onWheelMove(state: WheelEventState) {
    dispatchEvent(createPointerEvent('pointermove', state))
  }

  function onWheelEnded(state: WheelEventState) {
    dispatchEvent(createPointerEvent('pointerup', state))
    wheeling.value = false
  }

  function handleWheel(state: WheelEventState) {
    const {
      axisDelta: [deltaX, deltaY],
    } = state

    const primaryAxisDelta = axis.value === 'x' ? deltaX : deltaY
    const crossAxisDelta = axis.value === 'x' ? deltaY : deltaX

    const isEndingOrRelease =
      (state.isEnding && !state.isMomentum) ||
      (state.isMomentum && state.previous && !state.previous.isMomentum)

    const primaryAxisDeltaIsDominant =
      Math.abs(primaryAxisDelta) > Math.abs(crossAxisDelta)

    if (primaryAxisDeltaIsDominant && !dragging.value && !state.isMomentum) {
      onWheelStarted(state)
    }

    if (!dragging.value || !wheeling.value) {
      return
    }

    if (isEndingOrRelease) {
      onWheelEnded(state)
    } else {
      onWheelMove(state)
    }
  }

  function initializeWheelListener() {
    unobserveTargetNode = wheelGestures.observe(document)
    cancelWheel = wheelGestures.on('wheel', handleWheel)
  }

  function destroyWheelListener() {
    unobserveTargetNode()
    cancelWheel()
  }

  return {
    initializeWheelListener,
    destroyWheelListener,
  }
}
