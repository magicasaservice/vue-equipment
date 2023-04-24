import { useEasings } from '../useEasings'
import { unrefElement } from '@vueuse/core'
import type { Easing } from '../useEasings'
import type { MaybeComputedElementRef, MaybeElement } from '@vueuse/core'

export type EasingFunction = (t: number) => number
export type ScrollToParams = {
  element?: Element
  top: number
  duration?: number
  easing?: Easing | EasingFunction
  callback?: () => void
}
export type getScrollDurationParams = {
  element: Element | Window
  top: number
  speed: number
}
export type scrollToTargetParams = {
  target: string | Element | MaybeElement | MaybeComputedElementRef
  parent?: string | Element | Window | MaybeElement | MaybeComputedElementRef
  offset: number
  speed: number
  easing?: Easing | EasingFunction
}

const easings = useEasings()

function min(a: number, b: number) {
  return a < b ? a : b
}

function getScrollPosition(element: Element | Window): number {
  if (element === window) {
    return window.pageYOffset
  } else if (element instanceof Element) {
    return element.scrollTop
  } else {
    return 0
  }
}

export function useScrollTo() {
  function getTopDistance(element: Element): number {
    const rect = element.getBoundingClientRect()
    const scrollTop = (document.scrollingElement || document.documentElement)
      .scrollTop
    return rect.top + scrollTop
  }

  function getScrollDuration({
    element = window,
    top = 0,
    speed = 500,
  }: getScrollDurationParams) {
    const currentPos = getScrollPosition(element)
    const distance = currentPos - top
    const duration = Math.abs((distance / speed) * 100)

    return duration
  }

  function scrollTo({
    element = document.documentElement || document.body,
    top,
    duration = 500,
    easing = easings.linear,
    callback,
  }: ScrollToParams) {
    const start = Date.now()
    const from = element.scrollTop

    if (from === top) {
      if (callback) callback()
      return
    }

    const mappedEasing =
      typeof easing === 'string' ? easings[easing] : (easing as Function)

    const scroll = () => {
      const currentTime = Date.now()
      const time = min(1, (currentTime - start) / duration)
      const easedTime = mappedEasing(time)

      element.scroll({ top: easedTime * (top - from) + from })

      if (time < 1) {
        requestAnimationFrame(scroll)
      } else if (callback) {
        callback()
      }
    }

    requestAnimationFrame(scroll)
  }

  function scrollToTarget({
    target,
    parent = window,
    offset = 0,
    speed = 500,
    easing = easings.easeOutQuad,
  }: scrollToTargetParams) {
    let parentEl
    let targetEl

    if (parent === window) {
      parentEl = parent
    } else if (typeof parent === 'string') {
      parentEl = document.querySelector(parent) || document.documentElement
    } else {
      parentEl =
        unrefElement(parent as MaybeComputedElementRef<MaybeElement>) ||
        document.documentElement
    }

    if (!parentEl) return

    if (typeof target === 'string') {
      const queryTarget = parentEl === window ? document : (parentEl as Element)
      targetEl = queryTarget.querySelector(target)
    } else {
      targetEl = unrefElement(target as MaybeComputedElementRef<MaybeElement>)
    }

    if (!targetEl) return

    const topDistance = getTopDistance(targetEl) - offset

    const scrollDuration = getScrollDuration({
      element: parentEl,
      top: topDistance,
      speed: speed,
    })

    scrollTo({
      top: topDistance,
      duration: scrollDuration,
      easing: easing,
    })
  }

  return {
    getTopDistance,
    getScrollDuration,
    scrollTo,
    scrollToTarget,
  }
}
