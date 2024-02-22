import { toValue, computed, type MaybeRef } from 'vue'

export function useCommandScroll(parent: MaybeRef<HTMLElement | undefined>) {
  // Private state
  const mappedParent = computed(
    () => toValue(parent) || document.documentElement
  )

  const paddingTop = computed(() =>
    parseFloat(getCssValue(mappedParent.value, 'padding-top'))
  )

  const paddingBottom = computed(() =>
    parseFloat(getCssValue(mappedParent.value, 'padding-bottom'))
  )

  // Private functions
  function getCssValue(el: HTMLElement, style: string) {
    return getComputedStyle(el, null).getPropertyValue(style)
  }

  // Public methods
  function isElementAbove(element: MaybeRef<HTMLElement>): boolean {
    const elementRect = toValue(element).getBoundingClientRect()
    const parentRect = mappedParent.value.getBoundingClientRect()
    const parentTop = parentRect.top + paddingTop.value

    return elementRect.top < parentTop
  }

  function isElementBelow(element: MaybeRef<HTMLElement>): boolean {
    const elementRect = toValue(element).getBoundingClientRect()
    const parentRect = mappedParent.value.getBoundingClientRect()
    const parentBottom =
      parentRect.height + parentRect.top - paddingBottom.value

    return elementRect.bottom >= parentBottom
  }

  function findElement(id: string): HTMLElement | null {
    return mappedParent.value.querySelector(`[data-item-id="${id}"]`)
  }

  function scrollInFromTop(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect()
    const parentRect = mappedParent.value.getBoundingClientRect()
    const scrollAmount = elementRect.top - parentRect.top - paddingTop.value

    mappedParent.value.scrollBy({
      top: scrollAmount,
    })
  }

  function scrollInFromBottom(element: HTMLElement) {
    const elementRect = element.getBoundingClientRect()
    const parentRect = mappedParent.value.getBoundingClientRect()
    const scrollAmount =
      elementRect.bottom - parentRect.bottom + paddingBottom.value

    mappedParent.value.scrollBy({
      top: scrollAmount,
    })
  }

  return {
    isElementAbove,
    isElementBelow,
    findElement,
    scrollInFromTop,
    scrollInFromBottom,
  }
}
