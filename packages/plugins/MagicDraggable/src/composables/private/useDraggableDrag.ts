import { computed, toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'
import { useDraggableSnap } from './useDraggableSnap'
import { useDraggableState } from './useDraggableState'
import { isIOS } from '@maas/vue-equipment/utils'

import { type DefaultOptions } from '../../utils/defaultOptions'

type UseDraggableDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | undefined>
  wrapperRef: Ref<HTMLDivElement | undefined>
  threshold: MaybeRef<DefaultOptions['threshold']>
  snap: MaybeRef<DefaultOptions['snap']>
}

export function useDraggableDrag(args: UseDraggableDragArgs) {
  const { id, elRef, wrapperRef, threshold, snap } = args

  // Private state
  const { findState } = useDraggableState(toValue(id))
  const {
    dragStart,
    dragging,
    interpolateTo,
    originX,
    originY,
    lastDraggedX,
    lastDraggedY,
    draggedX,
    draggedY,
    elRect,
    wrapperRect,
  } = findState()

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined

  // Public state
  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

  // Snap logic
  const { snapTo, mapSnapPoint, interpolateDragged } = useDraggableSnap({
    elRect,
    wrapperRect,
    snap,
    draggedY,
    draggedX,
  })

  // Private functions
  async function getSizes() {
    elRect.value = unrefElement(elRef)?.getBoundingClientRect()
    wrapperRect.value = unrefElement(wrapperRef)?.getBoundingClientRect()
    await nextTick()
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    // TODO: 'setDragged'
    draggedX.value = x - originX.value
    draggedY.value = y - originY.value
  }

  function resetStateAndListeners() {
    dragging.value = false
    interpolateTo.value = undefined
    cancelTouchend?.()
    cancelPointerup?.()
    cancelPointermove?.()
  }

  interface CollisionInfo {
    top: number
    left: number
    bottom: number
    right: number
  }

  function detectCollision() {
    const childRect = toValue(elRect)
    const parentRect = toValue(wrapperRect)

    if (!childRect || !parentRect) {
      return
    }

    // Check if child is wider or higher than parent
    if (
      childRect.width > parentRect.width ||
      childRect.height > parentRect.height
    ) {
      console.warn('MagicDraggable is too small for its content')
      return
    }

    // Set to current dragged position, to remember non colliding axis position
    interpolateTo.value = { x: draggedX.value, y: draggedY.value }

    // Check y axis
    if (childRect.top < parentRect.top) {
      interpolateTo.value = { x: interpolateTo.value?.x, y: 0 }
    } else if (childRect.bottom > parentRect.bottom) {
      interpolateTo.value = {
        x: interpolateTo.value?.x,
        y: parentRect.height - childRect.height,
      }
    }

    // Check x axis
    if (childRect.left < parentRect.left) {
      interpolateTo.value = { x: 0, y: interpolateTo.value?.y }
    } else if (childRect.right > parentRect.right) {
      interpolateTo.value = {
        x: parentRect.width - childRect.width,
        y: interpolateTo.value?.y,
      }
    }
  }

  function onPointerup(_e: PointerEvent) {
    const { x, y } = interpolateTo.value || {}

    if (x !== undefined && y !== undefined) {
      interpolateDragged({ x, y })
    }

    // Reset state
    resetStateAndListeners()
  }

  function onPointermove(e: PointerEvent) {
    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    // Check for collision with bounding box
    getSizes()
    detectCollision()
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Prevent dragging if we’re already dragging
    if (dragging.value) {
      return
    } else {
      dragging.value = true
    }

    // Save last dragged position,
    // used later to check if click event should propagate
    lastDraggedX.value = draggedX.value
    lastDraggedY.value = draggedY.value

    // Add listeners
    cancelPointerup = useEventListener(document, 'pointerup', onPointerup)
    cancelPointermove = useEventListener(document, 'pointermove', onPointermove)

    // Pointerup doesn’t fire on iOS, so we need to use touchend
    cancelTouchend = isIOS()
      ? useEventListener(document, 'touchend', onPointerup)
      : undefined

    // Origin is the distance between pointer event and last dragged position
    originX.value = e.screenX - draggedX.value
    originY.value = e.screenY - draggedY.value

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onPointermove(e)
  }

  function onClick(e: MouseEvent) {
    // if (hasDragged.value) {
    e.preventDefault()
    // }
  }

  async function initialize() {
    await getSizes()

    if (elRect.value && wrapperRect.value) {
      if (
        elRect.value.width > wrapperRect.value.width ||
        elRect.value.height > wrapperRect.value.height
      ) {
        console.warn('MagicDraggable is too small for its content')
        return
      }
    }

    await nextTick()
    // Snap to initial position
    if (!!toValue(snap).initial) {
      const { x, y } = mapSnapPoint(toValue(snap).initial!)
      draggedX.value = x
      draggedY.value = y
    }
  }

  return {
    initialize,
    onPointerdown,
    onClick,
    style,
  }
}
