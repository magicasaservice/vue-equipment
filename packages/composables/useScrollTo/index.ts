import {
  unrefElement,
  type MaybeComputedElementRef,
  type MaybeElement,
} from '@vueuse/core'
import { easeOutQuad } from '@maas/vue-equipment/utils'

export type ScrollToTarget =
  | string
  | Element
  | MaybeElement
  | MaybeComputedElementRef

export type ScrollToParent = ScrollToTarget | Window

export type ScrollToParams = {
  parent?: Element | Window
  left: number
  top: number
  duration?: { x?: number; y?: number }
  easing?: (t: number) => number
  callback?: () => void
}

export type getScrollDurationParams = {
  parent: Element | Window
  left: number
  top: number
  speed: number
}

export type scrollToTargetParams = {
  target: ScrollToTarget
  parent?: ScrollToParent
  offset?: {
    x?: number
    y?: number
  }
  speed?: number
  easing?: (t: number) => number
}

// Private functions
function min(a: number, b: number) {
  return a < b ? a : b
}

function unwrapParent(parent: ScrollToParent) {
  if (parent === window) {
    return parent
  } else if (typeof parent === 'string') {
    return document.querySelector(parent) || document.documentElement
  } else {
    return (
      unrefElement(parent as MaybeComputedElementRef<MaybeElement>) ||
      document.documentElement
    )
  }
}

function unwrapTarget(target: ScrollToTarget, parentEl: Element | Window) {
  if (typeof target === 'string') {
    const queryTarget = parentEl === window ? document : (parentEl as Element)
    return queryTarget.querySelector(target)
  } else {
    return unrefElement(target as MaybeComputedElementRef<MaybeElement>)
  }
}

function isHtmlElement(
  parentEl: Window | SVGElement | Element
): parentEl is HTMLElement {
  return parentEl instanceof HTMLElement
}

function disableScrollSnap(parentEl: Window | SVGElement | Element) {
  if (isHtmlElement(parentEl)) {
    parentEl.style.scrollSnapType = 'none'
  }
}

function reenableScrollSnap(parentEl: Window | SVGElement | Element) {
  if (isHtmlElement(parentEl)) {
    parentEl.style.scrollSnapType = ''
  }
}

// Public composable
export function useScrollTo() {
  function getScrollPosition(element: Element | Window): {
    x: number
    y: number
  } {
    if (element === window) {
      return { x: window.scrollX, y: window.scrollY }
    } else if (element instanceof Element) {
      return { x: element.scrollLeft, y: element.scrollTop }
    } else {
      return { x: 0, y: 0 }
    }
  }

  function getDistance(
    target: Element,
    parent?: Element | Window
  ): { top: number; left: number } {
    const rect = target.getBoundingClientRect()
    const scrollEl =
      parent || document.scrollingElement || document.documentElement

    const scrollTop = scrollEl instanceof Window ? 0 : scrollEl.scrollTop
    const scrollLeft = scrollEl instanceof Window ? 0 : scrollEl.scrollLeft

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
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
    easing = easeOutQuad,
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
        left: minTime * (left - fromX) + fromX,
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
    easing = easeOutQuad,
  }: scrollToTargetParams) {
    let parentEl = unwrapParent(parent)
    if (!parentEl) return
    let targetEl = unwrapTarget(target, parentEl)
    if (!targetEl) return

    disableScrollSnap(parentEl)

    const mappedOffset = { x: 0, y: 0, ...offset }
    const distance = getDistance(targetEl, parentEl)
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
      callback: () => reenableScrollSnap(parentEl),
    })
  }

  return {
    getScrollPosition,
    getDistance,
    getScrollDuration,
    scrollTo,
    scrollToTarget,
  }
}
