import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicNoise from '../src/components/MagicNoise.vue'

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

describe('MagicNoise - Rendering', () => {
  describe('container', () => {
    it('sets data-loading to true initially', async () => {
      render(createNoise())
      await nextTick()

      const el = document.querySelector('.magic-noise')
      expect(el!.getAttribute('data-loading')).toBe('true')
    })

    it('transitions data-loading to false when ready', async () => {
      render(createNoise())
      await nextTick()
      await new Promise((r) => setTimeout(r, 500))

      const el = document.querySelector('.magic-noise')
      expect(el!.getAttribute('data-loading')).toBe('false')
    })
  })

  describe('canvas elements', () => {
    it('renders main canvas element', async () => {
      render(createNoise())
      await nextTick()

      const canvas = document.querySelector('.magic-noise__canvas')
      expect(canvas).not.toBeNull()
      expect(canvas!.tagName.toLowerCase()).toBe('canvas')
    })

    it('renders off-screen canvas element', async () => {
      render(createNoise())
      await nextTick()

      const offCanvas = document.querySelector('.magic-noise__off-canvas')
      expect(offCanvas).not.toBeNull()
      expect(offCanvas!.tagName.toLowerCase()).toBe('canvas')
    })

    it('off-screen canvas is hidden', async () => {
      render(createNoise())
      await nextTick()

      const offCanvas = document.querySelector(
        '.magic-noise__off-canvas'
      ) as HTMLElement
      const style = window.getComputedStyle(offCanvas)
      expect(style.visibility).toBe('hidden')
    })
  })
})
