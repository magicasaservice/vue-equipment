import { ref, toValue, nextTick, type MaybeRef, type Ref } from 'vue'
import { computedWithControl } from '@vueuse/core'
import { interpolate } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { defu } from 'defu'

import type {
  DraggableSnapPoint,
  Coordinates,
  DraggableDefaultOptions,
} from '../../types'

type UseDraggableSnapArgs = {
  id: MaybeRef<string>
  elRect: Ref<DOMRect | undefined>
  wrapperRect: Ref<DOMRect | undefined>
  draggedX: Ref<number>
  draggedY: Ref<number>
  lastDraggedX: Ref<number>
  lastDraggedY: Ref<number>
  animation: MaybeRef<DraggableDefaultOptions['animation']>
  snapPoints: MaybeRef<DraggableDefaultOptions['snapPoints']>
}

type InterpolateDraggedArgs = {
  x: number
  y: number
  duration?: number
  easing?: (t: number) => number
}

type SnapToArgs = {
  snapPoint: DraggableSnapPoint
  interpolate?: boolean
  duration?: number
}

export function useDraggableSnap(args: UseDraggableSnapArgs) {
  // Private state
  const {
    id,
    draggedX,
    draggedY,
    lastDraggedX,
    lastDraggedY,
    elRect,
    wrapperRect,
    animation,
    snapPoints,
  } = args

  const interpolationIdX = ref<number | undefined>(undefined)
  const interpolationIdY = ref<number | undefined>(undefined)

  // Public state
  const activeSnapPoint = ref<DraggableSnapPoint | undefined>(undefined)

  const mappedSnapPoints = computedWithControl(
    () => toValue(wrapperRect),
    () => {
      // Map snap points
      const mapped = toValue(snapPoints)
        .map((snapPoint) => {
          return mapSnapPoint(snapPoint)
        })
        .filter((snapPoint) => snapPoint !== undefined) as Coordinates[]

      return mapped
    }
  )

  const snapPointsMap = computedWithControl(
    () => toValue(snapPoints),
    () => {
      const mapped = toValue(snapPoints).reduce((acc, current) => {
        const key = mapSnapPoint(current)
        if (key) {
          const mappedKey = `x${key.x}y${key.y}`
          acc[mappedKey] = current
        }
        return acc
      }, {} as Record<string, DraggableSnapPoint>)

      return mapped
    }
  )
  // Private functions
  const emitter = useMagicEmitter()

  function mapSnapPoint(
    snapPoint: DraggableSnapPoint
  ): Coordinates | undefined {
    if (!wrapperRect.value) {
      console.warn('Wrapper rect is not defined')
      return undefined
    }

    if (!elRect.value) {
      console.warn('Element rect is not defined')
      return undefined
    }

    const mappedSnapPoint =
      typeof snapPoint === 'string' ? [snapPoint] : snapPoint

    const [position, offset] = mappedSnapPoint

    const mappedOffset = defu(offset, { x: 0, y: 0 })

    switch (position) {
      case 'top-left':
        return {
          x: mappedOffset.x,
          y: mappedOffset.y,
        }
      case 'top':
        return {
          x:
            wrapperRect.value.width / 2 +
            mappedOffset.x -
            elRect.value.width / 2,
          y: mappedOffset.y,
        }
      case 'top-right':
        return {
          x: wrapperRect.value.width - mappedOffset.x - elRect.value.width,
          y: mappedOffset.y,
        }
      case 'left':
        return {
          x: mappedOffset.x,
          y:
            wrapperRect.value.height / 2 +
            mappedOffset.y -
            elRect.value.height / 2,
        }
      case 'center':
        return {
          x:
            wrapperRect.value.width / 2 -
            elRect.value.width / 2 +
            mappedOffset.x,
          y:
            wrapperRect.value.height / 2 -
            elRect.value.height / 2 +
            mappedOffset.y,
        }
      case 'right':
        return {
          x: wrapperRect.value.width - mappedOffset.x - elRect.value.width,
          y:
            wrapperRect.value.height / 2 +
            mappedOffset.y -
            elRect.value.height / 2,
        }
      case 'bottom-left':
        return {
          x: mappedOffset.x,
          y: wrapperRect.value.height + mappedOffset.y - elRect.value.height,
        }
      case 'bottom':
        return {
          x:
            wrapperRect.value.width / 2 +
            mappedOffset.x -
            elRect.value.width / 2,
          y: wrapperRect.value.height - mappedOffset.y - elRect.value.height,
        }
      case 'bottom-right':
        return {
          x: wrapperRect.value.width - mappedOffset.x - elRect.value.width,
          y: wrapperRect.value.height - mappedOffset.y - elRect.value.height,
        }
    }
  }

  function cancelInterpolation() {
    if (interpolationIdY.value) {
      cancelAnimationFrame(interpolationIdY.value)
    }

    if (interpolationIdX.value) {
      cancelAnimationFrame(interpolationIdX.value)
    }
  }

  // Public functions
  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      x,
      y,
      duration = toValue(animation)?.snap?.duration || 300,
      easing = toValue(animation).snap?.easing,
    } = args
    const snapPoint = snapPointsMap.value[`x${x}y${y}`]
    emitter.emit('beforeSnap', { id: toValue(id), snapPoint })

    // Cancel any running interpolations
    cancelInterpolation()

    interpolationIdY.value = interpolate({
      from: draggedY.value,
      to: y,
      duration,
      easing,
      callback(value: number) {
        draggedY.value = value
        if (y > x && draggedY.value === y) {
          emitter.emit('afterSnap', { id: toValue(id), snapPoint })
        }

        // Update lastDragged to reset hasDragged
        if (draggedY.value === y) {
          lastDraggedX.value = draggedX.value
          lastDraggedY.value = draggedY.value
        }
      },
      interpolationIdCallback(id) {
        interpolationIdY.value = id
      },
    })

    interpolationIdX.value = interpolate({
      from: draggedX.value,
      to: x,
      duration,
      easing,
      callback: (value: number) => {
        draggedX.value = value
        if (x >= y && draggedX.value === x) {
          emitter.emit('afterSnap', { id: toValue(id), snapPoint })
        }

        // Update lastDragged to reset hasDragged
        if (draggedX.value === x) {
          lastDraggedX.value = draggedX.value
          lastDraggedY.value = draggedY.value
        }
      },
      interpolationIdCallback(id) {
        interpolationIdX.value = id
      },
    })
  }

  async function snapTo(args: SnapToArgs) {
    const { snapPoint, interpolate, duration } = args
    await nextTick()

    const mappedSnapPoint = mapSnapPoint(snapPoint)

    if (mappedSnapPoint) {
      if (interpolate) {
        interpolateDragged({
          x: mappedSnapPoint.x,
          y: mappedSnapPoint.y,
          duration,
        })
      } else {
        // Cancel any running interpolations
        cancelInterpolation()

        // Snap
        draggedX.value = mappedSnapPoint.x
        draggedY.value = mappedSnapPoint.y

        // Update lastDragged to reset hasDragged
        lastDraggedX.value = draggedX.value
        lastDraggedY.value = draggedY.value
      }
    }

    // Save value for window resize events
    activeSnapPoint.value = snapPoint
  }

  return {
    mappedSnapPoints,
    activeSnapPoint,
    snapPointsMap,
    mapSnapPoint,
    interpolateDragged,
    snapTo,
  }
}
