import { computed, toValue, type Ref, type MaybeRef } from 'vue'
import { unrefElement } from '@vueuse/core'
import type { DrawerSnapPoint, DrawerDefaultOptions } from '../../types'

interface UseDrawerGuardsArgs {
  elRef: Ref<HTMLElement | null>
  absDirectionX: MaybeRef<'with' | 'against' | undefined>
  absDirectionY: MaybeRef<'with' | 'against' | undefined>
  position: MaybeRef<DrawerDefaultOptions['position']>
  activeSnapPoint: MaybeRef<DrawerSnapPoint | undefined>
}

export function useDrawerGuards(args: UseDrawerGuardsArgs) {
  const { elRef, absDirectionX, absDirectionY, position, activeSnapPoint } =
    args

  const hasCursor = computed(() => {
    return typeof window !== 'undefined' && matchMedia('(hover: hover)').matches
  })

  const canSnap = computed(() => {
    return toValue(activeSnapPoint) !== 1 && !!toValue(activeSnapPoint)
  })

  // Private functions
  function canScrollY(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    const overflowY = style.overflowY

    const canScroll = ['auto', 'scroll'].includes(overflowY)
    const hasOverflow =
      Math.round(element.scrollHeight) > Math.round(element.clientHeight)

    return canScroll && hasOverflow
  }

  function canScrollX(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    const overflowX = style.overflowX

    const canScroll = ['auto', 'scroll'].includes(overflowX)
    const hasOverflow =
      Math.round(element.scrollWidth) > Math.round(element.clientWidth)

    return canScroll && hasOverflow
  }

  // Public functions
  function canDrag(el: EventTarget) {
    let element = el as HTMLElement

    // Device is not a touch device,
    // allow dragging
    if (hasCursor.value) {
      return true
    }

    // Drawer is not at end,
    // allow dragging
    if (canSnap.value) {
      return true
    }

    while (element) {
      // All elements traversed,
      // allow dragging
      if (element === unrefElement(elRef)) {
        return true
      }

      switch (position) {
        case 'bottom':
          // Check if the element is scrollable
          if (canScrollY(element)) {
            // User has already scrolled,
            // prevent dragging
            if (element.scrollTop > 0) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionY) === 'with') {
              return false
            }

            // Direction is not set yet,
            // prevent dragging
            if (!toValue(absDirectionY)) {
              return false
            }
          }
          break

        case 'top':
          // Check if the element is scrollable
          if (canScrollY(element)) {
            // User has already scrolled,
            // prevent dragging
            const maxScroll = element.scrollHeight - element.clientHeight
            if (element.scrollTop < maxScroll) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionY) === 'with') {
              return false
            }

            // Direction is not set yet,
            // prevent dragging
            if (!toValue(absDirectionY)) {
              return false
            }
          }
          break

        case 'right':
          // Check if the element is scrollable
          if (canScrollX(element)) {
            // User has already scrolled,
            // prevent dragging
            if (element.scrollLeft > 0) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionX) === 'with') {
              return false
            }

            // Direction is not set yet,
            // prevent dragging
            if (!toValue(absDirectionX)) {
              return false
            }
          }
          break

        case 'left':
          // Check if the element is scrollable
          if (canScrollX(element)) {
            // User has already scrolled,
            // prevent dragging
            const maxScroll = element.scrollWidth - element.clientWidth
            if (element.scrollLeft < maxScroll) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionX) === 'with') {
              return false
            }

            // Direction is not set yet,
            // prevent dragging
            if (!toValue(absDirectionX)) {
              return false
            }
          }
          break
      }

      // Traverse up the DOM
      element = element.parentNode as HTMLElement
    }

    // All checks passed,
    // allow dragging
    return true
  }

  function canInterpolate(el: EventTarget) {
    let element = el as HTMLElement

    // Device is not a touch device,
    // allow interpolation
    if (hasCursor.value) {
      return true
    }

    while (element) {
      switch (position) {
        case 'bottom':
        case 'top':
          // Element can be scrolled,
          // let scroll lock handle it
          if (canScrollY(element)) {
            return false
          }

          break

        case 'left':
        case 'right':
          // Element can be scrolled,
          // let scroll lock handle it
          if (canScrollX(element)) {
            return false
          }

          break
      }

      // All elements traversed,
      // allow interpolation
      if (element === unrefElement(elRef)) {
        return true
      }

      element = element.parentNode as HTMLElement
    }
  }

  function lockScroll(el: EventTarget): HTMLElement | undefined {
    let element = el as HTMLElement

    // Device is not a touch device,
    // cancel scroll lock
    if (hasCursor.value && !canSnap.value) {
      return undefined
    }

    while (element) {
      // All elements traversed,
      // cancel scroll lock
      // Check needs to happen here
      if (element === unrefElement(elRef)) {
        return undefined
      }

      switch (position) {
        case 'bottom':
          // Check if the element is scrollable
          if (canScrollY(element)) {
            // Element is scrolled to the end,
            // user tries to drag,
            // lock scroll
            if (element.scrollTop === 0 || canSnap.value) {
              if (toValue(absDirectionY) === 'against') {
                return element
              }
            }

            // Scrollable element has been identified
            // No need to traverse up the DOM
            return undefined
          }
          break

        case 'top':
          // Check if the element is scrollable
          if (canScrollY(element)) {
            // Element is scrolled to the end,
            // user tries to drag,
            // lock scroll
            const maxScroll = element.scrollHeight - element.clientHeight
            if (element.scrollTop === maxScroll || canSnap.value) {
              if (toValue(absDirectionY) === 'against') {
                return element
              }
            }

            // Scrollable element has been identified
            // No need to traverse up the DOM
            return undefined
          }
          break

        case 'right':
          // Check if the element is scrollable
          if (canScrollX(element)) {
            // Element is scrolled to the end,
            // user tries to drag,
            // lock scroll
            if (element.scrollLeft === 0 || canSnap.value) {
              if (toValue(absDirectionX) === 'against') {
                return element
              }
            }

            // Scrollable element has been identified
            // No need to traverse up the DOM
            return undefined
          }
          break

        case 'left':
          // Check if the element is scrollable
          if (canScrollX(element)) {
            // Element is scrolled to the end,
            // user tries to drag,
            // lock scroll
            const maxScroll = element.scrollWidth - element.clientWidth
            if (element.scrollLeft === maxScroll || canSnap.value) {
              if (toValue(absDirectionX) === 'against') {
                return element
              }
            }

            // Scrollable element has been identified
            // No need to traverse up the DOM
            return undefined
          }
          break
      }

      // Move up the DOM
      element = element.parentNode as HTMLElement
    }
  }

  return {
    canDrag,
    canInterpolate,
    lockScroll,
  }
}
