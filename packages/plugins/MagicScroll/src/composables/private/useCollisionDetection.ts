import { ref, reactive, computed, toValue, type MaybeRef } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

import type {
  CollisionEdge,
  ScrollDirection,
  CollisionOffset,
} from '../../types'

type UseCollisionDetectionArgs = {
  id: string
  child: MaybeRef<HTMLElement | undefined>
  parent: MaybeRef<HTMLElement | undefined>
  scrollY: MaybeRef<number>
  offset?: CollisionOffset
}

type ObserveItemArgs = {
  childEdge: CollisionEdge
  parentEdge: CollisionEdge
  direction: ScrollDirection
}

type ResetItemArgs = {
  childEdge: CollisionEdge
  parentEdge: CollisionEdge
  direction: ScrollDirection
}

export function useCollisionDetection(args: UseCollisionDetectionArgs) {
  const { id, scrollY, child, parent, offset } = args

  const alerted = reactive({
    up: {
      top: {
        top: false,
        bottom: false,
      },
      bottom: {
        top: false,
        bottom: false,
      },
    },
    down: {
      top: {
        top: false,
        bottom: false,
      },
      bottom: {
        top: false,
        bottom: false,
      },
    },
  })

  const childBoundingRect = useElementBounding(child)
  const parentBoundingRect = useElementBounding(parent)

  const mappedOffset = { top: 0, bottom: 0, ...offset }

  const lastScrollY = ref(0)
  const scrollDirection = ref<ScrollDirection>()
  const oppositeScrollDirection = computed(() =>
    scrollDirection.value === 'up' ? 'down' : 'up'
  )

  function observe() {
    // If no scroll has been detected, reset all values and return
    // Save scrollY to lastScrollY for next run
    if (!lastScrollY.value) {
      lastScrollY.value = toValue(scrollY)
      reset()
      return
    }

    // Check scroll direction
    scrollDirection.value =
      lastScrollY.value <= toValue(scrollY) ? 'down' : 'up'
    lastScrollY.value = toValue(scrollY)

    if (scrollDirection.value) {
      observeItem({
        childEdge: 'top',
        parentEdge: 'top',
        direction: scrollDirection.value,
      })
      observeItem({
        childEdge: 'top',
        parentEdge: 'bottom',
        direction: scrollDirection.value,
      })
      observeItem({
        childEdge: 'bottom',
        parentEdge: 'bottom',
        direction: scrollDirection.value,
      })
      observeItem({
        childEdge: 'bottom',
        parentEdge: 'top',
        direction: scrollDirection.value,
      })
      resetItem({
        childEdge: 'top',
        parentEdge: 'top',
        direction: oppositeScrollDirection.value,
      })
      resetItem({
        childEdge: 'top',
        parentEdge: 'bottom',
        direction: oppositeScrollDirection.value,
      })
      resetItem({
        childEdge: 'bottom',
        parentEdge: 'bottom',
        direction: oppositeScrollDirection.value,
      })
      resetItem({
        childEdge: 'bottom',
        parentEdge: 'top',
        direction: oppositeScrollDirection.value,
      })
    }
  }

  function reset() {
    alerted.up.top.top = false
    alerted.up.top.bottom = false
    alerted.up.bottom.top = false
    alerted.up.bottom.bottom = false
    alerted.down.top.top = false
    alerted.down.top.bottom = false
    alerted.down.bottom.top = false
    alerted.down.bottom.bottom = false
  }

  function observeItem(args: ObserveItemArgs) {
    const { childEdge, parentEdge, direction } = args

    if (alerted[direction][childEdge][parentEdge]) {
      return
    }

    const offset = mappedOffset[parentEdge]
    const mappedChildEdge = toValue(childBoundingRect[childEdge])
    const mappedParentEdge = toValue(parentBoundingRect[parentEdge]) + offset

    if (
      (direction === 'down' && mappedChildEdge <= mappedParentEdge) ||
      (direction === 'up' && mappedChildEdge >= mappedParentEdge)
    ) {
      alerted[direction][childEdge][parentEdge] = true
      useMagicEmitter().emit('collision', {
        id,
        direction,
        parentEdge,
        childEdge,
      })
    }
  }

  function resetItem(args: ResetItemArgs) {
    const { childEdge, parentEdge, direction } = args

    if (!alerted[direction][childEdge][parentEdge]) {
      return
    }

    const offset = mappedOffset[parentEdge]
    const mappedChildEdge = toValue(childBoundingRect[childEdge])
    const mappedParentEdge = toValue(parentBoundingRect[parentEdge]) + offset

    if (
      (direction === 'down' && mappedChildEdge >= mappedParentEdge) ||
      (direction === 'up' && mappedChildEdge <= mappedParentEdge)
    ) {
      alerted[direction][childEdge][parentEdge] = false
    }
  }

  return {
    observe,
  }
}
