import { computed, readonly, ref, toValue } from 'vue'
import {
  defaultDocument,
  tryOnScopeDispose,
  useEventListener,
} from '@vueuse/core'

import type { MaybeRefOrGetter } from 'vue'

export type TouchIntent = 'scroll' | 'swipe'
export type TouchIntentAxis = 'x' | 'y'

export interface UseTouchIntentOptions {
  target?: MaybeRefOrGetter<Element | Document | null | undefined>
  axis?: MaybeRefOrGetter<TouchIntentAxis>
  threshold?: MaybeRefOrGetter<number>
}

const endEvents = ['pointerup', 'pointercancel', 'touchend', 'touchcancel']

// Tells a scroll from a swipe by the axis a press’s first move leans along
export function useTouchIntent(options: UseTouchIntentOptions = {}) {
  const { target, axis = 'y', threshold = 8 } = options

  // Private state
  let pressX = 0
  let pressY = 0
  let cancelMove: (() => void) | undefined = undefined
  let cancelEnd: (() => void) | undefined = undefined

  // Public state
  const intent = ref<TouchIntent | undefined>(undefined)
  const isScrolling = computed(() => intent.value === 'scroll')
  const isSwiping = computed(() => intent.value === 'swipe')

  // Private functions
  function end() {
    cancelMove?.()
    cancelEnd?.()
    cancelMove = undefined
    cancelEnd = undefined
    intent.value = undefined
  }

  // The first axis to pass the threshold with the larger move settles the press
  function onPointermove(e: PointerEvent) {
    if (intent.value || (e.isTrusted && !e.isPrimary)) {
      return
    }

    const dx = Math.abs(e.clientX - pressX)
    const dy = Math.abs(e.clientY - pressY)
    const vertical = toValue(axis) === 'y'
    const along = vertical ? dy : dx
    const across = vertical ? dx : dy
    const limit = toValue(threshold)

    if (along > limit && along > across) {
      intent.value = 'scroll'
    } else if (across > limit && across > along) {
      intent.value = 'swipe'
    }
  }

  function onPointerdown(e: PointerEvent) {
    if (e.isTrusted && !e.isPrimary) {
      return
    }

    end()
    pressX = e.clientX
    pressY = e.clientY
    cancelMove = useEventListener(
      defaultDocument,
      'pointermove',
      onPointermove,
      { capture: true }
    )
    cancelEnd = useEventListener(defaultDocument, endEvents, end, {
      capture: true,
    })
  }

  useEventListener(
    () => toValue(target) ?? defaultDocument,
    'pointerdown',
    onPointerdown,
    { capture: true }
  )

  tryOnScopeDispose(end)

  return {
    intent: readonly(intent),
    isScrolling,
    isSwiping,
  }
}

export type UseTouchIntentReturn = ReturnType<typeof useTouchIntent>
