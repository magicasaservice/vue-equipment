import { ref, inject, toValue, type MaybeRef, type MaybeRefOrGetter } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { MagicScrollReturn } from '../../symbols'
import { clampValue } from '@maas/vue-equipment/utils'

import type { FromTo } from '../../types'

type UseScrollApiParams = {
  child: MaybeRef<HTMLElement | null | undefined>
  parent: MaybeRefOrGetter<HTMLElement | null | undefined>
  from: FromTo
  to: FromTo
}

type ChildRect = DOMRect | undefined
type ParentRect =
  | DOMRect
  | {
      width: MaybeRef<number>
      height: MaybeRef<number>
      top: MaybeRef<number>
    }
  | undefined

export function useScrollApi(params: UseScrollApiParams) {
  const { child, parent, from, to } = params
  const scrollReturn = inject(MagicScrollReturn, undefined)

  const childRect = ref<ChildRect>(undefined)
  const parentRect = ref<ParentRect>(undefined)
  const start = ref(0)
  const end = ref(0)

  function splitLocation(location: string) {
    return {
      child: location.match(/^[a-z]+/)![0],
      parent: location.match(/[a-z]+$/)![0],
    }
  }

  function getOffsetTop(points: { child: string; parent: string }) {
    let y = 0

    if (!childRect.value) return y

    const scrollY = toValue(scrollReturn?.y) || 0

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

    if (!parentRect.value) {
      return y
    }

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

  function getCalculations() {
    childRect.value = toValue(child)?.getBoundingClientRect()
    parentRect.value = toValue(parent)
      ? toValue(parent)?.getBoundingClientRect()
      : { ...useWindowSize(), top: 0 }
    start.value = getOffsetTop(splitLocation(from))
    end.value = getOffsetTop(splitLocation(to))
  }

  function getProgress() {
    const scrollY = toValue(scrollReturn?.y) || 0
    const total = Math.abs(end.value - start.value)
    const current = scrollY - start.value

    return clampValue(current / total, 0, 1)
  }

  return { getCalculations, getProgress }
}
