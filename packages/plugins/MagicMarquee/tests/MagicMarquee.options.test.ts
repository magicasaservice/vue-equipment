import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicMarquee from '../src/components/MagicMarquee.vue'
import { useMagicMarquee } from '../src/composables/useMagicMarquee'

function createMarquee(
  marqueeId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicMarquee },
    setup() {
      const api = useMagicMarquee(marqueeId)
      return { ...api }
    },
    template: `
      <div>
        <span data-test-id="direction">{{ state.options.direction }}</span>
        <span data-test-id="speed">{{ state.options.speed }}</span>
        <MagicMarquee id="${marqueeId}" :options="options">
          <span>Item</span>
        </MagicMarquee>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicMarquee - Options', () => {
  describe('direction', () => {
    it('defaults to normal', async () => {
      render(createMarquee('opt-dir-default'))
      await nextTick()

      await expect
        .element(page.getByTestId('direction'))
        .toHaveTextContent('normal')
    })

    it('accepts reverse direction', async () => {
      render(createMarquee('opt-dir-reverse', { direction: 'reverse' }))
      await nextTick()

      await expect
        .element(page.getByTestId('direction'))
        .toHaveTextContent('reverse')
    })
  })

  describe('speed', () => {
    it('defaults to 1', async () => {
      render(createMarquee('opt-speed-default'))
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('1')
    })

    it('accepts custom speed', async () => {
      render(createMarquee('opt-speed-custom', { speed: 3 }))
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('3')
    })
  })
})
