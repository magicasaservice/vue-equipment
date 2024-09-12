import {
  ref,
  computed,
  toValue,
  nextTick,
  watch,
  type Ref,
  type MaybeRef,
} from 'vue'
import {
  useEventListener,
  unrefElement,
  useResizeObserver,
  useThrottleFn,
  useIdle,
} from '@vueuse/core'
import { isIOS, isWithinRange } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { useDraggableSnap } from './useDraggableSnap'
import { useDraggableState } from './useDraggableState'
import { useDraggableScrollLock } from './useDraggableScrollLock'

import { type DefaultOptions } from '../../utils/defaultOptions'
import type { Coordinates } from '../../types'

type UseDraggableDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | undefined>
  wrapperRef: Ref<HTMLDivElement | undefined>
  threshold: MaybeRef<DefaultOptions['threshold']>
  snapPoints: MaybeRef<DefaultOptions['snapPoints']>
  animation: MaybeRef<DefaultOptions['animation']>
  initial: MaybeRef<DefaultOptions['initial']>
}

export function useDraggableDrag(args: UseDraggableDragArgs) {
  const { id, elRef, wrapperRef, threshold, snapPoints, initial, animation } =
    args

  // Private state
  const { initializeState } = useDraggableState(toValue(id))
  const {
    dragStart,
    dragging,
    interpolateTo,
    originX,
    originY,
    lastDraggedX,
    lastDraggedY,
    intermediateDraggedX,
    intermediateDraggedY,
    draggedX,
    draggedY,
    elRect,
    wrapperRect,
  } = initializeState()

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined
  let cancelTouchend: (() => void) | undefined = undefined

  const momentumThresholdReached = ref(false)
  const distanceThresholdReached = ref(false)

  // Public state
  const style = computed(
    () => `transform: translate3d(${draggedX.value}px, ${draggedY.value}px, 0)`
  )

  const hasDragged = computed(() => {
    const hasDraggedX = !isWithinRange({
      input: draggedX.value,
      base: lastDraggedX.value,
      threshold: toValue(threshold).lock,
    })

    const hasDraggedY = !isWithinRange({
      input: draggedY.value,
      base: lastDraggedY.value,
      threshold: toValue(threshold).lock,
    })

    return hasDraggedX || hasDraggedY
  })

  // Snap logic
  const {
    snapTo,
    activeSnapPoint,
    mapSnapPoint,
    mappedSnapPoints,
    snapPointsMap,
    interpolateDragged,
  } = useDraggableSnap({
    id,
    elRect,
    wrapperRect,
    animation,
    snapPoints,
    draggedY,
    draggedX,
  })

  // Private functions
  const emitter = useMagicEmitter()

  const {
    lockScroll,
    unlockScroll,
    addScrollLockPadding,
    removeScrollLockPadding,
  } = useDraggableScrollLock()

  async function getSizes() {
    elRect.value = unrefElement(elRef)?.getBoundingClientRect()
    wrapperRect.value = unrefElement(wrapperRef)?.getBoundingClientRect()
    await nextTick()
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    draggedX.value = x - originX.value
    draggedY.value = y - originY.value
  }

  function resetStateAndListeners() {
    dragging.value = false
    interpolateTo.value = undefined
    momentumThresholdReached.value = false
    distanceThresholdReached.value = false
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

  function calculateDistance(a: Coordinates, b: Coordinates) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  }

  function checkDistance() {
    // Check if threshold distance is reached
    if (toValue(threshold).distance) {
      const intermediateDraggedCoords = {
        x: intermediateDraggedX.value,
        y: intermediateDraggedY.value,
      }
      const draggedCoords = { x: draggedX.value, y: draggedY.value }
      const draggedDistance = calculateDistance(
        intermediateDraggedCoords,
        draggedCoords
      )

      if (draggedDistance < toValue(threshold).distance!) {
        return
      }
    }

    distanceThresholdReached.value = true
  }

  function checkMomentum() {
    // Check if threshold momentum is reached
    if (dragStart.value && toValue(threshold).momentum) {
      const intermediateDraggedCoords = {
        x: intermediateDraggedX.value,
        y: intermediateDraggedY.value,
      }
      const draggedCoords = { x: draggedX.value, y: draggedY.value }
      const draggedDistance = calculateDistance(
        intermediateDraggedCoords,
        draggedCoords
      )

      const dragTime = new Date().getTime() - dragStart.value.getTime()

      if (dragTime === 0) {
        return
      }

      const dragSpeed = draggedDistance / dragTime

      if (dragSpeed < toValue(threshold).momentum!) {
        return
      }
    }

    momentumThresholdReached.value = true
  }

  function compareDistances(a: Coordinates, b: Coordinates) {
    const draggedCoords = { x: draggedX.value, y: draggedY.value }
    const distanceA = calculateDistance(a, draggedCoords)
    const distanceB = calculateDistance(b, draggedCoords)

    return distanceA < distanceB ? a : b
  }

  function findSnapPointByVector() {
    let bestDotProduct = -Infinity

    const intermediateDraggedCoords = {
      x: intermediateDraggedX.value,
      y: intermediateDraggedY.value,
    }
    const draggedCoords = { x: draggedX.value, y: draggedY.value }

    const lineVector = vectorBetweenCoordinates(
      intermediateDraggedCoords,
      draggedCoords
    )

    for (let i = 0; i < mappedSnapPoints.value.length; i++) {
      const snapPoint = mappedSnapPoints.value[i]

      const targetVector = vectorBetweenCoordinates(
        intermediateDraggedCoords,
        snapPoint
      )

      const currentDotProduct = dotProduct(lineVector, targetVector)

      if (currentDotProduct > bestDotProduct) {
        bestDotProduct = currentDotProduct
        interpolateTo.value = snapPoint
      } else if (currentDotProduct === bestDotProduct) {
        // If dot product is the same, compare distance and pick the closest one
        if (!interpolateTo.value) {
          interpolateTo.value = snapPoint
        } else {
          const smallerDistance = compareDistances(
            snapPoint,
            interpolateTo.value!
          )
          interpolateTo.value = smallerDistance
        }
      }
    }
  }

  function findClosestSnapPoint() {
    const draggedCoords = { x: draggedX.value, y: draggedY.value }
    const closestSnapPoint = mappedSnapPoints.value.reduce((a, b) => {
      return calculateDistance(a, draggedCoords) <
        calculateDistance(b, draggedCoords)
        ? a
        : b
    })
    return closestSnapPoint
  }

  function onPointerup(e: PointerEvent) {
    // Snap to the closest snap point if the user did not drag with enough momentum
    if (!momentumThresholdReached.value && distanceThresholdReached.value) {
      interpolateTo.value = findClosestSnapPoint()
    }

    const { x, y } = interpolateTo.value || {}

    if (x !== undefined && y !== undefined) {
      interpolateDragged({ x, y })
    }

    // Save the snap point we’re snapping to
    // both the input value, as well as the actual pixel value
    if (interpolateTo.value) {
      const key = `x${interpolateTo.value.x}y${interpolateTo.value.y}`
      activeSnapPoint.value = snapPointsMap.value[key]
    }

    if (
      intermediateDraggedX.value === draggedX.value &&
      intermediateDraggedY.value === draggedY.value
    ) {
      emitter.emit('dragCanceled', {
        id: toValue(id),
        x: draggedX.value,
        y: draggedY.value,
      })
    } else {
      emitter.emit('afterDrag', {
        id: toValue(id),
        x: draggedX.value,
        y: draggedY.value,
      })
    }

    // Reset state
    resetStateAndListeners()

    // Unlock scroll
    unlockScroll()
    removeScrollLockPadding()

    // Release pointer capture
    elRef.value?.releasePointerCapture(e.pointerId)
  }

  function onPointermove(e: PointerEvent) {
    // Prevent dragging with a secondary pointer
    if (!e.isPrimary) {
      return
    }

    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    // Check for collision with bounding box
    getSizes()
    detectCollision()

    // Check thresholds
    if (!distanceThresholdReached.value) {
      checkDistance()
    }

    if (!momentumThresholdReached.value) {
      checkMomentum()
    }

    // Snap back to last dragged position if thresholds are not reached
    if (!distanceThresholdReached.value && !momentumThresholdReached.value) {
      interpolateTo.value = { x: lastDraggedX.value, y: lastDraggedY.value }
      return
    }

    // Find snap point
    if (toValue(snapPoints).length) {
      findSnapPointByVector()
    }

    emitter.emit('drag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  function onIdle() {
    // Snap to the closest point if the user has idled
    interpolateTo.value = findClosestSnapPoint()

    // Reset the intermediate dragged position, so that the direction vector
    // is calculated correctly for the subsequent drag
    if (distanceThresholdReached.value && momentumThresholdReached.value) {
      intermediateDraggedX.value = draggedX.value
      intermediateDraggedY.value = draggedY.value

      // Reset thresholds
      distanceThresholdReached.value = false
      momentumThresholdReached.value = false
    }
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Lock scroll as soon as the user starts dragging
    lockScroll()
    addScrollLockPadding()

    // Prevent dragging if we’re already dragging
    if (dragging.value) {
      return
    } else {
      // Capture pointer, save state
      elRef.value?.setPointerCapture(e.pointerId)
      dragging.value = true

      emitter.emit('beforeDrag', {
        id: toValue(id),
        x: draggedX.value,
        y: draggedY.value,
      })
    }

    // Save intermediate and last dragged position,
    // used later to reset position and calculate vectors
    intermediateDraggedX.value = draggedX.value
    intermediateDraggedY.value = draggedY.value

    lastDraggedX.value = draggedX.value
    lastDraggedY.value = draggedY.value

    // Add listeners
    cancelPointerup = useEventListener(document, 'pointerup', onPointerup)
    cancelPointermove = useEventListener(
      document,
      'pointermove',
      onPointermove,
      { passive: false }
    )

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
    if (hasDragged.value) {
      e.preventDefault()
    }
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
    if (toValue(initial).snapPoint) {
      // Save initial snap point
      // Important for the resize listeners to work properly right away
      activeSnapPoint.value = toValue(initial).snapPoint

      // Snap to initial position
      const mappedSnapPoint = mapSnapPoint(toValue(initial).snapPoint!)

      if (mappedSnapPoint) {
        draggedX.value = mappedSnapPoint.x
        draggedY.value = mappedSnapPoint.y
      }
    }
  }

  // Make sure the element keeps the correct position when the container is resized
  // To achieve this, we update the snapPointsMap after the element has snapped
  useResizeObserver(wrapperRef, async () => {
    useThrottleFn(async () => {
      await getSizes()

      if (activeSnapPoint.value) {
        await snapTo({ snapPoint: activeSnapPoint.value, interpolate: false })
        snapPointsMap.trigger()
      }
    }, 100)()
  })

  // Make sure the element keeps the correct position when its size changes
  // To achieve this, we update the snapPointsMap after the element has snapped
  useResizeObserver(elRef, async () => {
    useThrottleFn(async () => {
      await getSizes()

      if (activeSnapPoint.value) {
        await snapTo({ snapPoint: activeSnapPoint.value, interpolate: false })
        snapPointsMap.trigger()
      }
    }, 100)()
  })

  // If the user pauses while dragging, reset thresholds and last dragged position
  // This ensures that the element either snaps back or snaps to a snap point in a new right direction
  const { idle } = useIdle(toValue(threshold).idle)

  watch(idle, (value) => {
    if (value && dragging.value) {
      onIdle()
    }
  })

  return {
    initialize,
    onPointerdown,
    onClick,
    style,
    hasDragged,
  }
}
