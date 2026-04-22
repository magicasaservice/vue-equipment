import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicPlayerProvider from '../src/components/MagicPlayerProvider.vue'
import MagicPlayerVideo from '../src/components/MagicPlayerVideo.vue'
import MagicPlayerVideoControls from '../src/components/MagicPlayerVideoControls.vue'
import MagicPlayerOverlay from '../src/components/MagicPlayerOverlay.vue'
import MagicPlayerTimeline from '../src/components/MagicPlayerTimeline.vue'
import MagicPlayerDisplayTime from '../src/components/MagicPlayerDisplayTime.vue'
import { useMagicPlayer } from '../src/composables/useMagicPlayer'
import { PlayerId, TestId } from './enums'

const VIDEO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'

const gc = {
  global: {
    components: { MagicPlayerTimeline, MagicPlayerDisplayTime },
  },
}


function createPlayer(playerId: PlayerId) {
  const opts = {
    src: VIDEO_SRC,
    preload: 'none' as const,
    playback: false as const,
  }
  return defineComponent({
    components: {
      MagicPlayerProvider,
      MagicPlayerVideo,
      MagicPlayerVideoControls,
      MagicPlayerOverlay,
    },
    setup() {
      const api = useMagicPlayer(playerId)
      return { ...api, opts }
    },
    template: `
      <div>
        <span data-test-id="${TestId.Playing}">{{ playing }}</span>
        <span data-test-id="${TestId.Paused}">{{ paused }}</span>
        <span data-test-id="${TestId.Muted}">{{ muted }}</span>
        <span data-test-id="${TestId.Touched}">{{ touched }}</span>
        <span data-test-id="${TestId.Started}">{{ started }}</span>
        <span data-test-id="${TestId.Dragging}">{{ dragging }}</span>
        <button data-test-id="${TestId.PlayBtn}" @click="videoApi.play()">Play</button>
        <button data-test-id="${TestId.PauseBtn}" @click="videoApi.pause()">Pause</button>
        <button data-test-id="${TestId.ToggleBtn}" @click="videoApi.togglePlay()">Toggle</button>
        <button data-test-id="${TestId.MuteBtn}" @click="videoApi.mute()">Mute</button>
        <MagicPlayerProvider id="${playerId}" :options="opts">
          <MagicPlayerVideo />
          <MagicPlayerOverlay />
          <MagicPlayerVideoControls :standalone="true" />
        </MagicPlayerProvider>
      </div>
    `,
  })
}

describe('MagicPlayer - Interactions', () => {
  describe('play/pause via buttons', () => {
    it('play button starts playback', async () => {
      const screen = render(createPlayer(PlayerId.IntPlayBtn), gc)
      await nextTick()

      await screen.getByTestId(TestId.PlayBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')
    })

    it('toggle play twice pauses', async () => {
      const screen = render(createPlayer(PlayerId.IntToggleBtn), gc)
      await nextTick()

      await screen.getByTestId(TestId.ToggleBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.ToggleBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Paused))
        .toHaveTextContent('true')
    })

    it('mute button toggles mute', async () => {
      const screen = render(createPlayer(PlayerId.IntMuteBtn), gc)
      await nextTick()

      await screen.getByTestId(TestId.MuteBtn).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Muted))
        .toHaveTextContent('true')
    })
  })

  describe('overlay interaction', () => {
    it('overlay renders and is clickable', async () => {
      render(createPlayer(PlayerId.IntOverlayRender), gc)
      await nextTick()

      const overlay = document.querySelector(
        '.magic-player-overlay'
      )
      expect(overlay).not.toBeNull()
    })
  })

  describe('provider pointer events', () => {
    it('pointerdown on provider sets touched=true', async () => {
      render(createPlayer(PlayerId.IntProviderTouch), gc)
      await nextTick()

      const provider = document.querySelector(
        '.magic-player-provider'
      ) as HTMLElement
      provider.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          isPrimary: true,
        })
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Touched))
        .toHaveTextContent('true')
    })
  })

  describe('controls visibility', () => {
    it('standalone controls are always visible', async () => {
      render(createPlayer(PlayerId.IntStandaloneVisible), gc)
      await nextTick()

      const bar = document.querySelector(
        '.magic-player-video-controls__bar'
      ) as HTMLElement
      expect(bar.style.display).not.toBe('none')
    })
  })

  describe('timeline scrubbing', () => {
    it('pointerdown on timeline target initiates drag', async () => {
      render(createPlayer(PlayerId.IntTimelineDrag), gc)
      await nextTick()

      const target = document.querySelector(
        '.magic-player-timeline__target'
      ) as HTMLElement

      target.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          isPrimary: true,
          clientX: 50,
          clientY: 10,
        })
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Dragging))
        .toHaveTextContent('true')

      // Cleanup
      document.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          isPrimary: true,
        })
      )
    })

    it('pointerup ends drag', async () => {
      render(createPlayer(PlayerId.IntTimelineDragend), gc)
      await nextTick()

      const target = document.querySelector(
        '.magic-player-timeline__target'
      ) as HTMLElement

      target.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          isPrimary: true,
          clientX: 50,
          clientY: 10,
        })
      )
      await nextTick()

      document.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          isPrimary: true,
        })
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Dragging))
        .toHaveTextContent('false')
    })
  })

  describe('video element interaction', () => {
    it('video element exists inside provider', async () => {
      render(createPlayer(PlayerId.IntVideoEl), gc)
      await nextTick()

      const video = document.querySelector('.magic-player-video') as HTMLVideoElement
      expect(video).not.toBeNull()
      expect(video.tagName).toBe('VIDEO')
      expect(video.hasAttribute('playsinline')).toBe(true)
    })

    it('play sets started via media events when loaded', async () => {
      const opts = {
        src: VIDEO_SRC,
        preload: 'auto' as const,
        playback: false as const,
      }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const api = useMagicPlayer(PlayerId.IntMediaStart)
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Play}" @click="videoApi.play()">Play</button>
            <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
            <span data-test-id="${TestId.Started}">{{ started }}</span>
            <span data-test-id="${TestId.Playing}">{{ playing }}</span>
            <MagicPlayerProvider id="${PlayerId.IntMediaStart}" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      // Wait for media to load
      await expect
        .element(page.getByTestId(TestId.Loaded), { timeout: 10000 })
        .toHaveTextContent('true')

      // Play via trusted click
      await screen.getByTestId(TestId.Play).click()

      // Wait for started (media 'playing' event)
      await expect
        .element(page.getByTestId(TestId.Started), { timeout: 5000 })
        .toHaveTextContent('true')

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')
    }, 20000)
  })
})
