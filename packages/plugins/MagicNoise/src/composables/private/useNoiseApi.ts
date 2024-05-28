import { shallowRef, ref, reactive, type Ref, type MaybeRef } from 'vue'
import { defu } from 'defu'
import {
  useElementSize,
  useDevicePixelRatio,
  useThrottleFn,
  useRafFn,
} from '@vueuse/core'
import { defaultOptions } from '../../utils/defaultOptions'
import type { MagicNoiseOptions, Pixel, RafControls } from '../../types'

type UseNoiseApiArgs = {
  canvasRef: Ref<HTMLCanvasElement | undefined>
  offCanvasRef: Ref<HTMLCanvasElement | undefined>
  options?: MaybeRef<MagicNoiseOptions>
}

export function useNoiseApi({
  canvasRef,
  offCanvasRef,
  options,
}: UseNoiseApiArgs) {
  const tiles = shallowRef<Pixel[]>([])
  const pixels = shallowRef<Pixel[]>([])
  const isReady = ref(false)

  let context = shallowRef<CanvasRenderingContext2D | null>(null)
  let offContext = shallowRef<CanvasRenderingContext2D | null>(null)

  const { width, height } = useElementSize(canvasRef)
  const { pixelRatio } = useDevicePixelRatio()

  const drawControls = shallowRef<RafControls | undefined>(undefined)
  const transferControls = shallowRef<RafControls | undefined>(undefined)

  const dimensions = reactive({
    width: 0,
    height: 0,
    offWidth: 0,
    offHeight: 0,
  })

  const mappedOptions = defu(options, defaultOptions)

  function findBiggerNumber(target: number, divisor: number) {
    const remainder = target % divisor
    if (remainder === 0) {
      return target
    }

    const biggerNumber = Math.ceil(target / divisor) * divisor
    return biggerNumber
  }

  function resetContexts() {
    context.value = null
    offContext.value = null
  }

  function resetPixels() {
    pixels.value = []
  }

  type calculatePixelArgs = {
    width: number
    height: number
    pixelSize: number
    rotation?: boolean
  }

  function calculatePixels({
    width,
    height,
    pixelSize,
    rotation,
  }: calculatePixelArgs) {
    if (pixelSize <= 0) {
      return []
    }

    const pixels: Pixel[] = []

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        let radian: number | undefined
        if (rotation) {
          const angle = getRandomRotationAngle()
          radian = getRadianFromAngle(angle)
        }

        const pixel: Pixel = {
          w: pixelSize,
          h: pixelSize,
          x: x,
          y: y,
          r: radian,
        }
        pixels.push(pixel)
      }
    }

    return pixels
  }

  function calculate() {
    const offCanvasHeight = offCanvasRef.value?.height
    const offCanvasWidth = offCanvasRef.value?.width

    if (!offCanvasHeight || !offCanvasWidth) return

    // Calculate pixels
    pixels.value = calculatePixels({
      width: offCanvasWidth,
      height: offCanvasHeight,
      pixelSize: mappedOptions.pixelSize * pixelRatio.value,
    })

    tiles.value = calculatePixels({
      width: dimensions.width,
      height: dimensions.height,
      pixelSize: dimensions.offWidth,
      rotation: true,
    })

    isReady.value = true

    // Draw and transfer once to start
    draw()
    rotateAndTransfer()
  }

  function initialize() {
    resetContexts()
    if (!canvasRef.value || !offCanvasRef.value) return

    // Adjusted dimensions
    const maxCanvasDim = Math.max(width.value, height.value) * pixelRatio.value
    const maxOffCanvasDim = maxCanvasDim / Math.sqrt(mappedOptions.tiles)

    // Round up to nearest pixelSize
    const adjustedOffCanvasDim = findBiggerNumber(
      maxOffCanvasDim,
      mappedOptions.pixelSize
    )

    // Save and set dimensions
    // Saving the numbers here for use in the calculatePixels function
    canvasRef.value.width = dimensions.width = maxCanvasDim
    canvasRef.value.height = dimensions.height = maxCanvasDim

    offCanvasRef.value.width = dimensions.offWidth = adjustedOffCanvasDim
    offCanvasRef.value.height = dimensions.offHeight = adjustedOffCanvasDim

    context.value = canvasRef.value.getContext('2d', {
      alpha: false,
    })
    offContext.value = offCanvasRef.value.getContext('2d', {
      alpha: false,
      willReadFrequently: true,
    })

    resetPixels()
    calculate()
  }

  function getRandomRotationAngle() {
    return [0, 90, 180, 270][Math.floor(Math.random() * 4)]
  }

  function getRadianFromAngle(angle: number) {
    return (angle * Math.PI) / 180
  }

  function rotateAndTransfer() {
    if (
      !canvasRef.value ||
      !offCanvasRef.value ||
      !context.value ||
      !offContext.value
    ) {
      return
    }

    context.value.clearRect(0, 0, dimensions.width, dimensions.height)

    for (const tile of tiles.value) {
      // Move to center of pixel position, rotate, and draw
      context.value.translate(tile.x + tile.w / 2, tile.y + tile.h / 2)
      context.value.rotate(tile.r!)
      context.value.drawImage(offCanvasRef.value, -tile.w / 2, -tile.h / 2)
      context.value.resetTransform()
    }
  }

  function throttledRotateAndTransfer() {
    transferControls.value?.pause()

    const throttled = useThrottleFn(() => {
      rotateAndTransfer()
    }, 600 / mappedOptions.fps)

    transferControls.value = useRafFn(throttled)
  }

  function draw() {
    if (!offContext.value || !offCanvasRef.value) return

    offContext.value.clearRect(
      0,
      0,
      offCanvasRef.value.width,
      offCanvasRef.value.height
    )

    for (const pixel of pixels.value) {
      if (Math.random() > 0.5) {
        offContext.value.fillStyle = mappedOptions.color
        offContext.value.fillRect(pixel.x, pixel.y, pixel.w, pixel.h)
      }
    }
  }

  function throttledDraw() {
    drawControls.value?.pause()
    const throttled = useThrottleFn(() => {
      draw()
    }, 600 / mappedOptions.fps)

    drawControls.value = useRafFn(throttled)
  }

  return {
    initialize,
    draw,
    rotateAndTransfer,
    throttledDraw,
    throttledRotateAndTransfer,
    isReady,
    drawControls,
    transferControls,
  }
}
