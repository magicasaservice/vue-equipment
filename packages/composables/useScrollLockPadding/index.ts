import { ref } from 'vue'
import {
  matchClass,
  scrollbarGutterSupport,
  scrollbarWidth,
} from '@maas/vue-equipment/utils'

export type UseScrollLockPaddingArgs = {
  exclude: RegExp
}

export function useScrollLockPadding(args?: UseScrollLockPaddingArgs) {
  const exclude = args?.exclude || ''
  const positionFixedElements = ref<HTMLElement[]>([])

  function add() {
    if (typeof window === 'undefined') {
      return
    }

    const excludeRegEx = new RegExp(exclude)

    document.body.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth()}px`
    )

    positionFixedElements.value = [
      ...document.body.getElementsByTagName('*'),
    ].filter(
      (x) =>
        getComputedStyle(x, null).getPropertyValue('position') === 'fixed' &&
        getComputedStyle(x, null).getPropertyValue('right') === '0px' &&
        !matchClass(x, excludeRegEx)
    ) as HTMLElement[]

    switch (scrollbarGutterSupport()) {
      case true:
        document.documentElement.style.scrollbarGutter = 'stable'
        positionFixedElements.value.forEach((elem) => {
          elem.style.scrollbarGutter = 'stable'
          elem.style.overflow = 'auto'
        })
        break
      case false:
        document.body.style.paddingRight = 'var(--scrollbar-width)'
        positionFixedElements.value.forEach(
          (elem) => (elem.style.paddingRight = 'var(--scrollbar-width)')
        )
        break
    }
  }

  function remove() {
    document.documentElement.style.scrollbarGutter = ''
    document.body.style.removeProperty('--scrollbar-width')
    document.body.style.paddingRight = ''
    positionFixedElements.value.forEach((elem) => {
      elem.style.paddingRight = ''
      elem.style.scrollbarGutter = ''
      elem.style.overflow = ''
    })
  }

  return { add, remove }
}
