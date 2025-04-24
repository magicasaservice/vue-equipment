import { ref, toRefs, computed, toValue, nextTick, type MaybeRef } from 'vue'
import { computedWithControl } from '@vueuse/core'
import { interpolate } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'
import { defu } from 'defu'

import { useDraggableState } from './useDraggableState'

import type {
  DraggableSnapPoint,
  Coordinates,
  DraggableDefaultOptions,
} from '../../types'

type UseDraggableSnapArgs = {
  id: MaybeRef<string>
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
  const { id, animation, snapPoints } = args

  // Private state
  const { initializeState } = useDraggableState(toValue(id))
  const state = initializeState()

  const {
    lastDraggedX,
    lastDraggedY,
    draggedX,
    draggedY,
    elRect,
    wrapperRect,
    activeSnapPoint,
  } = toRefs(state)

  const interpolationIdX = ref<number | undefined>(undefined)
  const interpolationIdY = ref<number | undefined>(undefined)

  // Public state
  const mappedActiveSnapPoint = computed(() => {
    if (!activeSnapPoint.value) {
      return undefined
    }
    return mapSnapPoint(activeSnapPoint.value)
  })

  const mappedSnapPoints = computedWithControl(
    () => toValue(wrapperRect),
    () => {
      // Map snap points
      const mapped = toValue(snapPoints)
        .map((snapPoint) => {
          return mapSnapPoint(snapPoint)
        })
        .filter((snapPoint) => snapPoint !== undefined) as Coordinates[]

      return mapped ?? []
    }
  )

  const snapPointsMap = computedWithControl(
    () => toValue(snapPoints),
    () => {
      const mapped = toValue(snapPoints).reduce(
        (acc, current) => {
          const key = mapSnapPoint(current)
          if (key) {
            const mappedKey = `x${key.x}y${key.y}`
            acc[mappedKey] = current
          }
          return acc
        },
        {} as Record<string, DraggableSnapPoint>
      )

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

    let x = 0
    let y = 0

    switch (position) {
      case 'top-left': {
        x = mappedOffset.x
        y = mappedOffset.y
        break
      }
      case 'top': {
        x =
          wrapperRect.value.width / 2 + mappedOffset.x - elRect.value.width / 2
        y = mappedOffset.y
        break
      }
      case 'top-right': {
        x = wrapperRect.value.width - mappedOffset.x - elRect.value.width
        y = mappedOffset.y
        break
      }
      case 'left': {
        x = mappedOffset.x
        y =
          wrapperRect.value.height / 2 +
          mappedOffset.y -
          elRect.value.height / 2
        break
      }
      case 'center': {
        x =
          wrapperRect.value.width / 2 - elRect.value.width / 2 + mappedOffset.x
        y =
          wrapperRect.value.height / 2 -
          elRect.value.height / 2 +
          mappedOffset.y
        break
      }
      case 'right': {
        x = wrapperRect.value.width - mappedOffset.x - elRect.value.width
        y =
          wrapperRect.value.height / 2 +
          mappedOffset.y -
          elRect.value.height / 2
        break
      }
      case 'bottom-left': {
        x = mappedOffset.x
        y = wrapperRect.value.height + mappedOffset.y - elRect.value.height
        break
      }
      case 'bottom': {
        x =
          wrapperRect.value.width / 2 + mappedOffset.x - elRect.value.width / 2
        y = wrapperRect.value.height - mappedOffset.y - elRect.value.height
        break
      }
      case 'bottom-right': {
        x = wrapperRect.value.width - mappedOffset.x - elRect.value.width
        y = wrapperRect.value.height - mappedOffset.y - elRect.value.height
        break
      }
    }

    return { x: Math.round(x), y: Math.round(y) }
  }

  function cancelInterpolation() {
    if (interpolationIdY.value) {
      cancelAnimationFrame(interpolationIdY.value)
      interpolationIdY.value = undefined
    }

    if (interpolationIdX.value) {
      cancelAnimationFrame(interpolationIdX.value)
      interpolationIdX.value = undefined
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
          lastDraggedY.value = y
          interpolationIdY.value = undefined
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
          lastDraggedX.value = x
          interpolationIdX.value = undefined
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

    // Save value for resize events
    activeSnapPoint.value = snapPoint
  }

  return {
    mappedActiveSnapPoint,
    mappedSnapPoints,
    snapPointsMap,
    mapSnapPoint,
    interpolateDragged,
    snapTo,
  }
}
