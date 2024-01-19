import {
  ref,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
  toValue,
  nextTick,
  type MaybeRef,
} from 'vue'
import {
  useEventListener,
  unrefElement,
  useResizeObserver,
  useDebounceFn,
  useThrottleFn,
} from '@vueuse/core'
import { useDrawerEmitter } from '../useDrawerEmitter'
import { useDrawerSnap } from './useDrawerSnap'
import { type DefaultOptions } from '../../utils/defaultOptions'
import { type DrawerEvents } from '../../types'

type UseDrawerDragArgs = {
  id: MaybeRef<string>
  isActive: MaybeRef<boolean>
  elRef: MaybeRef<HTMLDivElement | undefined>
  wrapperRef: MaybeRef<HTMLDivElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
  threshold: MaybeRef<DefaultOptions['threshold']>
  snapPoints: MaybeRef<DefaultOptions['snapPoints']>
  snapPoint: MaybeRef<DefaultOptions['snapPoint']>
  canClose: MaybeRef<DefaultOptions['canClose']>
  overshoot: MaybeRef<number>
  close: () => void
}

export function useDrawerDrag(args: UseDrawerDragArgs) {
  const {
    id,
    isActive,
    elRef,
    wrapperRef,
    snapPoints,
    position,
    overshoot,
    threshold,
    snapPoint,
    canClose,
    close,
  } = args

  // Private state
  const dragStart = ref<Date | undefined>(undefined)
  const dragging = ref(false)
  const shouldClose = ref(false)
  const interpolateTo = ref<number | undefined>(undefined)

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined

  const originX = ref(0)
  const originY = ref(0)
  const directionY = ref<'below' | 'above' | 'absolute'>('absolute')
  const directionX = ref<'below' | 'above' | 'absolute'>('absolute')

  const hasSnapPoints = computed(() => toValue(snapPoints).length > 1)

  const elRect = ref<DOMRect | undefined>(undefined)
  const wrapperRect = ref<DOMRect | undefined>(undefined)

  // Public state
  const draggedX = ref(0)
  const draggedY = ref(0)

  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

  // Snap logic
  const {
    snappedY,
    snappedX,
    activeSnapPoint,
    snapTo,
    snapPointsMap,
    interpolateDragged,
    findClosestSnapPoint,
    drawerHeight,
    drawerWidth,
  } = useDrawerSnap({
    id,
    wrapperRect,
    snapPoints,
    canClose,
    position,
    overshoot,
    draggedY,
    draggedX,
  })

  // Private functions
  async function getSizes() {
    elRect.value = unrefElement(elRef)?.getBoundingClientRect()
    wrapperRect.value = unrefElement(wrapperRef)?.getBoundingClientRect()
    await nextTick()
  }

  async function checkPosition() {
    switch (position) {
      case 'bottom':
        const snapPointB = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionY.value,
        })

        if (
          draggedY.value > toValue(threshold).distance ||
          hasSnapPoints.value
        ) {
          // Close if last snap point is reached
          if (snapPointB === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointB
          }
        }

        break

      case 'top':
        const snapPointT = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionY.value,
        })

        if (
          draggedY.value < toValue(threshold).distance * -1 ||
          hasSnapPoints.value
        ) {
          // Close if last snap point is reached
          if (snapPointT === drawerHeight.value * -1) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointT
          }
        }
        break

      case 'right':
        const snapPointR = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionX.value,
        })

        if (
          draggedX.value > toValue(threshold).distance ||
          hasSnapPoints.value
        ) {
          // Close if last snap point is reached
          if (snapPointR === drawerWidth.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointR
          }
        }
        break

      case 'left':
        const snapPointL = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionX.value,
        })

        if (
          draggedX.value < toValue(threshold).distance * -1 ||
          hasSnapPoints.value
        ) {
          // Close if last snap point is reached
          if (snapPointL === drawerWidth.value * -1) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointL
          }
        }
        break
    }
  }

  async function checkMomentum({ x, y }: { x: number; y: number }) {
    const elapsed = Date.now() - dragStart.value!.getTime()

    const velocityX = (x - originX.value) / elapsed
    const velocityY = (y - originY.value) / elapsed

    switch (position) {
      case 'bottom':
        const snapPointB = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionY.value,
        })

        if (velocityY > toValue(threshold).momentum) {
          // Close if last snap point is reached
          if (snapPointB === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointB
          }
        }
        break

      case 'top':
        const snapPointT = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionY.value,
        })

        if (velocityY < toValue(threshold).momentum * -1) {
          // Close if last snap point is reached
          if (snapPointT === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointT
          }
        }
        break

      case 'right':
        const snapPointR = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionX.value,
        })

        if (velocityX > toValue(threshold).momentum) {
          // Close if last snap point is reached
          if (snapPointR === drawerWidth.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointR
          }
        }
        break

      case 'left':
        const snapPointL = await findClosestSnapPoint({
          draggedX,
          draggedY,
          direction: directionX.value,
        })

        if (velocityX > toValue(threshold).momentum) {
          // Close if last snap point is reached
          if (snapPointL === drawerWidth.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointL
          }
        }

        break
    }
  }

  function clamp(value: number, from: number, to: number) {
    if (from > to) {
      if (value > from) return value
      if (value < to) return to
      else return value
    } else if (from < to) {
      if (value < from) return value
      if (value > to) return to
      else return value
    } else {
      return value
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom':
        const newDraggedB = clamp(y - originY.value, 0, toValue(overshoot) * -1)
        directionY.value = newDraggedB < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedB
        break

      case 'top':
        const newDraggedT = clamp(y - originY.value, 0, toValue(overshoot))
        directionY.value = newDraggedT < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedT
        break

      case 'right':
        const newDraggedR = clamp(x - originX.value, 0, toValue(overshoot) * -1)
        directionX.value = newDraggedR < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedR
        break

      case 'left':
        const newDraggedL = clamp(x - originX.value, 0, toValue(overshoot))
        directionX.value = newDraggedL < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedL
        break
    }
  }

  function resetStateAndListeners() {
    dragging.value = false
    shouldClose.value = false
    interpolateTo.value = undefined
    cancelPointerup?.()
    cancelPointermove?.()
  }

  function resetDragged() {
    draggedX.value = 0
    draggedY.value = 0
  }

  function resetSnapped() {
    snappedX.value = 0
    snappedY.value = 0
    activeSnapPoint.value = undefined
  }

  function emitterCallback(
    event: keyof DrawerEvents,
    payload: DrawerEvents[keyof DrawerEvents]
  ) {
    if (event === 'afterLeave' && payload === toValue(id)) {
      resetDragged()
      resetSnapped()
    }

    if (
      event === 'snapTo' &&
      typeof payload === 'object' &&
      payload.id === toValue(id)
    ) {
      if (!toValue(isActive)) {
        console.warn('Cannot snap to point when drawer is not open')
        return
      } else {
        snapTo({ snapPoint: payload.snapPoint, interpolate: true })
      }
    }
  }

  function onPointerup(e: PointerEvent) {
    if (shouldClose.value) {
      close()
    } else if (interpolateTo.value || interpolateTo.value === 0) {
      interpolateDragged(interpolateTo.value)

      // Save the snap point we’re snapping to
      // both the input value, as well as the actual pixel value
      activeSnapPoint.value = snapPointsMap.value[interpolateTo.value]

      switch (position) {
        case 'bottom':
        case 'top':
          snappedY.value = interpolateTo.value
          break

        case 'right':
        case 'left':
          snappedX.value = interpolateTo.value
          break
      }
    } else {
      switch (position) {
        case 'bottom':
        case 'top':
          interpolateDragged(snappedY.value)
          break

        case 'right':
        case 'left':
          interpolateDragged(snappedX.value)
          break
      }
    }

    // Reset state
    resetStateAndListeners()

    // Prevent accidental click events
    e.preventDefault()
  }

  function onPointermove(e: PointerEvent) {
    // Reset shouldClose before checking
    shouldClose.value = false

    //Check if we should close or snap based on momentum
    checkMomentum({ x: e.screenX, y: e.screenY })

    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    // Check if we should close based on distance
    checkPosition()

    e.preventDefault()
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Prevent dragging if we're already dragging
    if (dragging.value) {
      return
    } else {
      dragging.value = true
    }

    // Make sure maintain pointer capture so that we keep receiving events
    ;(e.target! as HTMLElement).setPointerCapture(e.pointerId)

    // Add listeners
    cancelPointerup = useEventListener(document, 'pointerup', onPointerup)
    cancelPointermove = useEventListener(document, 'pointermove', onPointermove)

    // Save origin
    originX.value = e.screenX - draggedX.value
    originY.value = e.screenY - draggedY.value

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onPointermove(e)

    e.preventDefault()
  }

  // Lifecycle hooks and listeners
  onMounted(async () => {
    await getSizes()
    useDrawerEmitter().on('*', emitterCallback)
  })

  watch(
    () => [unrefElement(wrapperRef), unrefElement(wrapperRef)],
    async () => {
      await getSizes()
      snapTo({ snapPoint, interpolate: false })
    }
  )

  // Make sure the drawer keeps the correct position when the window is resized
  // To achieve this, we update the snapPointsMap after the drawer has snapped
  useResizeObserver(elRef, async () => {
    useThrottleFn(async () => {
      await getSizes()

      if (activeSnapPoint.value) {
        await snapTo({ snapPoint: activeSnapPoint.value, interpolate: false })
        snapPointsMap.trigger()
      }
    }, 100)()
  })

  onBeforeUnmount(() => {
    useDrawerEmitter().off('*', emitterCallback)
  })

  return {
    style,
    draggedX,
    draggedY,
    dragging,
    onPointerdown,
  }
}
