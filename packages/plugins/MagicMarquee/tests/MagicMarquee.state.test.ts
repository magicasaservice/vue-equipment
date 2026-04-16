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
        <span data-test-id="id">{{ state.id }}</span>
        <span data-test-id="playing">{{ state.playing }}</span>
        <span data-test-id="is-playing">{{ isPlaying }}</span>
        <button data-test-id="pause" @click="pause()">Pause</button>
        <button data-test-id="play" @click="play()">Play</button>
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

describe('MagicMarquee - State', () => {
  describe('shared state', () => {
    it('composable and component share state via id', async () => {
      render(createMarquee('state-shared'))
      await nextTick()

      await expect
        .element(page.getByTestId('id'))
        .toHaveTextContent('state-shared')
      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('true')
    })

    it('state mutations from composable reflect in state', async () => {
      const screen = render(createMarquee('state-mutate'))
      await nextTick()

      await screen.getByTestId('pause').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('false')

      await screen.getByTestId('play').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing'))
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
            api1 = useMagicMarquee('state-ind-1')
            api2 = useMagicMarquee('state-ind-2')
            return {}
          },
          template: `
            <div>
              <MagicMarquee id="state-ind-1"><span>A</span></MagicMarquee>
              <MagicMarquee id="state-ind-2"><span>B</span></MagicMarquee>
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
