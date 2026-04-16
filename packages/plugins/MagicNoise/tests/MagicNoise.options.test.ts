import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick, ref } from 'vue'
import MagicNoise from '../src/components/MagicNoise.vue'

function getCanvasData(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  let hash = ''
  for (let i = 0; i < data.length; i += 100) {
    hash += data[i]!.toString(16)
  }
  return hash
}

function getCanvasPixels(canvas: HTMLCanvasElement): Uint8ClampedArray | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data
}

function createNoise(
  options: Record<string, unknown> = {},
  pause = false
) {
  return defineComponent({
    components: { MagicNoise },
    template: `
      <div style="width:100px;height:100px">
        <MagicNoise :options="options" :pause="${pause}" />
      </div>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicNoise - Options', () => {
  describe('pause prop', () => {
    it('pause prop stops canvas animation updates', async () => {
      const screen = render(
        defineComponent({
          components: { MagicNoise },
          setup() {
            const paused = ref(false)
            return { paused }
          },
          template: `
            <div style="width:100px;height:100px">
              <MagicNoise :pause="paused" :options="{ fps: 60 }" />
              <button data-test-id="pause" @click="paused = true" style="position:relative;z-index:10000">Pause</button>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 600))

      const canvas = document.querySelector(
        '.magic-noise__canvas'
      ) as HTMLCanvasElement
      expect(canvas).not.toBeNull()

      // Now pause via trusted click
      await screen.getByTestId('pause').click()
      await nextTick()
      await new Promise((r) => setTimeout(r, 200))

      // After pause, canvas should stop changing
      const snap1 = getCanvasData(canvas)
      await new Promise((r) => setTimeout(r, 200))
      const snap2 = getCanvasData(canvas)

      expect(snap1).toBe(snap2)
    })

    it('component still initializes when paused from start', async () => {
      render(createNoise({}, true))
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const el = document.querySelector('.magic-noise')
      expect(el!.getAttribute('data-loading')).toBe('false')
    })
  })

  describe('options prop', () => {
    it('different pixelSize values produce different noise patterns', async () => {
      // Render two noise components side by side with different pixelSize
      render(
        defineComponent({
          components: { MagicNoise },
          template: `
            <div>
              <div style="width:100px;height:100px" class="noise-small">
                <MagicNoise :options="{ pixelSize: 2 }" :pause="true" />
              </div>
              <div style="width:100px;height:100px" class="noise-large">
                <MagicNoise :options="{ pixelSize: 8 }" :pause="true" />
              </div>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const offCanvases = document.querySelectorAll(
        '.magic-noise__off-canvas'
      ) as NodeListOf<HTMLCanvasElement>
      expect(offCanvases.length).toBe(2)

      // The off-canvas dimensions are rounded to nearest multiple of pixelSize
      // so different pixelSize should produce different off-canvas sizes
      const canvas1 = offCanvases[0]!
      const canvas2 = offCanvases[1]!
      expect(canvas1.width).toBeGreaterThan(0)
      expect(canvas2.width).toBeGreaterThan(0)

      // pixelSize=2 should produce a larger off-canvas than pixelSize=8
      // because the grid is finer (more pixels per area)
      const data1 = getCanvasData(canvas1)
      const data2 = getCanvasData(canvas2)
      expect(data1).not.toBe(data2)
    })

    it('color option affects rendered pixel color', async () => {
      render(createNoise({ color: '#ff0000' }, true))
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const offCanvas = document.querySelector(
        '.magic-noise__off-canvas'
      ) as HTMLCanvasElement
      const pixels = getCanvasPixels(offCanvas)
      expect(pixels).not.toBeNull()

      // Find any non-transparent pixel — it should have red channel > 0
      let foundRedPixel = false
      for (let i = 0; i < pixels!.length; i += 4) {
        const r = pixels![i]!
        const g = pixels![i + 1]!
        const b = pixels![i + 2]!
        const a = pixels![i + 3]!
        if (a > 0 && r > 0) {
          // Red noise: red channel should be dominant
          expect(r).toBeGreaterThan(0)
          expect(g).toBe(0)
          expect(b).toBe(0)
          foundRedPixel = true
          break
        }
      }
      expect(foundRedPixel).toBe(true)
    })

    it('white color produces white pixels on offscreen canvas', async () => {
      render(createNoise({ color: 'white' }, true))
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const offCanvas = document.querySelector(
        '.magic-noise__off-canvas'
      ) as HTMLCanvasElement
      const pixels = getCanvasPixels(offCanvas)
      expect(pixels).not.toBeNull()

      // Find a non-transparent pixel — RGB channels should all be 255
      let foundWhitePixel = false
      for (let i = 0; i < pixels!.length; i += 4) {
        const r = pixels![i]!
        const g = pixels![i + 1]!
        const b = pixels![i + 2]!
        const a = pixels![i + 3]!
        if (a > 0 && r > 0) {
          expect(r).toBe(255)
          expect(g).toBe(255)
          expect(b).toBe(255)
          foundWhitePixel = true
          break
        }
      }
      expect(foundWhitePixel).toBe(true)
    })

    it('tiles option affects offscreen canvas dimensions', async () => {
      // Offscreen canvas size = maxCanvasDim / sqrt(tiles)
      // So tiles=2 produces larger offscreen canvas than tiles=32
      render(
        defineComponent({
          components: { MagicNoise },
          template: `
            <div>
              <div style="width:100px;height:100px" class="noise-few">
                <MagicNoise :options="{ tiles: 2 }" :pause="true" />
              </div>
              <div style="width:100px;height:100px" class="noise-many">
                <MagicNoise :options="{ tiles: 32 }" :pause="true" />
              </div>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const offCanvases = document.querySelectorAll(
        '.magic-noise__off-canvas'
      ) as NodeListOf<HTMLCanvasElement>
      expect(offCanvases.length).toBe(2)

      const fewTilesCanvas = offCanvases[0]!
      const manyTilesCanvas = offCanvases[1]!

      // Both canvases should be initialized
      expect(fewTilesCanvas.width).toBeGreaterThan(0)
      expect(manyTilesCanvas.width).toBeGreaterThan(0)

      // Fewer tiles = larger offscreen canvas (inversely proportional via sqrt)
      const fewTilesArea = fewTilesCanvas.width * fewTilesCanvas.height
      const manyTilesArea = manyTilesCanvas.width * manyTilesCanvas.height
      expect(fewTilesArea).toBeGreaterThan(manyTilesArea)
    })

    it('alpha option enables transparent canvas backing', async () => {
      render(createNoise({ alpha: true, color: 'rgba(255,0,0,0.5)' }, true))
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const offCanvas = document.querySelector(
        '.magic-noise__off-canvas'
      ) as HTMLCanvasElement
      const pixels = getCanvasPixels(offCanvas)
      expect(pixels).not.toBeNull()

      // With alpha=true and semi-transparent color, alpha values
      // should include partially transparent pixels (not all 0 or 255)
      let foundSemiTransparent = false
      for (let i = 0; i < pixels!.length; i += 4) {
        const a = pixels![i + 3]!
        if (a > 0 && a < 255) {
          foundSemiTransparent = true
          break
        }
      }
      expect(foundSemiTransparent).toBe(true)
    })

    it('display-p3 colorSpace initializes without error', async () => {
      render(createNoise({ colorSpace: 'display-p3' }, true))
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      // Verify the component fully initialized with display-p3
      expect(
        document.querySelector('.magic-noise')!.getAttribute('data-loading')
      ).toBe('false')

      // Canvas should still be functional
      const offCanvas = document.querySelector(
        '.magic-noise__off-canvas'
      ) as HTMLCanvasElement
      expect(offCanvas.width).toBeGreaterThan(0)
      expect(offCanvas.height).toBeGreaterThan(0)
    })
  })
})
