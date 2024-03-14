import {
  ref,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
  toValue,
  nextTick,
  type Ref,
  type MaybeRef,
  type WritableComputedRef,
} from 'vue'
import {
  useEventListener,
  unrefElement,
  useResizeObserver,
  useThrottleFn,
  useScrollLock,
} from '@vueuse/core'
import { useDrawerEmitter } from '../useDrawerEmitter'
import { useDrawerSnap } from './useDrawerSnap'
import { useDrawerGuards } from './useDrawerGuards'
import { isIOS } from '@maas/vue-equipment/utils'

import { type DefaultOptions } from '../../utils/defaultOptions'
import type { DrawerEvents } from '../../types'

type UseDrawerDragArgs = {
  id: MaybeRef<string>
  isActive: MaybeRef<boolean>
  elRef: Ref<HTMLElement | undefined>
  wrapperRef: Ref<HTMLDivElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
  threshold: MaybeRef<DefaultOptions['threshold']>
  snap: MaybeRef<DefaultOptions['snap']>
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
    position,
    overshoot,
    threshold,
    snap,
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
  let cancelTouchend: (() => void) | undefined = undefined
  let scrollLock: WritableComputedRef<boolean> | undefined = undefined

  const originX = ref(0)
  const originY = ref(0)
  const pointerdownX = ref(0)
  const pointerdownY = ref(0)
  const lastDraggedX = ref(0)
  const lastDraggedY = ref(0)

  // Used to determine closest snap point
  const relDirectionY = ref<'below' | 'above' | 'absolute'>('absolute')
  const relDirectionX = ref<'below' | 'above' | 'absolute'>('absolute')

  // Used to determine scroll lock
  const absDirectionY = ref<'with' | 'against' | undefined>(undefined)
  const absDirectionX = ref<'with' | 'against' | undefined>(undefined)

  const elRect = ref<DOMRect | undefined>(undefined)
  const wrapperRect = ref<DOMRect | undefined>(undefined)

  const duration = computed(() => toValue(snap)?.duration)

  // Public state
  const draggedX = ref(0)
  const draggedY = ref(0)

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
    snap,
    canClose,
    position,
    overshoot,
    draggedY,
    draggedX,
  })

  const { canDrag, canInterpolate, lockScroll } = useDrawerGuards({
    elRef,
    absDirectionX,
    absDirectionY,
    position,
    activeSnapPoint,
  })

  // Private functions
  interface isWithinRangeArgs {
    input: number
    base: number
    threshold: number
  }

  function isWithinRange(args: isWithinRangeArgs): boolean {
    const { input, base, threshold } = args
    return input >= base - threshold && input <= base + threshold
  }

  async function getSizes() {
    elRect.value = unrefElement(elRef)?.getBoundingClientRect()
    wrapperRect.value = unrefElement(wrapperRef)?.getBoundingClientRect()
    await nextTick()
  }

  async function checkPosition({ x, y }: { x: number; y: number }) {
    const distanceY = Math.abs(y - pointerdownY.value)
    const distanceX = Math.abs(x - pointerdownX.value)

    switch (position) {
      case 'bottom':
      case 'top':
        if (distanceY > toValue(threshold).distance) {
          const snapPointY = await findClosestSnapPoint({
            draggedX: 0,
            draggedY,
            direction: relDirectionY.value,
          })

          // Close if last snap point is reached
          if (snapPointY === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointY
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
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointX
          }
        }
        break
    }
  }

  async function checkMomentum({ x, y }: { x: number; y: number }) {
    const elapsed = Date.now() - dragStart.value!.getTime()

    const distanceX = Math.abs(x - pointerdownX.value)
    const distanceY = Math.abs(y - pointerdownY.value)

    const velocityX = elapsed && distanceX ? distanceX / elapsed : 0
    const velocityY = elapsed && distanceY ? distanceY / elapsed : 0

    switch (position) {
      case 'bottom':
      case 'top':
        if (velocityY > toValue(threshold).momentum) {
          const snapPointB = await findClosestSnapPoint({
            draggedX: 0,
            draggedY,
            direction: relDirectionY.value,
          })
          // Close if last snap point is reached
          if (snapPointB === drawerHeight.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointB
          }
        }
        break

      case 'right':
      case 'left':
        if (velocityX > toValue(threshold).momentum) {
          const snapPointR = await findClosestSnapPoint({
            draggedX,
            draggedY,
            direction: relDirectionX.value,
          })

          // Close if last snap point is reached
          if (snapPointR === drawerWidth.value) {
            shouldClose.value = true
          } else {
            // Snap to next snap point
            interpolateTo.value = snapPointR
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
      // Prevent overdragging, when overshoot is 0
      if (value < to) return to
      else return value
    }
  }

  function setDragged({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom':
        const newDraggedB = clamp(y - originY.value, 0, toValue(overshoot) * -1)
        relDirectionY.value = newDraggedB < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedB
        break

      case 'top':
        const newDraggedT = clamp(y - originY.value, 0, toValue(overshoot))
        relDirectionY.value = newDraggedT < draggedY.value ? 'below' : 'above'
        draggedY.value = newDraggedT
        break

      case 'right':
        const newDraggedR = clamp(x - originX.value, 0, toValue(overshoot) * -1)
        relDirectionX.value = newDraggedR < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedR
        break

      case 'left':
        const newDraggedL = clamp(x - originX.value, 0, toValue(overshoot))
        relDirectionX.value = newDraggedL < draggedX.value ? 'below' : 'above'
        draggedX.value = newDraggedL
        break
    }
  }

  function checkDirection({ x, y }: { x: number; y: number }) {
    switch (position) {
      case 'bottom':
        absDirectionY.value =
          y < originY.value ? 'with' : y > originY.value ? 'against' : undefined
        break

      case 'top':
        absDirectionY.value =
          y > originY.value ? 'with' : y < originY.value ? 'against' : undefined
        break

      case 'right':
        absDirectionX.value =
          x < originX.value ? 'with' : x > originX.value ? 'against' : undefined
        break

      case 'left':
        absDirectionX.value =
          x > originX.value ? 'with' : x < originX.value ? 'against' : undefined
        break
    }
  }

  function resetStateAndListeners() {
    dragging.value = false
    shouldClose.value = false
    interpolateTo.value = undefined
    cancelTouchend?.()
    cancelPointerup?.()
    cancelPointermove?.()
  }

  function resetScrollLock() {
    if (scrollLock?.value) {
      scrollLock.value = false
    }

    scrollLock = undefined
  }

  function resetDragged() {
    draggedX.value = 0
    draggedY.value = 0
    lastDraggedX.value = 0
    lastDraggedY.value = 0
  }

  function resetSnapped() {
    snappedX.value = 0
    snappedY.value = 0
    activeSnapPoint.value = undefined
  }

  function afterLeaveCallback(payload: DrawerEvents['afterLeave']) {
    if (payload === toValue(id)) {
      resetDragged()
      resetSnapped()
    }
  }

  function snapToCallback(payload: DrawerEvents['snapTo']) {
    if (payload.id === toValue(id)) {
      if (!toValue(isActive)) {
        console.warn('Cannot snap to point when drawer is not open')
        return
      } else {
        snapTo({
          snapPoint: payload.snapPoint,
          interpolate: true,
          duration: payload.duration || duration.value,
        })
      }
    }
  }

  function onPointerup(e: PointerEvent) {
    const eventTarget = e.target as HTMLElement

    // TODO: We should probably blacklist more tags or give the option to customize.
    // Maybe also give the option to blacklist by class or id
    const tagNameBlacklist = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A']

    if (shouldClose.value) {
      close()
    } else if (interpolateTo.value || interpolateTo.value === 0) {
      // If scroll is not locked, interpolate to snap point
      // Scroll should only be locked at one end!
      if ((scrollLock && scrollLock.value) || canInterpolate(e.target!)) {
        interpolateDragged({
          to: interpolateTo.value,
          duration: duration.value,
        })
      }

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
    } else if (!tagNameBlacklist.includes(eventTarget.tagName)) {
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

    useDrawerEmitter().emit('afterDrag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })

    // Reset state
    resetStateAndListeners()
    resetScrollLock()

    if (hasDragged.value) {
      e.preventDefault()
    }
  }

  function onPointermove(e: PointerEvent) {
    // Reset shouldClose before checking
    shouldClose.value = false

    // Save pointermove direction
    checkDirection({ x: e.screenX, y: e.screenY })

    // Possibly lock scroll
    if (!scrollLock) {
      const target = lockScroll(e.target!)
      if (target) {
        scrollLock = useScrollLock(target)
        scrollLock.value = true
      }
    }

    // Check if we should be dragging
    if (!canDrag(e.target!)) {
      return
    }

    //Check if we should close or snap based on momentum
    checkMomentum({ x: e.screenX, y: e.screenY })

    // Save dragged value
    setDragged({ x: e.screenX, y: e.screenY })

    // Check if we should close based on distance
    checkPosition({ x: e.screenX, y: e.screenY })

    useDrawerEmitter().emit('drag', {
      id: toValue(id),
      x: draggedX.value,
      y: draggedY.value,
    })
  }

  // Public functions
  function onPointerdown(e: PointerEvent) {
    // Prevent dragging if we're already dragging
    if (dragging.value) {
      return
    } else {
      dragging.value = true

      useDrawerEmitter().emit('beforeDrag', {
        id: toValue(id),
        x: draggedX.value,
        y: draggedY.value,
      })
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

    // Save pointerdown position, used later to check if threshold for dragging is reached
    pointerdownY.value = e.screenY
    pointerdownX.value = e.screenX

    // Save start time
    dragStart.value = new Date()

    // Set initial transform
    onPointermove(e)
  }

  async function onClick(e: MouseEvent) {
    if (hasDragged.value) {
      e.preventDefault()
    }
  }

  // Lifecycle hooks and listeners
  onMounted(async () => {
    await getSizes()
    useDrawerEmitter().on('snapTo', snapToCallback)
    useDrawerEmitter().on('afterLeave', afterLeaveCallback)
  })

  watch(
    () => [unrefElement(elRef), unrefElement(wrapperRef)],
    async () => {
      await getSizes()
      const snapPoint = toValue(snap)?.initial
      snapTo({ snapPoint, interpolate: false })
    }
  )

  watch([snappedX, snappedY], ([x, y]) => {
    lastDraggedX.value = x
    lastDraggedY.value = y
  })

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
    useDrawerEmitter().off('snapTo', snapToCallback)
    useDrawerEmitter().off('afterLeave', afterLeaveCallback)
  })

  return {
    style,
    draggedX,
    draggedY,
    dragging,
    hasDragged,
    onPointerdown,
    onClick,
  }
}
