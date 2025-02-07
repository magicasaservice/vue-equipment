import { ref, computed, toValue, nextTick, type MaybeRef, type Ref } from 'vue'
import { computedWithControl } from '@vueuse/core'
import { mapValue, interpolate } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

import type { DrawerSnapPoint, DrawerDefaultOptions } from '../../types'

type UseDrawerSnapArgs = {
  id: MaybeRef<string>
  wrapperRect: Ref<DOMRect | undefined>
  draggedY: Ref<number>
  draggedX: Ref<number>
  position: MaybeRef<DrawerDefaultOptions['position']>
  animation: MaybeRef<DrawerDefaultOptions['animation']>
  snapPoints: MaybeRef<DrawerDefaultOptions['snapPoints']>
  preventDragClose: MaybeRef<DrawerDefaultOptions['preventDragClose']>
  overshoot: MaybeRef<number>
}

type FindClosestSnapPointArgs = {
  draggedY: MaybeRef<number>
  draggedX: MaybeRef<number>
  direction?: 'below' | 'above' | 'absolute'
}

type FindClosestNumberArgs = {
  number: number
  numbers: number[]
  direction: 'below' | 'above' | 'absolute'
}

type SnapToArgs = {
  snapPoint: DrawerSnapPoint
  interpolate: boolean
  duration?: number
}

type InterpolateDraggedArgs = {
  to: number
  duration?: number
  easing?: (t: number) => number
}

