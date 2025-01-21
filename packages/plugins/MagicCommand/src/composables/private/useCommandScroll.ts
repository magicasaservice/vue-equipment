import { toValue, computed, type MaybeRef } from 'vue'
interface IsElementAboveArgs {
  element: MaybeRef<HTMLElement>
  ancestor?: HTMLElement
}

interface IsElementBelowArgs {
  element: MaybeRef<HTMLElement>
  ancestor?: HTMLElement
}

interface ScrollInFromTopArgs {
  element: MaybeRef<HTMLElement>
  ancestor?: HTMLElement
}

interface ScrollInFromBottomArgs {
  element: MaybeRef<HTMLElement>
  ancestor?: HTMLElement
}

export function useCommandScroll(parent: MaybeRef<HTMLElement | undefined>) {
  // Private state
  const mappedParent = computed(
    () => toValue(parent) || document.documentElement
  )

  // Private functions
  function getCssValue(el: HTMLElement, style: string) {
    return parseFloat(getComputedStyle(el, null).getPropertyValue(style))
  }

  function getPaddingTop(el: HTMLElement) {
    return getCssValue(el, 'padding-top')
  }

  function getPaddingBottom(el: HTMLElement) {
    return getCssValue(el, 'padding-bottom')
  }

  // Public methods
  function findElement(id: string): HTMLElement | null {
    return mappedParent.value.querySelector(`[data-id="${id}"]`)
  }

  function findScrollableAncestor(
    element: HTMLElement | null
  ): HTMLElement | undefined {
    if (!element || element === document.documentElement) {
      return undefined
    }

    const { overflowY } = window.getComputedStyle(element)
    const isScrollable =
      overflowY !== 'visible' &&
      overflowY !== 'hidden' &&
      element.scrollHeight > element.clientHeight

    return isScrollable
      ? element
      : findScrollableAncestor(element.parentElement)
  }

  function isElementAbove(args: IsElementAboveArgs): boolean {
    const { ancestor = mappedParent.value, element } = args

    const elementRect = toValue(element).getBoundingClientRect()
    const ancestorRect = ancestor.getBoundingClientRect()
    const ancestorPadding = getPaddingTop(ancestor)

    const ancestorTop = ancestorRect.top + ancestorPadding
    return elementRect.top < ancestorTop
  }

  function isElementBelow(args: IsElementBelowArgs): boolean {
    const { ancestor = mappedParent.value, element } = args

    const elementRect = toValue(element).getBoundingClientRect()
    const ancestorRect = ancestor.getBoundingClientRect()
    const ancestorPadding = getPaddingBottom(ancestor)

    const ancestorBottom =
      ancestorRect.height + ancestorRect.top - ancestorPadding
    return elementRect.bottom >= ancestorBottom
  }

  function scrollInFromTop(args: ScrollInFromTopArgs) {
    const { ancestor = mappedParent.value, element } = args

    const elementRect = toValue(element).getBoundingClientRect()
    const ancestorRect = ancestor.getBoundingClientRect()
    const ancestorPadding = getPaddingTop(ancestor)

    const scrollAmount = elementRect.top - ancestorRect.top - ancestorPadding
    ancestor.scrollBy({
      top: scrollAmount,
    })
  }

  function scrollInFromBottom(args: ScrollInFromBottomArgs) {
    const { ancestor = mappedParent.value, element } = args

    const elementRect = toValue(element).getBoundingClientRect()
    const ancestorRect = ancestor.getBoundingClientRect()
    const ancestorPadding = getPaddingBottom(ancestor)

    const scrollAmount =
      elementRect.bottom - ancestorRect.bottom + ancestorPadding
    ancestor.scrollBy({
      top: scrollAmount,
    })
  }

  return {
    findElement,
    findScrollableAncestor,
    isElementAbove,
    isElementBelow,
    scrollInFromTop,
    scrollInFromBottom,
  }
}
