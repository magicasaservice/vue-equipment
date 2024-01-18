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
import { useEventListener, unrefElement } from '@vueuse/core'
import { interpolate } from '@maas/vue-equipment/utils'
import { useDrawerEmitter } from '../useDrawerEmitter'
import { useDrawerSnap } from './useDrawerSnap'
import { type DefaultOptions } from '../../utils/defaultOptions'
import { type DrawerEvents } from '../../types'

type UseDrawerDragArgs = {
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

  const elRect = ref<DOMRect | undefined>(undefined)
  const wrapperRect = ref<DOMRect | undefined>(undefined)

  const { findClosestSnapPoint, mapSnapPoint, drawerHeight, drawerWidth } =
    useDrawerSnap({
      wrapperRect,
      snapPoints,
      canClose,
      position,
      overshoot,
    })

  // Private state
  const dragStart = ref<Date | undefined>(undefined)
  const dragging = ref(false)
  const shouldClose = ref(false)
  const interpolateTo = ref<number | undefined>(undefined)

  let cancelPointerup: (() => void) | undefined = undefined
  let cancelPointermove: (() => void) | undefined = undefined

  const originX = ref(0)
  const originY = ref(0)
  const snappedY = ref(0)
  const snappedX = ref(0)
  const directionY = ref<'below' | 'above' | 'absolute'>('absolute')
  const directionX = ref<'below' | 'above' | 'absolute'>('absolute')

  const hasSnapPoints = computed(() => toValue(snapPoints).length > 1)

  // Public state
  const draggedX = ref(0)
  const draggedY = ref(0)

  const style = computed(
    () => `transform: translate(${draggedX.value}px, ${draggedY.value}px)`
  )

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

  async function setInitial() {
    await nextTick()

    switch (position) {
      case 'top':
      case 'bottom':
        const mappedSnapPointY = mapSnapPoint(toValue(snapPoint))
        console.log('toValue(snapPoint):', toValue(snapPoint))
        console.log('mappedSnapPointY:', mappedSnapPointY)
        if (!mappedSnapPointY) return

        draggedY.value =
          (await findClosestSnapPoint({
            draggedX,
            draggedY: mappedSnapPointY,
          })) || 0
        break

      case 'left':
      case 'right':
        const mappedSnapPointX = mapSnapPoint(toValue(snapPoint))
        if (!mappedSnapPointX) return

        draggedX.value =
          (await findClosestSnapPoint({
            draggedX: mappedSnapPointX,
            draggedY,
          })) || 0
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
  }

  function emitterCallback(
    event: keyof DrawerEvents,
    _payload: DrawerEvents[keyof DrawerEvents]
  ) {
    if (event === 'afterLeave') {
      resetDragged()
      resetSnapped()
    }
  }

  async function interpolateDragged(target: number) {
    switch (position) {
      case 'bottom':
      case 'top':
        // Save value the drawer will snap to
        // Used later, to check if we should close
        snappedY.value = target

        interpolate({
          from: draggedY.value,
          to: target,
          duration: 300,
          callback: (value: number) => {
            draggedY.value = value
          },
        })
        break
      case 'right':
      case 'left':
        // Save value the drawer will snap to
        // Used later, to check if we should close
        snappedX.value = target

        interpolate({
          from: draggedX.value,
          to: target,
          duration: 300,
          callback: (value: number) => {
            draggedX.value = value
          },
        })
        break
    }
  }

  function onPointerup(e: PointerEvent) {
    if (shouldClose.value) {
      close()
    } else if (interpolateTo.value || interpolateTo.value === 0) {
      interpolateDragged(interpolateTo.value)
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
    () => [unrefElement(elRef), unrefElement(wrapperRef)],
    async () => {
      await getSizes()
      setInitial()
    }
  )

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
