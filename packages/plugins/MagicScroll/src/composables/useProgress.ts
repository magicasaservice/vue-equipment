import { ref, inject } from 'vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { ScrollPositionKey } from '../types'
import { clampValue } from '../utils'

import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/core'
import type { FromTo } from '../types'

type UseProgressParams = {
  child: MaybeRef<HTMLElement | null | undefined>
  parent: MaybeRefOrGetter<HTMLElement | null | undefined>
  from: FromTo
  to: FromTo
}

export function useProgress(params: UseProgressParams) {
  const { child, parent, from, to } = params
  const scrollPosition = inject(ScrollPositionKey, undefined)

  const childRect = ref<DOMRect>()
  const parentRect = ref<
    | DOMRect
    | {
        width: MaybeRef<number>
        height: MaybeRef<number>
        top: MaybeRef<number>
      }
  >()
  const start = ref(0)
  const end = ref(0)

  const splitLocation = (location: string) => {
    return {
      child: location.match(/^[a-z]+/)![0],
      parent: location.match(/[a-z]+$/)![0],
    }
  }

  const getOffsetTop = (points: { child: string; parent: string }) => {
    let y = 0

    if (!childRect.value) return y

    const scrollY = toValue(scrollPosition?.y) || 0

    switch (points.child) {
      case 'top':
        y += childRect.value.top + scrollY
        break
      case 'center':
        y += childRect.value.top + childRect.value.height / 2 + scrollY
        break
      case 'bottom':
        y += childRect.value.top + childRect.value.height + scrollY
        break
    }

    if (!parentRect.value) return y

    const dimensions = {
      width: toValue(parentRect.value.width),
      height: toValue(parentRect.value.height),
      top: toValue(parentRect.value.top),
    }

    switch (points.parent) {
      case 'top':
        y -= dimensions.top
        break
      case 'center':
        y -= dimensions.top + dimensions.height / 2
        break
      case 'bottom':
        y -= dimensions.top + dimensions.height
        break
      case 'initial':
        y -= childRect.value.top + scrollY
        break
    }

    return y
  }

  const getCalculations = () => {
    childRect.value = toValue(child)?.getBoundingClientRect()
    parentRect.value = toValue(parent)
      ? useElementBounding(parent)
      : { ...useWindowSize(), top: 0 }
    start.value = getOffsetTop(splitLocation(from))
    end.value = getOffsetTop(splitLocation(to))
  }

  const getProgress = () => {
    const scrollY = toValue(scrollPosition?.y) || 0
    const total = Math.abs(end.value - start.value)
    const current = scrollY - start.value

    return clampValue(current / total, 0, 1)
  }

  return { getCalculations, getProgress }
}

export type UseProgressReturn = ReturnType<typeof useProgress>
