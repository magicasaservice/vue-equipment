import { toValue, type MaybeRef } from 'vue'
import { unrefElement } from '@vueuse/core'
import { type DefaultOptions } from '../../utils/defaultOptions'

interface UseDrawerGuardsArgs {
  elRef: MaybeRef<HTMLDivElement | undefined>
  absDirectionX: MaybeRef<'with' | 'against' | undefined>
  absDirectionY: MaybeRef<'with' | 'against' | undefined>
  position: MaybeRef<DefaultOptions['position']>
}

export function useDrawerGuards(args: UseDrawerGuardsArgs) {
  const { elRef, absDirectionX, absDirectionY, position } = args

  const drawer = unrefElement(elRef)
  const isHoverSupported = matchMedia('(hover: hover)').matches

  function canDrag(el: EventTarget) {
    let element = el as HTMLElement

    // Device is not a touch device,
    // allow dragging
    if (isHoverSupported) {
      return true
    }

    while (element) {
      switch (position) {
        case 'bottom':
          // Check if the element is scrollable
          if (element.scrollHeight > element.clientHeight) {
            // User has already scrolled,
            // prevent dragging
            if (element.scrollTop !== 0) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionY) === 'with') {
              return false
            }

            // All elements traversed,
            // allow dragging
            if (element === drawer) {
              return true
            }
          }
          break

        case 'top':
          // Check if the element is scrollable
          if (element.scrollHeight > element.clientHeight) {
            // User has already scrolled,
            // prevent dragging
            if (
              element.scrollTop !==
              element.scrollHeight - element.clientHeight
            ) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionY) === 'with') {
              return false
            }

            // All elements traversed,
            // allow dragging
            if (element === drawer) {
              return true
            }
          }
          break

        case 'left':
          // Check if the element is scrollable
          if (element.scrollWidth > element.clientWidth) {
            // User has already scrolled,
            // prevent dragging
            if (element.scrollLeft !== 0) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionX) === 'with') {
              return false
            }

            // All elements traversed,
            // allow dragging
            if (element === drawer) {
              return true
            }
          }
          break

        case 'right':
          // Check if the element is scrollable
          if (element.scrollWidth > element.clientWidth) {
            // User has already scrolled,
            // prevent dragging
            if (
              element.scrollLeft !==
              element.scrollWidth - element.clientWidth
            ) {
              return false
            }

            // User scrolls for the first time,
            // prevent dragging
            if (toValue(absDirectionX) === 'with') {
              return false
            }

            // All elements traversed,
            // allow dragging
            if (element === drawer) {
              return true
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

  function lockScroll(el: EventTarget): HTMLElement | undefined {
    let element = el as HTMLElement

    // Device is not a touch device,
    // cancel scroll lock
    if (isHoverSupported) {
      return
    }

    while (element) {
      switch (position) {
        case 'bottom':
          // Check if the element is scrollable
          if (element.scrollHeight > element.clientHeight) {
            // All elements traversed,
            // cancel scroll lock
            if (element === drawer) {
              return undefined
            }

            // Element is scrolled to the top,
            // user tries to drag,
            // lock scrolling
            if (element.scrollTop === 0) {
              if (toValue(absDirectionY) === 'against') {
                return element
              }
            }
          }
          break

        case 'top':
          // Check if the element is scrollable
          if (element.scrollHeight > element.clientHeight) {
            // All elements traversed,
            // cancel scroll lock
            if (element === drawer) {
              return undefined
            }

            // Element is scrolled to the bottom,
            // user tries to drag,
            // lock scrolling
            if (
              element.scrollTop ===
              element.scrollHeight - element.clientHeight
            ) {
              if (toValue(absDirectionY) === 'against') {
                return element
              }
            }
          }
          break

        case 'left':
          // Check if the element is scrollable
          if (element.scrollWidth > element.clientWidth) {
            // All elements traversed,
            // cancel scroll lock
            if (element === drawer) {
              return undefined
            }

            // Element is scrolled to the left,
            // user tries to drag,
            // lock scrolling
            if (element.scrollLeft === 0) {
              if (toValue(absDirectionX) === 'against') {
                return element
              }
            }
          }
          break

        case 'right':
          // Check if the element is scrollable
          if (element.scrollWidth > element.clientWidth) {
            // All elements traversed,
            // cancel scroll lock
            if (element === drawer) {
              return undefined
            }

            // Element is scrolled to the right,
            // user tries to drag,
            // lock scrolling
            if (
              element.scrollLeft ===
              element.scrollWidth - element.clientWidth
            ) {
              if (toValue(absDirectionX) === 'against') {
                return element
              }
            }
          }
          break
      }

      // Move up the DOM
      element = element.parentNode as HTMLElement
    }
  }

  return {
    canDrag,
    lockScroll,
  }
}
