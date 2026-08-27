const EDGE_NAVIGATION_THRESHOLD = 44
const CLICK_SLOP = 12

// Focus-driven controls break harder when their touchstart is canceled than
// they would from a stray navigation swipe
const BAILED_TAGS = ['SELECT', 'OPTION', 'INPUT', 'TEXTAREA']

interface CancelEdgeNavigationArgs {
  event: TouchEvent
  threshold?: number
  slop?: number
}

interface RestoreClickArgs {
  target: HTMLElement
  touch: Touch
  slop: number
}

// iPadOS reports a Macintosh user agent, so touch support is the tell
export function hasEdgeNavigationGestures() {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    /iPad|iPhone|iPod/.test(navigator?.userAgent) ||
    (/Macintosh/.test(navigator?.userAgent) && navigator?.maxTouchPoints > 1)
  )
}

// Canceling touchstart is the one signal WebKit honors to keep its back and
// forward navigation swipe from arming for a touch that starts near a
// vertical viewport edge. Pointer events keep firing, so pointer-based
// dragging is unaffected; the touch’s synthesized click is restored manually.
// Returns whether the event was canceled.
export function cancelEdgeNavigation(args: CancelEdgeNavigationArgs): boolean {
  const {
    event,
    threshold = EDGE_NAVIGATION_THRESHOLD,
    slop = CLICK_SLOP,
  } = args

  if (!hasEdgeNavigationGestures() || !event.cancelable) {
    return false
  }

  if (event.touches.length !== 1) {
    return false
  }

  const touch = event.touches[0]
  const target = event.target

  if (!touch || !(target instanceof HTMLElement)) {
    return false
  }

  if (BAILED_TAGS.includes(target.tagName) || target.isContentEditable) {
    return false
  }

  if (
    touch.clientX > threshold &&
    touch.clientX < window.innerWidth - threshold
  ) {
    return false
  }

  event.preventDefault()
  restoreClick({ target, touch, slop })

  return true
}

// Canceling touchstart also cancels the tap’s synthesized click, so a touch
// that ends within the slop dispatches a replacement — deferred, to mirror a
// native click arriving after every touchend listener has run
function restoreClick(args: RestoreClickArgs) {
  const { target, touch, slop } = args
  const { identifier, clientX, clientY } = touch

  function findTouch(list: TouchList) {
    for (let index = 0; index < list.length; index++) {
      const candidate = list[index]
      if (candidate?.identifier === identifier) {
        return candidate
      }
    }

    return undefined
  }

  function teardown() {
    document.removeEventListener('touchend', onTouchend, true)
    document.removeEventListener('touchcancel', onTouchcancel, true)
  }

  function onTouchend(event: TouchEvent) {
    const endTouch = findTouch(event.changedTouches)

    if (!endTouch) {
      return
    }

    teardown()

    const distance = Math.hypot(
      endTouch.clientX - clientX,
      endTouch.clientY - clientY
    )

    if (distance <= slop) {
      setTimeout(() => target.click())
    }
  }

  function onTouchcancel(event: TouchEvent) {
    if (findTouch(event.changedTouches)) {
      teardown()
    }
  }

  document.addEventListener('touchend', onTouchend, true)
  document.addEventListener('touchcancel', onTouchcancel, true)
}
