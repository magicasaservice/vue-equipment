import { ref, watch, unref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useEmitter } from './useEmitter'

import type { ComputedRef, Ref } from 'vue'
import type {
  CollisionEntry,
  CollisionMappedEntry,
  WindowDimensions,
} from '../types'

type ScrollDirection = 'up' | 'down'
type Position = 'top' | 'bottom'

export function useCollisionDetect(
  pageYOffset: ComputedRef<number>,
  windowDimensions: WindowDimensions,
  collisionEntries: CollisionEntry[],
  parent: HTMLElement | undefined
): { collisionMappedEntries: Ref<CollisionMappedEntry[]> } {
  const scrolled = ref(0)
  const intersecting = ref()
  const scrollDirection = ref<ScrollDirection>()
  const collisionMappedEntries = ref<CollisionMappedEntry[]>([])

  const oppositeScrollDirection = computed(() =>
    scrollDirection.value === 'up' ? 'down' : 'up'
  )

  function getOffset(
    value: number | (({ vw, vh }: { vw: number; vh: number }) => number)
  ) {
    return typeof value === 'function'
      ? value({
          vh: unref(windowDimensions.vh),
          vw: unref(windowDimensions.vw),
        })
      : value || 0
  }

  function initialize() {
    if (!parent) return

    collisionMappedEntries.value = collisionEntries.map((entry) => {
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

      return { ...entry, offset, element, alerted }
    })

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
    let i = collisionMappedEntries.value.length
    while (i--) {
      const entry = collisionMappedEntries.value[i]
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
    collisionMappedEntries.value = collisionMappedEntries.value.map((entry) => {
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
    entry: CollisionMappedEntry
  ) {
    const offset = getOffset(entry.offset![pos] || 0)
    if (entry.alerted[dir][pos]) return

    if (
      (dir === 'down' && boundingRect[pos] <= offset) ||
      (dir === 'up' && boundingRect[pos] >= offset)
    ) {
      entry.alerted[dir][pos] = true
      useEmitter().emit('magic-scroll:collision', {
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
    entry: CollisionMappedEntry
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
    collisionMappedEntries,
  }
}

export type UseCollisionDetectReturn = ReturnType<typeof useCollisionDetect>
