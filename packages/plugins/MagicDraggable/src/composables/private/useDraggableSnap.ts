import { ref, toValue, nextTick, type MaybeRef, type Ref } from 'vue'
import { computedWithControl } from '@vueuse/core'
import { interpolate } from '@maas/vue-equipment/utils'
import { defu } from 'defu'

import { type DefaultOptions } from '../../utils/defaultOptions'
import type { SnapPoint, Coordinates } from '../../types'

type UseDraggableSnapArgs = {
  elRect: Ref<DOMRect | undefined>
  wrapperRect: Ref<DOMRect | undefined>
  draggedY: Ref<number>
  draggedX: Ref<number>
  animation: MaybeRef<DefaultOptions['animation']>
  snapPoints: MaybeRef<DefaultOptions['snapPoints']>
}

type InterpolateDraggedArgs = {
  x: number
  y: number
  duration?: number
  easing?: (t: number) => number
}

type SnapToArgs = {
  snapPoint: SnapPoint
  interpolate?: boolean
  duration?: number
}

export function useDraggableSnap(args: UseDraggableSnapArgs) {
  const { draggedY, draggedX, elRect, wrapperRect, animation, snapPoints } =
    args

  // Public state
  const activeSnapPoint = ref<SnapPoint | undefined>(undefined)

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
      }, {} as Record<string, SnapPoint>)

      return mapped
    }
  )
  // Private functions
  function mapSnapPoint(snapPoint: SnapPoint): Coordinates | undefined {
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
      case 'top-center':
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
      case 'center-left':
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
      case 'center-right':
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
      case 'bottom-center':
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

  // Public functions
  function interpolateDragged(args: InterpolateDraggedArgs) {
    const {
      x,
      y,
      duration = toValue(animation).snap?.duration!,
      easing = toValue(animation).snap?.easing,
    } = args

    interpolate({
      from: draggedY.value,
      to: y,
      duration,
      easing,
      callback: (value: number) => {
        draggedY.value = value
      },
    })

    interpolate({
      from: draggedX.value,
      to: x,
      duration,
      easing,
      callback: (value: number) => {
        draggedX.value = value
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
        draggedX.value = mappedSnapPoint.x
        draggedY.value = mappedSnapPoint.y
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
