import {
  computed,
  markRaw,
  nextTick,
  onMounted,
  onScopeDispose,
  toValue,
  watch,
} from 'vue'
import { unrefElement, useResizeObserver, useThrottleFn } from '@vueuse/core'
import { convertToPixels } from '@maas/vue-equipment/utils'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { useTraySnap } from './useTraySnap'
import { SIDES, useTrayUtils } from './useTrayUtils'
import { useTrayState } from './useTrayState'

import type { MaybeRef, Ref } from 'vue'
import type { UseResizeObserverReturn } from '@vueuse/core'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

import type { MagicTraySide } from '../../types'

type UseTrayDragArgs = {
  id: MaybeRef<string>
  elRef: Ref<HTMLElement | null>
}

export function useTrayDrag(args: UseTrayDragArgs) {
  const { id, elRef } = args

  const { logWarning } = useMagicError({
    prefix: 'MagicTray',
    source: 'useTrayDrag',
  })

  const { initializeState } = useTrayState(toValue(id))
  const state = initializeState()

  const { flattenSnapPoints, isDraggableSide } = useTrayUtils()
  const emitter = useMagicEmitter()

  const {
    dimension,
    contentExtent,
    mapSnapPoint,
    mappedSnapPoints,
    snapPointAt,
    isSnapTarget,
    snapTo,
  } = useTraySnap({ id, state })

  // The original snap point input that opens a side, for snapTo
  function openSnapPoint(side: MagicTraySide) {
    const points = mappedSnapPoints(side)

    return points.length ? snapPointAt(side, points[0]!) : undefined
  }

  let resizeObserverEl: UseResizeObserverReturn | null = null

  const draggableSides = computed(() =>
    SIDES.filter((side) =>
      isDraggableSide({ snapPoints: state.options.snapPoints, side })
    )
  )

  // Clip-path from all four sides, negative insets clamped to keep it valid.
  // Each side and corner reads from an overridable variable: sides fall back to
  // the computed inset, corners to the shared --magic-tray-radius.
  const clipPath = computed(() => {
    const top = Math.max(0, state.dragged.top + state.magnetic.top)
    const right = Math.max(0, state.dragged.right + state.magnetic.right)
    const bottom = Math.max(0, state.dragged.bottom + state.magnetic.bottom)
    const left = Math.max(0, state.dragged.left + state.magnetic.left)

    return (
      `inset(` +
      `var(--magic-tray-clip-top, ${top}px) ` +
      `var(--magic-tray-clip-right, ${right}px) ` +
      `var(--magic-tray-clip-bottom, ${bottom}px) ` +
      `var(--magic-tray-clip-left, ${left}px) ` +
      `round ` +
      `var(--magic-tray-radius-top-left, var(--magic-tray-radius, 0px)) ` +
      `var(--magic-tray-radius-top-right, var(--magic-tray-radius, 0px)) ` +
      `var(--magic-tray-radius-bottom-right, var(--magic-tray-radius, 0px)) ` +
      `var(--magic-tray-radius-bottom-left, var(--magic-tray-radius, 0px)))`
    )
  })

  // Position a handle at the inner edge of the clip. The resting inset rides on
  // the box offset, the magnetic preview on a transform variable, so the per-frame
  // pull moves it on the compositor without a relayout (which flickers in Chrome).
  function handleStyle(side: MagicTraySide) {
    const rest = `${state.dragged[side]}px`
    const magnetic = `${state.magnetic[side]}px`

    switch (side) {
      case 'top':
        return {
          top: rest,
          left: '0px',
          right: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }

      case 'bottom':
        return {
          bottom: rest,
          left: '0px',
          right: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }

      case 'left':
        return {
          left: rest,
          top: '0px',
          bottom: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }

      case 'right':
        return {
          right: rest,
          top: '0px',
          bottom: '0px',
          '--magic-tray-handle-magnetic': magnetic,
        }
    }
  }

  async function getSizes() {
    const el = unrefElement(elRef)

    if (!el) {
      state.elRect = undefined
      return
    }

    // Retry across a few frames until the rect settles to a non-zero size
    let rect = el.getBoundingClientRect()
    let tries = 0
    while (rect.width === 0 && rect.height === 0 && tries < 5) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      rect = el.getBoundingClientRect()
      tries++
    }

    state.elRect = markRaw(rect)

    // Measure the reserved outer overshoot straight off the element padding
    const style = getComputedStyle(el)
    state.overshoot.outer = {
      top: parseFloat(style.paddingTop) || 0,
      right: parseFloat(style.paddingRight) || 0,
      bottom: parseFloat(style.paddingBottom) || 0,
      left: parseFloat(style.paddingLeft) || 0,
    }

    // Resolve the inner overshoot from its CSS variable into pixels
    const innerVar = style.getPropertyValue('--magic-tray-drag-overshoot-inner')
    const innerPixels = convertToPixels(innerVar)
    if (innerPixels === undefined) {
      logWarning(
        `--magic-tray-drag-overshoot-inner (${innerVar}) needs to be specified in px or rem`
      )
    }
    state.overshoot.inner = innerPixels ?? 0

    await nextTick()
  }

  // Programmatic snapTo via emitter
  async function snapToCallback(payload: MagicEmitterEvents['snapTo']) {
    const { snapPoint } = payload

    if (
      payload.id !== toValue(id) ||
      typeof snapPoint !== 'object' ||
      Array.isArray(snapPoint)
    ) {
      return
    }

    const { side, point } = snapPoint

    if (!draggableSides.value.includes(side)) {
      logWarning(`Cannot snap side "${side}" without snap points`)
      return
    }

    // Ensure an up to date rect before mapping the snap point
    await getSizes()

    if (contentExtent(side) && !isSnapTarget(side, point)) {
      logWarning(
        `Cannot snap side "${side}" to ${point}, which is neither a snap point nor inside a range`
      )
      return
    }

    snapTo({
      side,
      snapPoint: point,
      interpolate: true,
      duration: payload.duration,
    })
  }

  // Sides whose initial snap point could not be applied yet because the
  // element had no measurable extent — a transition or suspense boundary can
  // keep it detached at mount. The resize observer retries them as soon as
  // the element reports a real size.
  const pendingInitialSides = new Set<MagicTraySide>()

  // Apply the configured initial snap points, otherwise open each side.
  // With `transition`, seed the open extreme and interpolate in.
  async function applyInitial(sides?: Array<MagicTraySide>) {
    await getSizes()

    const { transition } = state.options.initial

    for (const side of sides ?? draggableSides.value) {
      pendingInitialSides.delete(side)

      if (!contentExtent(side)) {
        pendingInitialSides.add(side)
        continue
      }

      const configured = state.options.initial.snapPoints?.[side]
      const isValid = configured === undefined || isSnapTarget(side, configured)

      if (!isValid) {
        logWarning(
          `initial.snapPoints.${side} (${configured}) is neither a snap point nor inside a range and is ignored`
        )
      }

      const initial = (isValid ? configured : undefined) ?? openSnapPoint(side)

      if (initial === undefined) {
        continue
      }

      if (transition) {
        const start = mapSnapPoint(side, 0)
        if (start !== undefined) {
          state.dragged[side] = start
        }
        await snapTo({ side, snapPoint: initial, interpolate: true })
      } else {
        await snapTo({ side, snapPoint: initial, interpolate: false })
      }
    }
  }

  // Warn when a draggable side can neither fully open nor has an initial point
  function validateSnapPoints() {
    for (const side of draggableSides.value) {
      const points = flattenSnapPoints(state.options.snapPoints[side] ?? [])
      const canOpen = points.some((point) => parseFloat(String(point)) === 0)
      const hasInitial = state.options.initial.snapPoints?.[side] !== undefined

      if (!canOpen && !hasInitial) {
        logWarning(
          `Side “${side}” has no \`0\` snap point and no \`initial.snapPoints.${side}\`, ` +
            `so it rests at its smallest snap point instead of fully open. ` +
            `Add \`0\` to its snap points or set an initial snap point to make this explicit.`
        )
      }
    }
  }

  async function initialize() {
    validateSnapPoints()
    // Attach synchronously so an early programmatic snap is never missed
    emitter.on('snapTo', snapToCallback)
    await getSizes()
  }

  function destroy() {
    emitter.off('snapTo', snapToCallback)
    resizeObserverEl?.stop()
    state.elRect = undefined
  }

  onMounted(async () => {
    await initialize()
  })

  // Re-validate when the snap point configuration changes at runtime
  watch(
    () => [state.options.snapPoints, state.options.initial.snapPoints],
    () => validateSnapPoints(),
    { deep: true }
  )

  watch(
    () => unrefElement(elRef),
    async () => {
      await applyInitial()
    }
  )

  // Keep insets correct on resize by re-snapping to the active points
  resizeObserverEl = useResizeObserver(elRef, () => {
    useThrottleFn(async () => {
      await getSizes()
      if (pendingInitialSides.size) {
        await applyInitial([...pendingInitialSides])
      }
      for (const side of draggableSides.value) {
        const active = state.activeSnapPoint[side]
        if (active !== undefined) {
          await snapTo({ side, snapPoint: active, interpolate: false })
        }
      }
    }, 100)()
  })

  onScopeDispose(() => {
    destroy()
  }, true)

  return {
    draggableSides,
    clipPath,
    handleStyle,
    dimension,
  }
}
