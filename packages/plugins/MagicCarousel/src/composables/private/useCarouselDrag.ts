import { computed, toValue, watch, onScopeDispose  } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  rubberband,
  interpolate,
  guardedSetPointerCapture,
  guardedReleasePointerCapture,
} from '@maas/vue-equipment/utils'
import {
  useMagicEmitter
  
} from '@maas/vue-equipment/plugins/MagicEmitter'
import { useCarouselState } from './useCarouselState'
import { useCarouselLoop, wrapThreshold } from './useCarouselLoop'
import { damp, round } from '../../utils/physics'
import { shouldSnap, snapVelocity } from '../../utils/snap'
import type {MaybeRef} from 'vue';
import type {MagicEmitterEvents} from '@maas/vue-equipment/plugins/MagicEmitter';

const releaseMomentum = 2

export function useCarouselDrag(instanceId: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(instanceId)
  const state = initializeState()

  const { syncLoop } = useCarouselLoop(instanceId)
  const emitter = useMagicEmitter()

  const mappedTrackEl = computed(() => state.trackEl)

  let pointerStart = 0
  let target = 0
  let velocity = 0
  let virtualScroll = 0
  let distanceMoved = 0
  let dragStarted = false

  let raf: number | null = null
  let lastTick = 0
  let frameDelta = 0

  let stopPointermove: (() => void) | null = null
  let stopPointerup: (() => void) | null = null

  // Private functions
  function interceptScrollMethod(
    el: HTMLElement,
    method: 'scrollTo' | 'scrollBy'
  ) {
    const original = el[method].bind(el)

    function intercepted(options?: ScrollToOptions): void
    function intercepted(x: number, y: number): void
    function intercepted(a?: ScrollToOptions | number, b?: number): void {
      if (!state.scrollingInternally) {
        state.scrolling = false
        cancelInterpolation()
      }

      state.scrollingInternally = false

      if (typeof a === 'number' && typeof b === 'number') {
        original(a, b)
      } else if (typeof a !== 'number') {
        original(a)
      }
    }

    el[method] = intercepted

    return function restore() {
      el[method] = original
    }
  }

  function cancelInterpolation() {
    if (state.interpolationId) {
      cancelAnimationFrame(state.interpolationId)
      state.interpolationId = null
    }

    state.snapping = false
  }

  function interpolateScroll(snapPoint: number, duration?: number) {
    const el = state.trackEl
    const position = state.snapPositions[snapPoint]

    if (!el || position === undefined) {
      return
    }

    const { animation } = state.options

    cancelInterpolation()
    state.scrolling = false
    state.snapping = true

    interpolate({
      from: el.scrollLeft,
      to: position,
      duration: duration ?? animation.snap.duration,
      easing: animation.snap.easing,
      callback: (value) => {
        el.scrollLeft = value

        if (value === position) {
          state.snapping = false
          state.interpolationId = null
        }
      },
      interpolationIdCallback: (interpolationId) => {
        state.interpolationId = interpolationId
      },
    })
  }

  function snapToCallback(payload: MagicEmitterEvents['snapTo']) {
    if (payload.id !== toValue(instanceId)) {
      return
    }

    if (typeof payload.snapPoint !== 'number') {
      return
    }

    interpolateScroll(payload.snapPoint, payload.duration)
  }

  function preventNextClick() {
    useEventListener(
      window,
      'click',
      (e) => {
        e.preventDefault()
        e.stopPropagation()
      },
      { capture: true, once: true }
    )
  }

  function applyRubberband() {
    const { range, direction } = state.measurements
    const edge = range * direction

    let offset = 0

    if (virtualScroll * direction <= 0) {
      offset =
        Math.sign(-virtualScroll) *
        rubberband(Math.abs(virtualScroll), state.overshoot)
    } else if (virtualScroll * direction > edge * direction) {
      offset =
        Math.sign(edge - virtualScroll) *
        rubberband(Math.abs(virtualScroll - edge), state.overshoot)
    }

    state.rubberbandOffset = round(offset, 3)
  }

  function tick(t: number) {
    raf = requestAnimationFrame(tick)
    frameDelta = t - lastTick

    const el = state.trackEl

    if (!el) {
      return
    }

    const { friction, damping } = state.options.animation.momentum

    velocity *= friction

    if (!state.dragging) {
      target += velocity
      virtualScroll = damp(virtualScroll, target, damping, frameDelta)
    } else {
      virtualScroll = damp(virtualScroll, target, friction, frameDelta)
    }

    if (state.options.loop) {
      const { range, period } = state.measurements

      if (virtualScroll > range - wrapThreshold) {
        virtualScroll -= period
        target -= period
      } else if (virtualScroll < wrapThreshold) {
        virtualScroll += period
        target += period
      }
    }

    state.scrollingInternally = true
    el.scrollTo({ left: virtualScroll, behavior: 'instant' })

    if (!state.dragging && round(velocity, 12) === 0) {
      state.scrolling = false
    }

    if (state.options.loop) {
      syncLoop(virtualScroll)
    } else {
      applyRubberband()
    }

    lastTick = t
  }

  function onPointerMove(e: PointerEvent) {
    e.preventDefault()

    const deltaX = pointerStart - e.clientX

    target += deltaX
    velocity += deltaX
    pointerStart = e.clientX
    distanceMoved += Math.abs(deltaX)

    if (!state.scrolling && distanceMoved >= state.options.threshold.lock) {
      dragStarted = true
      emitter.emit('beforeDrag', {
        id: toValue(instanceId),
        x: state.trackEl?.scrollLeft ?? 0,
        y: 0,
      })
      state.scrolling = true
    }

    if (dragStarted) {
      emitter.emit('drag', {
        id: toValue(instanceId),
        x: state.trackEl?.scrollLeft ?? 0,
        y: 0,
      })
    }
  }

  function onPointerUp(e: PointerEvent) {
    stopPointermove?.()
    stopPointerup?.()
    stopPointermove = null
    stopPointerup = null

    guardedReleasePointerCapture({ event: e, element: state.trackEl })

    state.dragging = false

    if (distanceMoved <= state.options.threshold.lock) {
      return
    }

    velocity *= releaseMomentum

    const { range, direction } = state.measurements
    const end = range * direction
    const outOfBounds =
      target * direction < 0 || target * direction > end * direction

    if (
      shouldSnap({ target, velocity, state }) ||
      (!state.options.loop && outOfBounds)
    ) {
      velocity = snapVelocity({ target, velocity, state })
    }

    preventNextClick()

    if (dragStarted) {
      dragStarted = false
      emitter.emit('afterDrag', {
        id: toValue(instanceId),
        x: state.trackEl?.scrollLeft ?? 0,
        y: 0,
      })
    }
  }

  function onPointerDown(e: PointerEvent) {
    const el = state.trackEl

    if (!el || !state.draggable || !e.isPrimary || e.button !== 0) {
      return
    }

    cancelInterpolation()

    virtualScroll = el.scrollLeft
    target = el.scrollLeft
    pointerStart = e.clientX
    velocity = 0
    distanceMoved = 0

    state.dragging = true

    guardedSetPointerCapture({ event: e, element: el })

    stopPointermove = useEventListener(window, 'pointermove', onPointerMove)
    stopPointerup = useEventListener(window, 'pointerup', onPointerUp)
  }

  function onWheel(e: WheelEvent) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      state.scrolling = false
      cancelInterpolation()
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      state.scrolling = false
      cancelInterpolation()
    }
  }

  useEventListener(mappedTrackEl, 'pointerdown', onPointerDown)
  useEventListener(mappedTrackEl, 'wheel', onWheel, { passive: true })
  useEventListener(window, 'keydown', onKeydown)

  emitter.on('snapTo', snapToCallback)

  // Watchers and lifecycle
  watch(
    () => state.scrolling,
    (value) => {
      if (value) {
        const el = state.trackEl

        if (!el) {
          state.scrolling = false
          return
        }

        lastTick = performance.now()
        target = el.scrollLeft
        virtualScroll = el.scrollLeft
        raf = requestAnimationFrame(tick)
      } else {
        if (raf) {
          cancelAnimationFrame(raf)
          raf = null
        }

        state.rubberbandOffset = 0
      }
    }
  )

  watch(mappedTrackEl, (el, _, onCleanup) => {
    if (!el) {
      return
    }

    const restoreScrollTo = interceptScrollMethod(el, 'scrollTo')
    const restoreScrollBy = interceptScrollMethod(el, 'scrollBy')

    onCleanup(() => {
      restoreScrollTo()
      restoreScrollBy()
    })
  })

  onScopeDispose(() => {
    emitter.off('snapTo', snapToCallback)
    cancelInterpolation()

    if (raf) {
      cancelAnimationFrame(raf)
      raf = null
    }

    stopPointermove?.()
    stopPointerup?.()
  })
}
