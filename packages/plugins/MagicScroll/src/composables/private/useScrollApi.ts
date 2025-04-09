import {
  shallowRef,
  inject,
  toValue,
  type MaybeRef,
  type MaybeRefOrGetter,
} from 'vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import { clampValue } from '@maas/vue-equipment/utils'
import { MagicScrollReturn } from '../../symbols'

import type { ScrollIntersection } from '../../types'

type UseScrollApiArgs = {
  child: MaybeRef<HTMLElement | null | undefined>
  parent: MaybeRefOrGetter<HTMLElement | null | undefined>
  from: ScrollIntersection
  to: ScrollIntersection
}

export function useScrollApi(args: UseScrollApiArgs) {
  const { child, parent, from, to } = args

  const scrollReturn = inject(MagicScrollReturn, undefined)

  const start = shallowRef(0)
  const end = shallowRef(0)

  const { width, height } = useWindowSize()
  const windowBoundingRect = {
    width,
    height,
    right: width,
    bottom: height,
    top: shallowRef(0),
    left: shallowRef(0),
  }

  const childBoundingRect = useElementBounding(child)
  const parentBoundingRect = useElementBounding(parent)

  const mappedParentBoundingRect = toValue(parent)
    ? parentBoundingRect
    : windowBoundingRect

  function splitLocation(location: string) {
    return {
      child: location.match(/^[a-z]+/)![0],
      parent: location.match(/[a-z]+$/)![0],
    }
  }

  function getOffsetTop(points: { child: string; parent: string }) {
    let y = 0

    const scrollY = toValue(scrollReturn?.y) || 0

    const parentTop = mappedParentBoundingRect.top.value
    const parentHeight = mappedParentBoundingRect.height.value
    const childTop = childBoundingRect.top.value
    const childHeight = childBoundingRect.height.value

    if (!childHeight) {
      return y
    }

    switch (points.child) {
      case 'top':
        y += childTop + scrollY
        break
      case 'center':
        y += childTop + childHeight / 2 + scrollY
        break
      case 'bottom':
        y += childTop + childHeight + scrollY
        break
    }

    if (!mappedParentBoundingRect.height.value) {
      return y
    }

    switch (points.parent) {
      case 'top':
        y -= parentTop
        break
      case 'center':
        y -= parentTop + parentHeight / 2
        break
      case 'bottom':
        y -= parentTop + parentHeight
        break
      case 'initial':
        y -= childTop + scrollY
        break
    }

    return y
  }

  function getCalculations() {
    childBoundingRect.update()
    parentBoundingRect.update()

    start.value = getOffsetTop(splitLocation(from))
    end.value = getOffsetTop(splitLocation(to))
  }

  function getProgress() {
    const scrollY = toValue(scrollReturn?.y) ?? 0
    const total = Math.abs(end.value - start.value)
    const current = scrollY - start.value

    return clampValue(current / total, 0, 1)
  }

  return { getCalculations, getProgress }
}
