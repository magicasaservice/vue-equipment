import { computed, toValue, nextTick, type Ref, type MaybeRef } from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'
import { useDraggableSnap } from './useDraggableSnap'
import { useDraggableState } from './useDraggableState'
import { isIOS } from '@maas/vue-equipment/utils'

import { type DefaultOptions } from '../../utils/defaultOptions'
import type { Coordinates, SnapPoint } from '../../types'

type UseDraggableDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | undefined>
  wrapperRef: Ref<HTMLDivElement | undefined>
  // threshold: MaybeRef<DefaultOptions['threshold']>
  snapPoints: MaybeRef<DefaultOptions['snapPoints']>
  animation: MaybeRef<DefaultOptions['animation']>
  initial: MaybeRef<DefaultOptions['initial']>
}

export function useDraggableDrag(args: UseDraggableDragArgs) {
  const { id, elRef, wrapperRef, snapPoints, initial, animation } = args

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
  const { snapTo, mapSnapPoint, mappedSnapPoints, interpolateDragged } =
    useDraggableSnap({
      elRect,
      wrapperRect,
      animation,
      snapPoints,
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

  function vectorBetweenCoordinates(a: Coordinates, b: Coordinates) {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = Math.sqrt(dx * dx + dy * dy)
    if (length === 0) {
      return { x: 0, y: 0 } // Return zero vector if length is zero to avoid division by zero
    } else {
      return { x: dx / length, y: dy / length }
    }
  }

  function dotProduct(vectorA: Coordinates, vectorB: Coordinates): number {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y
  }

  function checkDistance(draggedCoords: Coordinates, snapPoint: Coordinates) {
    if (!interpolateTo.value) {
      return
    }

    const distanceToInterpolateTo = Math.sqrt(
      (interpolateTo.value?.x - draggedCoords.x) ** 2 +
        (interpolateTo.value?.y - draggedCoords.y) ** 2
    )

    const distanceToSnapPoint = Math.sqrt(
      (snapPoint.x - draggedCoords.x) ** 2 +
        (snapPoint.y - draggedCoords.y) ** 2
    )

    if (distanceToSnapPoint < distanceToInterpolateTo) {
      interpolateTo.value = snapPoint
    }
  }

  function findSnapPoint() {
    let bestDotProduct = -Infinity

    const lastDraggedCoords = { x: lastDraggedX.value, y: lastDraggedY.value }
    const draggedCoords = { x: draggedX.value, y: draggedY.value }
    const lineVector = vectorBetweenCoordinates(
      lastDraggedCoords,
      draggedCoords
    )

    for (let i = 0; i < mappedSnapPoints.value.length; i++) {
      const snapPoint = mappedSnapPoints.value[i]

      const targetVector = vectorBetweenCoordinates(
        lastDraggedCoords,
        snapPoint
      )
      const currentDotProduct = dotProduct(lineVector, targetVector)

      if (currentDotProduct > bestDotProduct) {
        bestDotProduct = currentDotProduct
        interpolateTo.value = snapPoint
      } else if (currentDotProduct === bestDotProduct) {
        // If dot product is the same, check distance and pick the closest one
        checkDistance(draggedCoords, snapPoint)
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

    // Find snap point
    if (toValue(snapPoints).length) {
      findSnapPoint()
    }
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
    if (toValue(initial).snapPoint) {
      const mappedSnapPoint = mapSnapPoint(toValue(initial).snapPoint!)

      if (mappedSnapPoint) {
        draggedX.value = mappedSnapPoint.x
        draggedY.value = mappedSnapPoint.y
      }
    }
  }

  return {
    initialize,
    onPointerdown,
    onClick,
    style,
  }
}
