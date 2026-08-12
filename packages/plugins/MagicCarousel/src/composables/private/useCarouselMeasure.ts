import { computed, watch, type MaybeRef } from 'vue'
import { useResizeObserver, useMutationObserver } from '@vueuse/core'
import { convertToPixels } from '@maas/vue-equipment/utils'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useCarouselState } from './useCarouselState'

export function useCarouselMeasure(instanceId: MaybeRef<string>) {
  // Private state
  const { initializeState } = useCarouselState(instanceId)
  const state = initializeState()

  const magicError: UseMagicErrorReturn = useMagicError({
    prefix: 'MagicCarousel',
    source: 'useCarouselMeasure',
  })

  const mappedViewEl = computed(() => state.viewEl)

  // Private functions
  function resolveInlineLength(value: string, reference: number): number {
    if (!value || value === 'auto' || value === 'normal') {
      return 0
    }

    if (value.endsWith('%')) {
      return (parseFloat(value) / 100) * reference
    }

    return parseFloat(value) || 0
  }

  function sortSlides() {
    const sorted = [...state.slides].sort((a, b) => {
      if (!a.el || !b.el) {
        return 0
      }

      return a.el.compareDocumentPosition(b.el) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1
    })

    // Only replace the array when the order changed, the watcher would recurse otherwise
    if (sorted.some((slide, index) => slide !== state.slides[index])) {
      state.slides = sorted
    }
  }

  function measureView(el: HTMLElement) {
    const styles = window.getComputedStyle(el)

    const width = el.clientWidth
    const scrollWidth = el.scrollWidth

    state.measurements = {
      scrollWidth: scrollWidth,
      width: width,
      range: Math.max(scrollWidth - width, 0),
      gap: parseFloat(styles.columnGap) || 0,
      paddingStart: resolveInlineLength(styles.paddingInlineStart, width),
      paddingEnd: resolveInlineLength(styles.paddingInlineEnd, width),
      scrollPaddingStart: resolveInlineLength(
        styles.scrollPaddingInlineStart,
        width
      ),
      scrollPaddingEnd: resolveInlineLength(
        styles.scrollPaddingInlineEnd,
        width
      ),
      direction: el.closest('[dir="rtl"]') ? -1 : 1,
    }

    const snapType =
      styles.getPropertyValue('--magic-carousel-snap-type').trim() ||
      'x mandatory'

    state.hasSnap = !snapType.startsWith('none')
    state.snapMandatory = snapType.includes('mandatory')

    const overshootValue = styles.getPropertyValue(
      '--magic-carousel-drag-overshoot'
    )
    const overshootPixels = convertToPixels(overshootValue)

    if (overshootValue && overshootPixels === undefined) {
      magicError.logWarning(
        `--magic-carousel-drag-overshoot (${overshootValue}) needs to be specified in px or rem`
      )
    }

    state.overshoot = overshootPixels ?? 0

    const hasTouch = 'ontouchmove' in window
    const hasMouse = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    state.draggable =
      !state.options.disabled &&
      !hasTouch &&
      hasMouse &&
      state.measurements.range > 0
  }

  function measureSlides(el: HTMLElement) {
    const viewRect = el.getBoundingClientRect()
    const { width, scrollPaddingStart, scrollPaddingEnd } = state.measurements

    const snapPositions: Array<number> = []

    for (const slide of state.slides) {
      if (!slide.el) {
        snapPositions.push(0)
        continue
      }

      const rect = slide.el.getBoundingClientRect()
      const styles = window.getComputedStyle(slide.el)

      slide.width = slide.el.clientWidth

      const left = rect.left - viewRect.left + el.scrollLeft - slide.loopOffset

      const alignValues = styles.scrollSnapAlign.split(' ')
      const align = alignValues[alignValues.length - 1]

      const marginStart = parseFloat(styles.scrollMarginInlineStart) || 0
      const marginEnd = parseFloat(styles.scrollMarginInlineEnd) || 0

      const areaStart = left - marginStart
      const areaEnd = left + slide.width + marginEnd

      switch (align) {
        case 'end':
          snapPositions.push(areaEnd - width + scrollPaddingEnd)
          break
        case 'center':
          snapPositions.push((areaStart + areaEnd) / 2 - width / 2)
          break
        default:
          snapPositions.push(areaStart - scrollPaddingStart)
      }
    }

    state.snapPositions = snapPositions
  }

  // Public functions
  function measure() {
    const el = state.viewEl

    if (!el) {
      return
    }

    sortSlides()
    measureView(el)
    measureSlides(el)
  }

  useResizeObserver(mappedViewEl, measure)

  useMutationObserver(mappedViewEl, measure, {
    childList: true,
    subtree: true,
  })

  watch(
    () => [state.viewEl, state.slides.length],
    () => measure()
  )

  return {
    measure,
  }
}