export function useDrawerSnap(args: UseDrawerSnapArgs) {
  const {
    id,
    snapPoints,
    animation,
    position,
    wrapperRect,
    overshoot,
    draggedY,
    draggedX,
    preventDragClose,
  } = args

  // Private state
  const mappedSnapPoints = computedWithControl(
    () => toValue(wrapperRect),
    () => {
      // Add 0 to the snap points, if preventDragClose is false
      const extended = toValue(preventDragClose)
        ? toValue(snapPoints)
        : [...toValue(snapPoints), 0]

      // Map snap points
      const mapped = extended.map((snapPoint) => {
        return mapSnapPoint(snapPoint)
      })

      // Filter out undefined values
      // Keep 0 as a valid snap point
      const filtered: number[] = mapped
        .filter(
          (snapPoint): snapPoint is number => !!snapPoint || snapPoint === 0
        )
        .sort((a, b) => a - b)

      return filtered
    }
  )

  const snapPointsMap = computedWithControl(
    () => toValue(snapPoints),
    () => {
      // Add 0 to the snap points, if preventDragClose is false
      const extended = toValue(preventDragClose)
        ? toValue(snapPoints)
        : [...toValue(snapPoints), 0]

      const mapped = extended.reduce(
        (acc, current) => {
          const key = mapSnapPoint(current)
          if (key || key === 0) {
            acc[key] = current
          }
          return acc
        },
        {} as Record<number, DrawerSnapPoint>
      )

      return mapped
    }
  )

  // Public state
  const snappedY = ref(0)
  const snappedX = ref(0)
  const activeSnapPoint = ref<DrawerSnapPoint | undefined>(undefined)

  const drawerHeight = computed(() => {
    const rect = toValue(wrapperRect)
    if (rect === undefined) {
      return 0
    }
    return rect.height - toValue(overshoot)
  })

  const drawerWidth = computed(() => {
    const rect = toValue(wrapperRect)
    if (rect === undefined) {
      return 0
    }
    return rect.width - toValue(overshoot)
  })

  // Private functions
  const emitter = useMagicEmitter()

  function findClosestNumber(args: FindClosestNumberArgs) {
    const { number, numbers, direction } = args
    let filtered = numbers

    if (!numbers.length) {
      return undefined
    }

    switch (direction) {
      case 'above':
        filtered = numbers.filter((num) => num > number)
        break
      case 'below':
        filtered = numbers.filter((num) => num < number)
        break
    }

    if (filtered.length === 0) {
      switch (direction) {
        case 'above':
          return Math.max(...numbers)
        case 'below':
          return Math.min(...numbers)
        default:
          return undefined
      }
    }

    const closestNumber = filtered.reduce((closest, current) =>
      Math.abs(current - number) < Math.abs(closest - number)
        ? current
        : closest
    )

    return closestNumber
  }

  function mapSnapPoint(snapPoint: DrawerSnapPoint) {
    if (typeof snapPoint === 'number') {
      // Reverse snap point percentages,
      // so that 0% is the top of the drawer
      const reversedSnapPoint = mapValue(snapPoint, 0, 1, 1, 0)
      const vh = window.innerHeight
      const vw = window.innerWidth

      // Save guard against NaN
      if (toValue(wrapperRect) === undefined) {
        return undefined
      }

      // Any value between 0 and 1 gets mapped to the viewport
      // 0 and 1 get mapped to the wrapperRect
      switch (position) {
        case 'bottom': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) return drawerHeight.value
          if (reversedSnapPoint === 0) return 0
          if (!rect) return 0
          return vh * reversedSnapPoint - rect.top
        }

        case 'top': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) return drawerHeight.value * -1
          if (reversedSnapPoint === 0) return 0
          if (!rect) return 0
          return vh * reversedSnapPoint - rect.bottom
        }

        case 'right': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) return drawerWidth.value
          if (reversedSnapPoint === 0) return 0
          if (!rect) return 0
          return vw * reversedSnapPoint - rect.left
        }

        case 'left': {
          const rect = toValue(wrapperRect)
          if (reversedSnapPoint === 1) return drawerWidth.value * -1
          if (reversedSnapPoint === 0) return 0
          if (!rect) return 0
          return vw * reversedSnapPoint - rect.right
        }

        default:
          return 0
      }
    } else {
      // Convert snap point to number
      const parsedSnapPoint = parseFloat(snapPoint)

      // Save guard against NaN
      if (!drawerHeight.value || !drawerWidth.value) {
        return undefined
      }

      // Calculate snap point
      // related to dimensions and position
      switch (position) {
        case 'bottom':
          return drawerHeight.value - parsedSnapPoint
        case 'top':
          return (drawerHeight.value - parsedSnapPoint) * -1
        case 'right':
          return drawerWidth.value - parsedSnapPoint
        case 'left':
          return (drawerWidth.value - parsedSnapPoint) * -1
        default:
          return parseFloat(snapPoint)
      }
    }
  }

  // Public functions
  async function snapTo(args: SnapToArgs) {
    const { snapPoint, interpolate, duration } = args
    await nextTick()

    switch (position) {
      case 'top':
      case 'bottom': {
        const mappedSnapPointY = mapSnapPoint(snapPoint)
        if (!mappedSnapPointY && mappedSnapPointY !== 0) return

        const closestY =
          findClosestSnapPoint({
            draggedX,
            draggedY: mappedSnapPointY,
          }) || 0

        if (interpolate) {
          interpolateDragged({ to: closestY, duration })
        } else {
          draggedY.value = closestY
        }

        // Save value the drawer will snap to, to check if we should close,
        // as well as for window resize events
        snappedY.value = closestY
        activeSnapPoint.value = toValue(snapPoint)

        break
      }

      case 'left':
      case 'right': {
        const mappedSnapPointX = mapSnapPoint(toValue(snapPoint))
        if (!mappedSnapPointX && mappedSnapPointX !== 0) return

        const closestX =
          findClosestSnapPoint({
            draggedX: mappedSnapPointX,
            draggedY,
          }) || 0

        if (interpolate) {
          interpolateDragged({ to: closestX, duration })
        } else {
          draggedX.value = closestX
          snappedX.value = closestX
        }

        // Save value the drawer will snap to, to check if we should close,
        // as well as for window resize events
        snappedX.value = closestX
        activeSnapPoint.value = toValue(snapPoint)
        break
      }
    }
  }

  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      to,
      duration = toValue(animation)?.snap?.duration || 300,
      easing,
    } = args
    // Find original snap point from map
    const snapPoint = snapPointsMap.value[to]
    emitter.emit('beforeSnap', { id: toValue(id), snapPoint })

    switch (position) {
      case 'bottom':
      case 'top':
        interpolate({
          from: draggedY.value,
          to,
          duration,
          easing,
          callback: (value: number) => {
            draggedY.value = value
            if (draggedY.value === to) {
              emitter.emit('afterSnap', {
                id: toValue(id),
                snapPoint,
              })
            }
          },
        })

        break
      case 'right':
      case 'left':
        interpolate({
          from: draggedX.value,
          to,
          duration,
          easing,
          callback: (value: number) => {
            draggedX.value = value
            if (draggedX.value === to) {
              emitter.emit('afterSnap', {
                id: toValue(id),
                snapPoint,
              })
            }
          },
        })

        break
    }
  }

  function findClosestSnapPoint(args: FindClosestSnapPointArgs) {
    const { draggedY, draggedX, direction = 'absolute' } = args

    let closest: number | undefined = undefined

    switch (position) {
      case 'bottom':
      case 'top':
        if (!!toValue(draggedY) || toValue(draggedY) === 0) {
          closest = findClosestNumber({
            number: toValue(draggedY),
            numbers: mappedSnapPoints.value,
            direction: direction,
          })
        }
        break
      case 'right':
      case 'left':
        if (!!toValue(draggedX) || toValue(draggedX) === 0) {
          closest = findClosestNumber({
            number: toValue(draggedX),
            numbers: mappedSnapPoints.value,
            direction: direction,
          })
        }
        break
    }

    return closest
  }

  return {
    snappedY,
    snappedX,
    activeSnapPoint,
    snapTo,
    findClosestSnapPoint,
    interpolateDragged,
    snapPointsMap,
    drawerHeight,
    drawerWidth,
  }
}
