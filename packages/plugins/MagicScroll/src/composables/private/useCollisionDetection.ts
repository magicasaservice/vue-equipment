import { ref, reactive, computed, toValue, type MaybeRef } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

import type { Position, ScrollDirection, CollisionOffset } from '../../types'

type UseCollisionDetectionArgs = {
  id: string
  child: MaybeRef<HTMLElement | undefined>
  parent: MaybeRef<HTMLElement | undefined>
  scrollY: MaybeRef<number>
  offset?: CollisionOffset
}

type ObserveItemArgs = {
  position: Position
  direction: ScrollDirection
}

type ResetItemArgs = {
  position: Position
  direction: ScrollDirection
}

export function useCollisionDetection(args: UseCollisionDetectionArgs) {
  const { id, scrollY, child, parent, offset } = args

  const alerted = reactive({
    up: {
      top: false,
      bottom: false,
    },
    down: {
      top: false,
      bottom: false,
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
        position: 'top',
        direction: scrollDirection.value,
      })
      observeItem({
        position: 'bottom',
        direction: scrollDirection.value,
      })
      resetItem({
        position: 'top',
        direction: oppositeScrollDirection.value,
      })
      resetItem({
        position: 'bottom',
        direction: oppositeScrollDirection.value,
      })
    }
  }

  function reset() {
    alerted.up.top = false
    alerted.up.bottom = false
    alerted.down.top = false
    alerted.down.bottom = false
  }

  function observeItem(args: ObserveItemArgs) {
    const { position, direction } = args

    if (alerted[direction][position]) {
      return
    }

    const offset = mappedOffset[position]
    const elementPosition = toValue(childBoundingRect[position])
    const collisionPosition = toValue(parentBoundingRect[position]) + offset

    if (
      (direction === 'down' && elementPosition <= collisionPosition) ||
      (direction === 'up' && elementPosition >= collisionPosition)
    ) {
      alerted[direction][position] = true
      useMagicEmitter().emit('collision', {
        id,
        direction,
        position,
      })
    }
  }

  function resetItem(args: ResetItemArgs) {
    const { position, direction } = args

    if (!alerted[direction][position]) {
      return
    }

    const offset = mappedOffset[position]
    const elementPosition = toValue(childBoundingRect[position])
    const collisionPosition = toValue(parentBoundingRect[position]) + offset

    if (
      (direction === 'down' && elementPosition >= collisionPosition) ||
      (direction === 'up' && elementPosition <= collisionPosition)
    ) {
      alerted[direction][position] = false
    }
  }

  return {
    observe,
  }
}
