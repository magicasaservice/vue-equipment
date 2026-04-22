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
        <span data-test-id="${TestId.Id}">{{ state.id }}</span>
        <span data-test-id="${TestId.Playing}">{{ state.playing }}</span>
        <span data-test-id="${TestId.IsPlaying}">{{ isPlaying }}</span>
        <button data-test-id="${TestId.Pause}" @click="pause()">Pause</button>
        <button data-test-id="${TestId.Play}" @click="play()">Play</button>
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

describe('MagicMarquee - State', () => {
  describe('shared state', () => {
    it('composable and component share state via id', async () => {
      render(createMarquee(MarqueeId.StateShared))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Id))
        .toHaveTextContent(MarqueeId.StateShared)
      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')
    })

    it('state mutations from composable reflect in state', async () => {
      const screen = render(createMarquee(MarqueeId.StateMutate))
      await nextTick()

      await screen.getByTestId(TestId.Pause).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Play).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')
    })
  })

  describe('independent instances', () => {
    it('two marquees have independent state', async () => {
      let api1: ReturnType<typeof useMagicMarquee> | undefined
      let api2: ReturnType<typeof useMagicMarquee> | undefined

      render(
        defineComponent({
          components: { MagicMarquee },
          setup() {
            api1 = useMagicMarquee(MarqueeId.StateInd1)
            api2 = useMagicMarquee(MarqueeId.StateInd2)
            return {}
          },
          template: `
            <div>
              <MagicMarquee id="${MarqueeId.StateInd1}"><span>A</span></MagicMarquee>
              <MagicMarquee id="${MarqueeId.StateInd2}"><span>B</span></MagicMarquee>
            </div>
          `,
        })
      )
      await nextTick()

      api1!.pause()
      expect(api1!.isPlaying.value).toBe(false)
      expect(api2!.isPlaying.value).toBe(true)
    })
  })
})
