import { useEasings } from '../useEasings'
import { unrefElement } from '@vueuse/core'
import type { EasingFunction } from '../useEasings'
import type { MaybeComputedElementRef, MaybeElement } from '@vueuse/core'

export type ScrollToParams = {
  parent?: Element | Window
  left: number
  top: number
  duration?: { x?: number; y?: number }
  easing?: EasingFunction
  callback?: () => void
}
export type getScrollDurationParams = {
  parent: Element | Window
  left: number
  top: number
  speed: number
}
export type scrollToTargetParams = {
  target: string | Element | MaybeElement | MaybeComputedElementRef
  parent?: string | Element | Window | MaybeElement | MaybeComputedElementRef
  offset?: {
    x?: number
    y?: number
  }
  speed?: number
  easing?: EasingFunction
}

const easings = useEasings()

function min(a: number, b: number) {
  return a < b ? a : b
}

function getScrollPosition(element: Element | Window): {
  x: number
  y: number
} {
  if (element === window) {
    return { x: window.pageXOffset, y: window.pageYOffset }
  } else if (element instanceof Element) {
    return { x: element.scrollLeft, y: element.scrollTop }
  } else {
    return { x: 0, y: 0 }
  }
}

export function useScrollTo() {
  function getDistance(element: Element): { top: number; left: number } {
    const rect = element.getBoundingClientRect()
    const scrollEl = document.scrollingElement || document.documentElement

    return {
      top: rect.top + scrollEl.scrollTop,
      left: rect.left + scrollEl.scrollLeft,
    }
  }

  function getScrollDuration({
    parent = document.documentElement || document.body,
    left = 0,
    top = 0,
    speed = 500,
  }: getScrollDurationParams) {
    const currentPos = getScrollPosition(parent)
    const distanceX = currentPos.x - left
    const distanceY = currentPos.y - top
    const durationX = Math.abs((distanceX / speed) * 100)
    const durationY = Math.abs((distanceY / speed) * 100)

    return { x: durationX, y: durationY }
  }

  function scrollTo({
    parent = document.documentElement || document.body,
    top,
    left,
    duration = {},
    easing = easings.easeOutQuad,
    callback,
  }: ScrollToParams) {
    const startTime = Date.now()
    const { x: fromX, y: fromY } = getScrollPosition(parent)

    if (fromX === top && fromY === left) {
      if (callback) callback()
      return
    }

    const mappedDuration = { x: 500, y: 500, ...duration }

    const scroll = () => {
      const currentTime = Date.now()

      const timeX = min(1, (currentTime - startTime) / mappedDuration.x)
      const timeY = min(1, (currentTime - startTime) / mappedDuration.y)
      const easedTimeX = easing(timeX)
      const easedTimeY = easing(timeY)

      // We use the min of the two times to make sure we scroll at the same speed
      const minTime = Math.min(easedTimeX, easedTimeY)

      parent.scroll({
        left: minTime * (top - fromX) + fromX,
        top: minTime * (top - fromY) + fromY,
      })

      if (easedTimeX < 1 || easedTimeY < 1) {
        requestAnimationFrame(scroll)
      } else if (callback) {
        callback()
      }
    }

    requestAnimationFrame(scroll)
  }

  function scrollToTarget({
    target,
    parent = document.documentElement || document.body,
    offset = {},
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

    const mappedOffset = { x: 0, y: 0, ...offset }
    const distance = getDistance(targetEl)

    const leftDistance = distance.left - mappedOffset.x
    const topDistance = distance.top - mappedOffset.y

    const scrollDuration = getScrollDuration({
      parent: parentEl,
      left: leftDistance,
      top: topDistance,
      speed: speed,
    })

    scrollTo({
      parent: parentEl,
      left: leftDistance,
      top: topDistance,
      duration: scrollDuration,
      easing: easing,
    })
  }

  return {
    getDistance,
    getScrollDuration,
    scrollTo,
    scrollToTarget,
  }
}
