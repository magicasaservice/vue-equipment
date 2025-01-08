interface GuardedSetPointerCaptureArgs {
  event: PointerEvent
  element?: Element
  debug?: boolean
}

interface GuardedReleasePointerCaptureArgs {
  event: PointerEvent
  element?: Element
}

export function guardedSetPointerCapture(
  args: GuardedSetPointerCaptureArgs
): void {
  const { event, element, debug } = args
  if (element && event.isPrimary && event.pointerType !== 'mouse') {
    try {
      const coalescedEvents: PointerEvent[] =
        'getCoalescedEvents' in event ? event.getCoalescedEvents() : [event]

      if (coalescedEvents.length > 0) {
        element?.setPointerCapture(event.pointerId)
      }
    } catch (error) {
      if (debug) {
        console.warn('Failed to set pointer capture:', error)
      }
    }
  }
}

export function guardedReleasePointerCapture(
  args: GuardedReleasePointerCaptureArgs
): void {
  const { event, element } = args
  if (element?.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId)
  }
}
