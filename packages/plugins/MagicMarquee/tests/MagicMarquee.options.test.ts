import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicMarquee from '../src/components/MagicMarquee.vue'
import { useMagicMarquee } from '../src/composables/useMagicMarquee'
import { MarqueeId, TestId } from './enums'

// ─── Factory ─────────────────────────────────────────────────────────────────

function createMarquee(
  marqueeId: MarqueeId,
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
        <span data-test-id="${TestId.Direction}">{{ state.options.direction }}</span>
        <span data-test-id="${TestId.Speed}">{{ state.options.speed }}</span>
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicMarquee - Options', () => {
  describe('direction', () => {
    it('defaults to normal', async () => {
      render(createMarquee(MarqueeId.OptDirDefault))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Direction))
        .toHaveTextContent('normal')
    })

    it('accepts reverse direction', async () => {
      render(createMarquee(MarqueeId.OptDirReverse, { direction: 'reverse' }))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Direction))
        .toHaveTextContent('reverse')
    })
  })

  describe('speed', () => {
    it('defaults to 1', async () => {
      render(createMarquee(MarqueeId.OptSpeedDefault))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('1')
    })

    it('accepts custom speed', async () => {
      render(createMarquee(MarqueeId.OptSpeedCustom, { speed: 3 }))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('3')
    })
  })
})
