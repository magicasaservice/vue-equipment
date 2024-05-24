import { ref, watch, computed, toValue, type MaybeRef } from 'vue'
import { useIntersectionObserver, useWindowSize } from '@vueuse/core'
import { useMagicEmitter } from '@maas/vue-equipment/plugins'

import type {
  MagicScrollCollisionEntry,
  Position,
  ScrollDirection,
  Offset,
} from '../../types'

type AlertPositions = {
  top: boolean
  bottom: boolean
}

type UseCollisionDetectArgs = {
  scrollY: MaybeRef<number>
  entries: MagicScrollCollisionEntry[]
  parent: HTMLElement | undefined
}

interface MappedEntry extends Omit<MagicScrollCollisionEntry, 'element'> {
  element: HTMLElement
  alerted: {
    up: AlertPositions
    down: AlertPositions
  }
}

type ObserveEntryArgs = {
  position: Position
  direction: ScrollDirection
  boundingRect: DOMRect
  entry: MappedEntry
}

type ResetEntryArgs = {
  position: Position
  direction: ScrollDirection
  boundingRect: DOMRect
  entry: MappedEntry
}

export function useCollisionDetect(args: UseCollisionDetectArgs) {
  const { scrollY, entries, parent } = args

  const lastScrollY = ref(0)
  const intersecting = ref()
  const scrollDirection = ref<ScrollDirection>()
  const mappedEntries = ref<MappedEntry[]>([])

  const oppositeScrollDirection = computed(() =>
    scrollDirection.value === 'up' ? 'down' : 'up'
  )

  const windowDimensions = useWindowSize()

  function getOffset(payload: Offset) {
    return typeof payload === 'function'
      ? payload({
          vh: toValue(windowDimensions.height),
          vw: toValue(windowDimensions.width),
        })
      : payload ?? 0
  }

  function initialize() {
    if (!parent) return

    mappedEntries.value = entries
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

        if (!element) {
          return undefined as unknown as MappedEntry
        } else {
          return { ...entry, offset, element, alerted }
        }
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
    // Save scrollY to lastScrollY for next run
    if (!lastScrollY.value) {
      lastScrollY.value = toValue(scrollY)
      resetAll()
      return
    }

    // Check scroll direction
    scrollDirection.value =
      lastScrollY.value <= toValue(scrollY) ? 'down' : 'up'
    lastScrollY.value = toValue(scrollY)

    // Loop over mapped entries
    let i = mappedEntries.value.length
    while (i--) {
      const entry = mappedEntries.value[i]
      if (!entry.element) return

      const boundingRect = entry.element.getBoundingClientRect()

      if (scrollDirection.value) {
        observeEntry({
          position: 'top',
          direction: scrollDirection.value,
          boundingRect,
          entry,
        })
        observeEntry({
          position: 'bottom',
          direction: scrollDirection.value,
          boundingRect,
          entry,
        })
        resetEntry({
          position: 'top',
          direction: oppositeScrollDirection.value,
          boundingRect,
          entry,
        })
        resetEntry({
          position: 'bottom',
          direction: oppositeScrollDirection.value,
          boundingRect,
          entry,
        })
      }
    }
  }

  function resetAll() {
    mappedEntries.value = mappedEntries.value.map((entry) => {
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

  function observeEntry(args: ObserveEntryArgs) {
    const { position, direction, boundingRect, entry } = args

    const offset = getOffset(entry.offset![position] ?? 0)
    if (entry.alerted[direction][position]) return

    if (
      (direction === 'down' && boundingRect[position] <= offset) ||
      (direction === 'up' && boundingRect[position] >= offset)
    ) {
      entry.alerted[direction][position] = true
      useMagicEmitter().emit('collision', {
        direction,
        position,
        element: entry.element,
        data: entry.data,
      })
    }
  }

  function resetEntry(args: ResetEntryArgs) {
    const { position, direction, boundingRect, entry } = args

    const offset = getOffset(entry.offset![position] ?? 0)
    if (!entry.alerted[direction][position]) return

    if (
      (direction === 'down' && boundingRect[position] >= offset) ||
      (direction === 'up' && boundingRect[position] <= offset)
    ) {
      entry.alerted[direction][position] = false
    }
  }

  initialize()

  watch(
    () => toValue(scrollY),
    () => {
      if (intersecting.value) {
        observeAll()
      }
    }
  )

  return {
    mappedEntries,
  }
}
