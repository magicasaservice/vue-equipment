import { computed, toValue, type Ref, type MaybeRef } from 'vue'
import { unrefElement } from '@vueuse/core'
import WheelGestures, { type WheelEventState } from 'wheel-gestures'
import { useDrawerState } from './useDrawerState'

import { type DefaultOptions } from '../../utils/defaultOptions'

type UseDrawerWheelArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | undefined>
  drawerRef: Ref<HTMLElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
}

export function useDrawerWheel(args: UseDrawerWheelArgs) {
  const { id, elRef, drawerRef, position } = args

  const { findState } = useDrawerState(toValue(id))
  const { dragging } = findState()

  let startEvent: PointerEvent

  const axis = computed(() => {
    switch (toValue(position)) {
      case 'left':
      case 'right':
        return 'x'
      case 'top':
      case 'bottom':
        return 'y'
    }
  })

  const wheelGestures = WheelGestures({
    preventWheelAction: axis.value,
    reverseSign: [true, true, false],
  })

  let unobserveTargetNode: ReturnType<
    ReturnType<typeof WheelGestures>['observe']
  >

  let cancelWheel: ReturnType<ReturnType<typeof WheelGestures>['on']>

  function createPointerEvent(
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    state: WheelEventState
  ) {
    let moveX, moveY
    ;[moveX, moveY] = state.axisMovement

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
    } catch (e) {
      return destroyWheelListener()
    }
  }

  function onWheelEnded(state: WheelEventState) {
    dispatchEvent(createPointerEvent('pointerup', state))
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

    if (!dragging.value) {
      return
    }

    if (isEndingOrRelease) {
      onWheelEnded(state)
    } else {
      dispatchEvent(createPointerEvent('pointermove', state))
    }
  }

  function initializeWheelListener() {
    if (!unrefElement(drawerRef)) {
      return
    }

    unobserveTargetNode = wheelGestures.observe(unrefElement(drawerRef)!)
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