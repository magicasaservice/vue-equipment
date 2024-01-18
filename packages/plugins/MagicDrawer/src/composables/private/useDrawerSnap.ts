import { ref, computed, toValue, nextTick, type MaybeRef } from 'vue'
import { unrefElement } from '@vueuse/core'
import { mapValue } from '@maas/vue-equipment/utils'

import { type DefaultOptions } from '../../utils/defaultOptions'
import { type SnapPoint } from '../../types'
type UseDrawerSnapArgs = {
  wrapperRef: MaybeRef<HTMLDivElement | undefined>
  position: MaybeRef<DefaultOptions['position']>
  snapPoints: MaybeRef<DefaultOptions['snapPoints']>
  canClose: MaybeRef<DefaultOptions['canClose']>
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
  const { snapPoints, position, wrapperRef, overshoot, canClose } = args

  // Private state
  const wrapperRect = ref<DOMRect | undefined>(undefined)

  const mappedSnapPoints = computed(() => {
    // Add 0 to the snap points, if canClose is true
    const extended = toValue(canClose)
      ? [...toValue(snapPoints), 0]
      : toValue(snapPoints)

    // Map snap points
    const mapped = extended.map((snapPoint) => {
      return mapSnapPoint(snapPoint)
    })

    // Filter out undefined values
    const filtered: number[] = mapped
      .filter((snapPoint): snapPoint is number => !!snapPoint)
      .sort((a, b) => a - b)

    return filtered
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
    let filtered = numbers

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

  // Public functions
  function mapSnapPoint(snapPoint: SnapPoint) {
    if (typeof snapPoint === 'number') {
      // Reverse snap point percentages,
      // so that 0% is the top of the drawer
      const reversedSnapPoint = mapValue(snapPoint, 0, 1, 1, 0)
      const vh = window.innerHeight
      const vw = window.innerWidth

      // Save guard against NaN
      if (wrapperRect.value === undefined) {
        return undefined
      }

      // Any value between 0 and 1 gets mapped to the viewport
      // 0 and 1 get mapped to the wrapperRect
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
      // Convert snap point to number
      const parsedSnapPoint = parseFloat(snapPoint)

      // Save guard against NaN
      if (drawerHeight.value === undefined || drawerWidth.value === undefined) {
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
    console.log('draggedX:', toValue(draggedX))
    console.log('draggedY:', toValue(draggedY))
    console.log('closest:', closest)

    return closest
  }

  return { findClosestSnapPoint, mapSnapPoint, drawerHeight, drawerWidth }
}
