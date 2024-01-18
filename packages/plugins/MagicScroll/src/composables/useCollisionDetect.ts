import { ref, watch, unref, computed } from 'vue'
import { useIntersectionObserver, useWindowSize } from '@vueuse/core'
import { useCollisionEmitter } from './useCollisionEmitter'

import type { ComputedRef, Ref } from 'vue'
import type { CollisionEntry, MappedCollisionEntry } from '../types'

type ScrollDirection = 'up' | 'down'
type Position = 'top' | 'bottom'

export function useCollisionDetect(
  pageYOffset: ComputedRef<number>,
  collisionEntries: CollisionEntry[],
  parent: HTMLElement | undefined
): { mappedCollisionEntries: Ref<MappedCollisionEntry[]> } {
  const scrolled = ref(0)
  const intersecting = ref()
  const scrollDirection = ref<ScrollDirection>()
  const mappedCollisionEntries = ref<MappedCollisionEntry[]>([])

  const oppositeScrollDirection = computed(() =>
    scrollDirection.value === 'up' ? 'down' : 'up'
  )

  const windowDimensions = useWindowSize()

  function getOffset(
    value: number | (({ vw, vh }: { vw: number; vh: number }) => number)
  ) {
    return typeof value === 'function'
      ? value({
          vh: unref(windowDimensions.height),
          vw: unref(windowDimensions.width),
        })
      : value || 0
  }

  function initialize() {
    if (!parent) return

    mappedCollisionEntries.value = collisionEntries
      .map((entry) => {
        const alerted = {
          up: {
            top: false,
            bottom: false,
          },
          down: {
            top: false,
            bottom: false,
          },
        }
        const offset = { top: 0, bottom: 0, ...entry.offset }
        const element = entry.element
          ? (parent?.querySelector(entry.element) as HTMLElement)
          : parent

        if (!element) return undefined as unknown as MappedCollisionEntry

        return { ...entry, offset, element, alerted }
      })
      .filter((element) => !!element)

    // Check if the element’s first child is visible
    // and stop tracking if not
    useIntersectionObserver(
      parent.querySelector('*') as HTMLElement,
      ([{ isIntersecting }]) => {
        intersecting.value = isIntersecting
      },
      { rootMargin: '50% 0px 50% 0px', threshold: 0.01 }
    )

    observeAll()
  }

  function observeAll() {
    // If no scroll has been detected, reset all values and return
    // Save pageYoffset to scrolled for next run
    if (!scrolled.value) {
      scrolled.value = pageYOffset.value
      resetAll()
      return
    }

    // Check scroll direction
    scrollDirection.value = scrolled.value <= pageYOffset.value ? 'down' : 'up'
    scrolled.value = pageYOffset.value

    // Loop over mapped entries
    let i = mappedCollisionEntries.value.length
    while (i--) {
      const entry = mappedCollisionEntries.value[i]
      if (!entry.element) return

      const boundingRect = entry.element.getBoundingClientRect()

      if (scrollDirection.value) {
        observeEntry('top', scrollDirection.value, boundingRect, entry)
        observeEntry('bottom', scrollDirection.value, boundingRect, entry)
        resetEntry('top', oppositeScrollDirection.value, boundingRect, entry)
        resetEntry('bottom', oppositeScrollDirection.value, boundingRect, entry)
      }
    }
  }

  function resetAll() {
    mappedCollisionEntries.value = mappedCollisionEntries.value.map((entry) => {
      const alerted = {
        up: {
          top: false,
          bottom: false,
        },
        down: {
          top: false,
          bottom: false,
        },
      }
      return { ...entry, alerted }
    })
  }

  function observeEntry(
    pos: Position,
    dir: ScrollDirection,
    boundingRect: DOMRect,
    entry: MappedCollisionEntry
  ) {
    const offset = getOffset(entry.offset![pos] || 0)
    if (entry.alerted[dir][pos]) return

    if (
      (dir === 'down' && boundingRect[pos] <= offset) ||
      (dir === 'up' && boundingRect[pos] >= offset)
    ) {
      entry.alerted[dir][pos] = true
      useCollisionEmitter().emit('collision', {
        dir,
        pos,
        el: entry.element,
        data: entry.data,
      })
    }
  }

  function resetEntry(
    pos: Position,
    dir: ScrollDirection,
    boundingRect: DOMRect,
    entry: MappedCollisionEntry
  ) {
    const offset = getOffset(entry.offset![pos] || 0)
    if (!entry.alerted[dir][pos]) return

    if (
      (dir === 'down' && boundingRect[pos] >= offset) ||
      (dir === 'up' && boundingRect[pos] <= offset)
    ) {
      entry.alerted[dir][pos] = false
    }
  }

  initialize()

  watch(
    () => pageYOffset.value,
    () => {
      if (intersecting.value) {
        observeAll()
      }
    }
  )

  return {
    mappedCollisionEntries,
  }
}

export type UseCollisionDetectReturn = ReturnType<typeof useCollisionDetect>
