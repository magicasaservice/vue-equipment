import { ref, computed, toValue, nextTick, type MaybeRef, type Ref } from 'vue'
import { computedWithControl } from '@vueuse/core'
import { mapValue, interpolate } from '@maas/vue-equipment/utils'
import { defu } from 'defu'

import { type DefaultOptions } from '../../utils/defaultOptions'
import { type SnapPoint } from '../../types'

type UseDraggableSnapArgs = {
  // id: MaybeRef<string>
  elRect: Ref<DOMRect | undefined>
  wrapperRect: Ref<DOMRect | undefined>
  draggedY: Ref<number>
  draggedX: Ref<number>
  snap: MaybeRef<DefaultOptions['snap']>
  // overshoot: MaybeRef<number>
}

type InterpolateDraggedArgs = {
  x: number
  y: number
  duration?: number
}

export function useDraggableSnap(args: UseDraggableSnapArgs) {
  const { draggedY, draggedX, elRect, wrapperRect, snap } = args

  const mappedSnapPoints = computedWithControl(
    () => toValue(wrapperRect),
    () => {
      const snapPoints = toValue(snap)?.points

      // Map snap points
      const mapped = snapPoints.map((snapPoint) => {
        return mapSnapPoint(snapPoint)
      })

      return mapped
    }
  )

  // Private functions
  function mapSnapPoint(snapPoint: SnapPoint) {
    if (!wrapperRect.value) {
      console.warn('Wrapper rect is not defined')
      return {}
    }

    if (!elRect.value) {
      console.warn('Element rect is not defined')
      return {}
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
          x: wrapperRect.value.width / 2 + mappedOffset.x,
          y: mappedOffset.y,
        }
      case 'top-right':
        return {
          x: wrapperRect.value.width - mappedOffset.x,
          y: mappedOffset.y,
        }
      case 'center-left':
        return {
          x: mappedOffset.x,
          y: wrapperRect.value.height / 2 + mappedOffset.y,
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
          x: wrapperRect.value.width - mappedOffset.x,
          y: wrapperRect.value.height / 2 + mappedOffset.y,
        }
      case 'bottom-left':
        return {
          x: mappedOffset.x,
          y: wrapperRect.value.height + mappedOffset.y,
        }
      case 'bottom-center':
        return {
          x: wrapperRect.value.width / 2 + mappedOffset.x,
          y: wrapperRect.value.height - mappedOffset.y,
        }
      case 'bottom-right':
        return {
          x: wrapperRect.value.width - mappedOffset.x,
          y: wrapperRect.value.height - mappedOffset.y,
        }
    }
  }

  // Public functions
  function interpolateDragged(args: InterpolateDraggedArgs) {
    const { x, y, duration = 300 } = args

    interpolate({
      from: draggedY.value,
      to: y,
      duration: duration,
      callback: (value: number) => {
        draggedY.value = value
      },
    })

    interpolate({
      from: draggedX.value,
      to: x,
      duration: duration,
      callback: (value: number) => {
        draggedX.value = value
      },
    })
  }

  function snapTo(snapPoint: SnapPoint, duration?: number) {
    const { x, y } = mapSnapPoint(snapPoint)
    interpolateDragged({ x, y, duration })
  }

  return {
    mapSnapPoint,
    interpolateDragged,
    snapTo,
  }
}
