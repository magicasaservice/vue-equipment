import { onMounted, onUnmounted } from 'vue'

export type UseViewportDimensionsOptions = {
  width?: false | string
  height?: false | string
  initialWidth?: false | string
  initialHeight?: false | string
}

export function useViewportDimensions(options?: UseViewportDimensionsOptions) {
  const mappedOptions = {
    width: '--vw',
    height: '--vh',
    initialWidth: '--initial-vw',
    initialHeight: '--initial-vh',
    ...options,
  }

  const setViewportWidth = (initial?: boolean) => {
    const vw = Number(window.innerWidth * 0.01).toFixed(2)

    if (mappedOptions.width) {
      document.documentElement.style.setProperty(mappedOptions.width, `${vw}px`)
    }

    if (initial && mappedOptions.initialWidth) {
      document.documentElement.style.setProperty(
        mappedOptions.initialWidth,
        `${vw}px`
      )
    }
  }

  const setViewportHeight = (initial?: boolean) => {
    const vh = Number(window.innerHeight * 0.01).toFixed(2)

    if (mappedOptions.height) {
      document.documentElement.style.setProperty(
        mappedOptions.height || '--vh',
        `${vh}px`
      )
    }

    if (initial && mappedOptions.initialHeight) {
      document.documentElement.style.setProperty(
        mappedOptions.initialHeight || '--initial-vh',
        `${vh}px`
      )
    }
  }

  const setDimensions = () => {
    setViewportWidth()
    setViewportHeight()
  }

  onMounted(() => {
    setViewportWidth(true)
    setViewportHeight(true)

    window.addEventListener('resize', setDimensions, { passive: true })
  })

  onUnmounted(() => {
    window.addEventListener('resize', setDimensions, { passive: true })
  })
}
