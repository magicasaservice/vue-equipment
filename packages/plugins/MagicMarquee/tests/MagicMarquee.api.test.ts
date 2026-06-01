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
        <button data-test-id="${TestId.Play}" @click="play()">Play</button>
        <button data-test-id="${TestId.Pause}" @click="pause()">Pause</button>
        <button data-test-id="${TestId.Reverse}" @click="reverse()">Reverse</button>
        <button data-test-id="${TestId.IncSpeed}" @click="increaseSpeed()">Inc</button>
        <button data-test-id="${TestId.IncSpeed5}" @click="increaseSpeed(5)">Inc5</button>
        <button data-test-id="${TestId.DecSpeed}" @click="decreaseSpeed()">Dec</button>
        <button data-test-id="${TestId.DecSpeed10}" @click="decreaseSpeed(10)">Dec10</button>
        <span data-test-id="${TestId.IsPlaying}">{{ isPlaying }}</span>
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

describe('MagicMarquee - API', () => {
  describe('composable return shape', () => {
    it('returns expected functions and state', () => {
      let api: ReturnType<typeof useMagicMarquee> | undefined

      render(
        defineComponent({
          setup() {
            api = useMagicMarquee(MarqueeId.ApiShape)
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
      render(createMarquee(MarqueeId.ApiDefaultPlay))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsPlaying))
        .toHaveTextContent('true')
    })

    it('pause sets isPlaying to false', async () => {
      const screen = render(createMarquee(MarqueeId.ApiPause))
      await nextTick()

      await screen.getByTestId(TestId.Pause).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsPlaying))
        .toHaveTextContent('false')
    })

    it('play restores isPlaying to true after pause', async () => {
      const screen = render(createMarquee(MarqueeId.ApiPlay))
      await nextTick()

      await screen.getByTestId(TestId.Pause).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsPlaying))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.Play).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.IsPlaying))
        .toHaveTextContent('true')
    })
  })

  describe('speed', () => {
    it('increaseSpeed increases speed by 1', async () => {
      const screen = render(createMarquee(MarqueeId.ApiIncSpeed))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('1')

      await screen.getByTestId(TestId.IncSpeed).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('2')
    })

    it('increaseSpeed with factor adds that amount', async () => {
      const screen = render(createMarquee(MarqueeId.ApiIncFactor))
      await nextTick()

      await screen.getByTestId(TestId.IncSpeed5).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('6')
    })

    it('decreaseSpeed decreases speed by 1', async () => {
      const screen = render(createMarquee(MarqueeId.ApiDecSpeed, { speed: 5 }))
      await nextTick()

      await screen.getByTestId(TestId.DecSpeed).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('4')
    })

    it('decreaseSpeed does not go below 0', async () => {
      const screen = render(createMarquee(MarqueeId.ApiDecFloor, { speed: 1 }))
      await nextTick()

      await screen.getByTestId(TestId.DecSpeed10).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Speed))
        .toHaveTextContent('0')
    })
  })

  describe('reverse', () => {
    it('toggles direction from normal to reverse', async () => {
      const screen = render(createMarquee(MarqueeId.ApiReverse))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Direction))
        .toHaveTextContent('normal')

      await screen.getByTestId(TestId.Reverse).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Direction))
        .toHaveTextContent('reverse')
    })

    it('toggles back to normal on second reverse', async () => {
      const screen = render(
        createMarquee(MarqueeId.ApiReverseBack, { direction: 'reverse' })
      )
      await nextTick()

      await screen.getByTestId(TestId.Reverse).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Direction))
        .toHaveTextContent('normal')
    })
  })

  describe('CSS variable synchronization', () => {
    it('pause sets --mm-animation-play-state to paused', async () => {
      const screen = render(createMarquee(MarqueeId.ApiCssPause))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Pause).click()
      await nextTick()

      const el = document.querySelector('.magic-marquee') as HTMLElement
      expect(el.style.getPropertyValue('--mm-animation-play-state')).toBe('paused')
    })

    it('play sets --mm-animation-play-state to running', async () => {
      const screen = render(createMarquee(MarqueeId.ApiCssPlay))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Pause).click()
      await nextTick()
      await screen.getByTestId(TestId.Play).click()
      await nextTick()

      const el = document.querySelector('.magic-marquee') as HTMLElement
      expect(el.style.getPropertyValue('--mm-animation-play-state')).toBe('running')
    })

    it('reverse updates --mm-animation-direction', async () => {
      const screen = render(createMarquee(MarqueeId.ApiCssReverse))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      await screen.getByTestId(TestId.Reverse).click()
      await nextTick()
      await nextTick()

      const el = document.querySelector('.magic-marquee') as HTMLElement
      expect(el.style.getPropertyValue('--mm-animation-direction')).toBe('reverse')
    })

    it('speed change updates --mm-animation-duration', async () => {
      const screen = render(createMarquee(MarqueeId.ApiCssSpeed))
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const el = document.querySelector('.magic-marquee') as HTMLElement
      const before = el.style.getPropertyValue('--mm-animation-duration')

      await screen.getByTestId(TestId.IncSpeed).click()
      await nextTick()
      await nextTick()

      const after = el.style.getPropertyValue('--mm-animation-duration')
      expect(after).not.toBe(before)
    })
  })
})
