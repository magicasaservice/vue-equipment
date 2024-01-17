import { ref, computed, toValue, nextTick, type MaybeRef } from 'vue'
import { unrefElement } from '@vueuse/core'
import { mapValue } from '@maas/vue-equipment/utils'

import { type DefaultOptions } from '../../utils/defaultOptions'
import { type SnapPoint } from '../../types'
type UseDrawerSnapArgs = {
  snapPoints: MaybeRef<DefaultOptions['snapPoints']>
  position: MaybeRef<DefaultOptions['position']>
  wrapperRef: MaybeRef<HTMLDivElement | undefined>
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

export function useDrawerSnap(args: UseDrawerSnapArgs) {
  const { snapPoints, position, wrapperRef, overshoot } = args

  // Private state
  const wrapperRect = ref<DOMRect | undefined>(undefined)

  const mappedSnapPoints = computed(() => {
    // Add 0 to the snap points, so that the drawer can be closed
    const mapped = [...toValue(snapPoints), 0]
    return mapped
      .map((snapPoint) => {
        return mapSnapPoint(snapPoint)
      })
      .sort((a, b) => a - b)
  })

  // Public state
  const drawerHeight = computed(
    () => wrapperRect.value?.height! - toValue(overshoot)
  )

  const drawerWidth = computed(
    () => wrapperRect.value?.width! - toValue(overshoot)
  )

  // Private functions
  async function getSizes() {
    wrapperRect.value = unrefElement(wrapperRef)?.getBoundingClientRect()
    await nextTick()
  }

  function findClosestNumber(args: FindClosestNumberArgs) {
    const { number, numbers, direction } = args
    const filteredArr =
      direction === 'above'
        ? numbers.filter((num) => num > number)
        : direction === 'below'
        ? numbers.filter((num) => num < number)
        : numbers

    if (filteredArr.length === 0) {
      return undefined
    }

    const closestNumber = filteredArr.reduce((closest, current) =>
      Math.abs(current - number) < Math.abs(closest - number)
        ? current
        : closest
    )

    return closestNumber
  }

  // Public functions
  function mapSnapPoint(snapPoint: SnapPoint) {
    if (typeof snapPoint === 'number') {
      // Reverse snap point percentages,
      // so that 0% is the top of the drawer
      const reversedSnapPoint = mapValue(snapPoint, 0, 1, 1, 0)

      // Any value between 0 and 1 gets mapped to the viewport
      // 0 and 1 get mapped to the wrapperRect
      const vh = window.innerHeight
      const vw = window.innerWidth

      switch (position) {
        case 'bottom':
          if (reversedSnapPoint === 1) return drawerHeight.value
          else if (reversedSnapPoint === 0) return 0
          else return vh * reversedSnapPoint - wrapperRect.value?.top!

        case 'top':
          if (reversedSnapPoint === 1) return drawerHeight.value * -1
          else if (reversedSnapPoint === 0) return 0
          else return vh * reversedSnapPoint - wrapperRect.value?.bottom!

        case 'right':
          if (reversedSnapPoint === 1) return drawerWidth.value
          else if (reversedSnapPoint === 0) return 0
          else return vw * reversedSnapPoint - wrapperRect.value?.left!

        case 'left':
          if (reversedSnapPoint === 1) return drawerWidth.value * -1
          else if (reversedSnapPoint === 0) return 0
          else return vw * reversedSnapPoint - wrapperRect.value?.right!
        default:
          return 0
      }
    } else {
      // Reverse snap point pixels,
      // according to the position of the drawer
      const parsedSnapPoint = parseFloat(snapPoint)
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

  async function findClosestSnapPoint(args: FindClosestSnapPointArgs) {
    const { draggedY, draggedX, direction = 'absolute' } = args

    await getSizes()

    let closest: number | undefined = 0

    switch (position) {
      case 'bottom':
      case 'top':
        closest = findClosestNumber({
          number: toValue(draggedY),
          numbers: mappedSnapPoints.value,
          direction: direction,
        })
        break
      case 'right':
      case 'left':
        closest = findClosestNumber({
          number: toValue(draggedX),
          numbers: mappedSnapPoints.value,
          direction: direction,
        })
        break
    }

    console.log(mappedSnapPoints.value)
    console.log('direction:', direction)
    console.log('draggedY:', toValue(draggedY))
    console.log('closest:', closest)

    return closest
  }

  return { findClosestSnapPoint, mapSnapPoint, drawerHeight, drawerWidth }
}
