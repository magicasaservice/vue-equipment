import {
  computed,
  toValue,
  type Ref,
  type MaybeRef,
  type WritableComputedRef,
} from 'vue'
import { useScrollLock, useEventListener } from '@vueuse/core'
import { useDrawerSnap } from './useDrawerSnap'
import { useDrawerGuards } from './useDrawerGuards'
import { useDrawerUtils } from './useDrawerUtils'
import { useDrawerState } from './useDrawerState'

import { type DefaultOptions } from '../../utils/defaultOptions'

type UseDrawerWheelArgs = {
  id: MaybeRef<string>
  isActive: MaybeRef<boolean>
  elRef: Ref<HTMLElement | undefined>
  drawerRef: Ref<HTMLElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
  threshold: MaybeRef<DefaultOptions['threshold']>
  snap: MaybeRef<DefaultOptions['snap']>
  canClose: MaybeRef<DefaultOptions['canClose']>
  overshoot: MaybeRef<number>
  close: () => void
}

export function useDrawerWheel(args: UseDrawerWheelArgs) {
  const {
    id,
    elRef,
    drawerRef,
    position,
    overshoot,
    threshold,
    snap,
    canClose,
    close,
  } = args

  // Private state
  const { findState } = useDrawerState(toValue(id))
  const {
    dragStart,
    wheeling,
    interpolateTo,
    lastDraggedX,
    lastDraggedY,
    draggedX,
    draggedY,
    relDirectionX,
    relDirectionY,
    absDirectionX,
    absDirectionY,
    wrapperRect,
  } = findState()

  let scrollLock: WritableComputedRef<boolean> | undefined = undefined
  let wheelendId: NodeJS.Timeout | undefined = undefined
  let wheelListener: (() => void) | undefined = undefined

  const duration = computed(() => toValue(snap)?.duration)

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
    snappedY,
    snappedX,
    activeSnapPoint,
    snapPointsMap,
    interpolateDragged,
    findClosestSnapPoint,
    drawerHeight,
    drawerWidth,
  } = useDrawerSnap({
    id,
    wrapperRect,
    snap,
    canClose,
    position,
    overshoot,
    draggedY,
    draggedX,
  })

  const { lockScroll } = useDrawerGuards({
    elRef,
    absDirectionX,
    absDirectionY,
    position,
    activeSnapPoint,
  })

  const { clamp, isWithinRange } = useDrawerUtils()

  // Private functions
  function setSnapped(value: number) {
    // Save the snap point we’re snapping to
    // both the input value, as well as the actual pixel value
    activeSnapPoint.value = snapPointsMap.value[value]

    switch (position) {
      case 'bottom':
      case 'top':
        snappedY.value = value
        break

      case 'right':
      case 'left':
        snappedX.value = value
        break
    }
  }

  function clearAndSnap(snapPoint: number) {
    // Cancel wheel listener, prevent wheelend call
    cancelWheelListener()
    clearTimeout(wheelendId)

    // Interpolate to snap point
    interpolateDragged({
      to: snapPoint,
      duration: duration.value,
    })

    // Save snap point
    setSnapped(snapPoint)

    // Reset state
    resetStateAndListeners()
    resetScrollLock()

    // Initialize wheel listener after interpolation
    setTimeout(() => {
      initializeWheelListener()
    }, duration.value)
  }

  async function checkPosition({ x, y }: { x: number; y: number }) {
    const distanceX = Math.abs(x - lastDraggedX.value)
    const distanceY = Math.abs(y - lastDraggedY.value)

    switch (position) {
      case 'bottom':
      case 'top':
        if (distanceY > toValue(threshold).distance) {
          const snapPointY = await findClosestSnapPoint({
            draggedX: 0,
            draggedY,
            direction: relDirectionY.value,
          })

          if (snapPointY === drawerHeight.value) {
            // Close if last snap point is reached
            close()
            resetStateAndListeners()
            resetScrollLock()
          } else if (snapPointY || snapPointY === 0) {
            clearAndSnap(snapPointY)
          }
        }

        break

      case 'right':
      case 'left':
        if (distanceX > toValue(threshold).distance) {
          const snapPointX = await findClosestSnapPoint({
            draggedX,
            draggedY: 0,
            direction: relDirectionX.value,
          })

          // Close if last snap point is reached
          if (snapPointX === drawerWidth.value) {
            close()
            resetStateAndListeners()
            resetScrollLock()
          } else if (snapPointX || snapPointX === 0) {
            clearAndSnap(snapPointX)
          }
        }

        break
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom':
        const newDraggedB = clamp(y, 0, toValue(overshoot) * -1)
        relDirectionY.value = newDraggedB < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedB
        break

      case 'top':
        const newDraggedT = clamp(y, 0, toValue(overshoot))
        relDirectionY.value = newDraggedT < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedT
        break

      case 'right':
        const newDraggedR = clamp(x, 0, toValue(overshoot) * -1)
        relDirectionX.value = newDraggedR < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedR
        break

      case 'left':
        const newDraggedL = clamp(x, 0, toValue(overshoot))
        relDirectionX.value = newDraggedL < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedL
        break
    }
  }

  function resetStateAndListeners() {
    wheeling.value = false
    interpolateTo.value = undefined
  }

  function resetScrollLock() {
    if (scrollLock?.value) {
      scrollLock.value = false
    }

    scrollLock = undefined
  }

  function onWheelend() {
    console.log('wheelend')

    if (hasDragged.value) {
      switch (position) {
        case 'bottom':
        case 'top':
          interpolateDragged({
            to: snappedY.value,
            duration: duration.value,
          })
          break

        case 'right':
        case 'left':
          interpolateDragged({
            to: snappedX.value,
            duration: duration.value,
          })
          break
      }
    }

    // Reset state
    resetStateAndListeners()
    resetScrollLock()
  }

  function onWheelstart(e: WheelEvent) {
    if (wheeling.value) {
      return
    } else {
      wheeling.value = true

      if (!scrollLock) {
        const target = lockScroll(e.target!)
        if (target) {
          scrollLock = useScrollLock(target)
          scrollLock.value = true
        }
      }
    }

    // Save last dragged position,
    // used later to check if click event should propagate
    lastDraggedX.value = draggedX.value
    lastDraggedY.value = draggedY.value

    // Save start time
    dragStart.value = new Date()
  }

  // Public functions
  function onWheel(e: WheelEvent) {
    onWheelstart(e)

    if (wheelendId) {
      clearTimeout(wheelendId)
    }

    const newX = draggedX.value - e.deltaX
    const newY = draggedY.value - e.deltaY

    // Save dragged value
    setDragged({ x: newX, y: newY })

    // Check if we should close based on distance
    checkPosition({ x: newX, y: newY })

    if (hasDragged.value) {
      e.stopPropagation()
    }

    wheelendId = setTimeout(() => onWheelend(), 50)
  }

  function initializeWheelListener() {
    wheelListener = useEventListener(drawerRef.value, 'wheel', onWheel, {
      passive: true,
    })
  }

  function cancelWheelListener() {
    if (wheelListener) {
      wheelListener()
    }
  }

  return {
    onWheel,
    initializeWheelListener,
    cancelWheelListener,
  }
}
