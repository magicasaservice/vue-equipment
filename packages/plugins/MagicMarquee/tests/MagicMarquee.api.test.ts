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
        <button data-test-id="play" @click="play()">Play</button>
        <button data-test-id="pause" @click="pause()">Pause</button>
        <button data-test-id="reverse" @click="reverse()">Reverse</button>
        <button data-test-id="inc-speed" @click="increaseSpeed()">Inc</button>
        <button data-test-id="inc-speed-5" @click="increaseSpeed(5)">Inc5</button>
        <button data-test-id="dec-speed" @click="decreaseSpeed()">Dec</button>
        <button data-test-id="dec-speed-10" @click="decreaseSpeed(10)">Dec10</button>
        <span data-test-id="is-playing">{{ isPlaying }}</span>
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

describe('MagicMarquee - API', () => {
  describe('composable return shape', () => {
    it('returns expected functions and state', () => {
      let api: ReturnType<typeof useMagicMarquee> | undefined

      render(
        defineComponent({
          setup() {
            api = useMagicMarquee('api-shape')
            return {}
          },
          template: '<div>test</div>',
        })
      )

      expect(typeof api!.play).toBe('function')
      expect(typeof api!.pause).toBe('function')
      expect(typeof api!.increaseSpeed).toBe('function')
      expect(typeof api!.decreaseSpeed).toBe('function')
      expect(typeof api!.reverse).toBe('function')
      expect(api!.isPlaying).toBeDefined()
      expect(api!.state).toBeDefined()
    })
  })

  describe('play/pause', () => {
    it('starts playing by default', async () => {
      render(createMarquee('api-default-play'))
      await nextTick()

      await expect
        .element(page.getByTestId('is-playing'))
        .toHaveTextContent('true')
    })

    it('pause sets isPlaying to false', async () => {
      const screen = render(createMarquee('api-pause'))
      await nextTick()

      await screen.getByTestId('pause').click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-playing'))
        .toHaveTextContent('false')
    })

    it('play restores isPlaying to true after pause', async () => {
      const screen = render(createMarquee('api-play'))
      await nextTick()

      await screen.getByTestId('pause').click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-playing'))
        .toHaveTextContent('false')

      await screen.getByTestId('play').click()
      await nextTick()

      await expect
        .element(page.getByTestId('is-playing'))
        .toHaveTextContent('true')
    })
  })

  describe('speed', () => {
    it('increaseSpeed increases speed by 1', async () => {
      const screen = render(createMarquee('api-inc-speed'))
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('1')

      await screen.getByTestId('inc-speed').click()
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('2')
    })

    it('increaseSpeed with factor adds that amount', async () => {
      const screen = render(createMarquee('api-inc-factor'))
      await nextTick()

      await screen.getByTestId('inc-speed-5').click()
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('6')
    })

    it('decreaseSpeed decreases speed by 1', async () => {
      const screen = render(createMarquee('api-dec-speed', { speed: 5 }))
      await nextTick()

      await screen.getByTestId('dec-speed').click()
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('4')
    })

    it('decreaseSpeed does not go below 0', async () => {
      const screen = render(
        createMarquee('api-dec-floor', { speed: 1 })
      )
      await nextTick()

      await screen.getByTestId('dec-speed-10').click()
      await nextTick()

      await expect
        .element(page.getByTestId('speed'))
        .toHaveTextContent('0')
    })
  })

  describe('reverse', () => {
    it('toggles direction from normal to reverse', async () => {
      const screen = render(createMarquee('api-reverse'))
      await nextTick()

      await expect
        .element(page.getByTestId('direction'))
        .toHaveTextContent('normal')

      await screen.getByTestId('reverse').click()
      await nextTick()

      await expect
        .element(page.getByTestId('direction'))
        .toHaveTextContent('reverse')
    })

    it('toggles back to normal on second reverse', async () => {
      const screen = render(
        createMarquee('api-reverse-back', { direction: 'reverse' })
      )
      await nextTick()

      await screen.getByTestId('reverse').click()
      await nextTick()

      await expect
        .element(page.getByTestId('direction'))
        .toHaveTextContent('normal')
    })
  })

  describe('CSS variable synchronization', () => {
    it('pause sets --mm-animation-play-state to paused', async () => {
      const screen = render(createMarquee('api-css-pause'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId('pause').click()
      await nextTick()

      const el = document.querySelector('.magic-marquee') as HTMLElement
      expect(
        el.style.getPropertyValue('--mm-animation-play-state')
      ).toBe('paused')
    })

    it('play sets --mm-animation-play-state to running', async () => {
      const screen = render(createMarquee('api-css-play'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId('pause').click()
      await nextTick()
      await screen.getByTestId('play').click()
      await nextTick()

      const el = document.querySelector('.magic-marquee') as HTMLElement
      expect(
        el.style.getPropertyValue('--mm-animation-play-state')
      ).toBe('running')
    })

    it('reverse updates --mm-animation-direction', async () => {
      const screen = render(createMarquee('api-css-reverse'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId('reverse').click()
      await nextTick()
      await nextTick()

      const el = document.querySelector('.magic-marquee') as HTMLElement
      expect(
        el.style.getPropertyValue('--mm-animation-direction')
      ).toBe('reverse')
    })

    it('speed change updates --mm-animation-duration', async () => {
      const screen = render(createMarquee('api-css-speed'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el = document.querySelector('.magic-marquee') as HTMLElement
      const before = el.style.getPropertyValue('--mm-animation-duration')

      await screen.getByTestId('inc-speed').click()
      await nextTick()
      await nextTick()

      const after = el.style.getPropertyValue('--mm-animation-duration')
      expect(after).not.toBe(before)
    })
  })
})
