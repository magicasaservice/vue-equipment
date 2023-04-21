import { useEasings } from '../useEasings'
import { unref } from 'vue'

const { linear, easeOutQuad } = useEasings()

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

type ScrollToParams = {
  element?: Element
  top: number
  duration?: number
  easingFn?: (t: number) => number
  callback?: () => void
}

type getScrollDurationParams = {
  element: Element | Window
  top: number
  speed: number
}

type scrollToTargetParams = {
  target: string | Element
  parentEl: Element | Window
  offset: number
  speed: number
  easingFn?: (t: number) => number
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
    easingFn = linear,
    callback,
  }: ScrollToParams) {
    const start = Date.now()
    const from = element.scrollTop

    if (from === top) {
      if (callback) callback()
      return
    }

    const scroll = () => {
      const currentTime = Date.now()
      const time = min(1, (currentTime - start) / duration)
      const easedTime = easingFn(time)

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
    parentEl = window,
    offset = 0,
    speed = 300,
    easingFn = easeOutQuad,
  }: scrollToTargetParams) {
    const mappedTarget = unref(target)
    const targetEl =
      typeof mappedTarget === 'string'
        ? document.querySelector(mappedTarget)
        : mappedTarget

    if (!targetEl) return

    const topDistance = getTopDistance(targetEl) - offset
    const scrollDuration = getScrollDuration({
      element: parentEl,
      top: topDistance,
      speed,
    })

    scrollTo({
      top: topDistance,
      duration: scrollDuration,
      easingFn,
    })
  }

  return {
    getTopDistance,
    getScrollDuration,
    scrollTo,
    scrollToTarget,
  }
}
