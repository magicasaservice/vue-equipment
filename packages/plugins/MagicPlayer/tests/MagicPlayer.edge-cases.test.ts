import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'
import MagicPlayerProvider from '../src/components/MagicPlayerProvider.vue'
import MagicPlayerVideo from '../src/components/MagicPlayerVideo.vue'
import MagicPlayerAudio from '../src/components/MagicPlayerAudio.vue'
import MagicPlayerVideoControls from '../src/components/MagicPlayerVideoControls.vue'
import MagicPlayerAudioControls from '../src/components/MagicPlayerAudioControls.vue'
import MagicPlayerOverlay from '../src/components/MagicPlayerOverlay.vue'
import MagicPlayerPoster from '../src/components/MagicPlayerPoster.vue'
import MagicPlayerTimeline from '../src/components/MagicPlayerTimeline.vue'
import MagicPlayerDisplayTime from '../src/components/MagicPlayerDisplayTime.vue'
import { useMagicPlayer } from '../src/composables/useMagicPlayer'

const VIDEO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'
const VIDEO_SRC_2 =
  'https://stream.mux.com/PniSBG6rbyou2x5jExB9EwYQAgBXGyqxXA023GC6JeXQ/highest.mp4'

const gc = {
  global: {
    components: { MagicPlayerTimeline, MagicPlayerDisplayTime },
  },
}

describe('MagicPlayer - Edge Cases', () => {
  describe('multiple instances', () => {
    it('two players do not interfere', async () => {
      const opts1 = { src: VIDEO_SRC, preload: 'none' as const, playback: false as const }
      const opts2 = { src: VIDEO_SRC_2, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const api1 = useMagicPlayer('edge-multi-1')
          const api2 = useMagicPlayer('edge-multi-2')
          return {
            play1: api1.videoApi.play,
            play2: api2.videoApi.play,
            playing1: api1.playing,
            playing2: api2.playing,
            opts1,
            opts2,
          }
        },
        template: `
          <div>
            <button data-test-id="play-1" @click="play1()">Play 1</button>
            <button data-test-id="play-2" @click="play2()">Play 2</button>
            <span data-test-id="playing-1">{{ playing1 }}</span>
            <span data-test-id="playing-2">{{ playing2 }}</span>
            <MagicPlayerProvider id="edge-multi-1" :options="opts1">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
            <MagicPlayerProvider id="edge-multi-2" :options="opts2">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      await screen.getByTestId('play-1').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing-1'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('playing-2'))
        .toHaveTextContent('false')
    })
  })

  describe('rapid state changes', () => {
    it('rapid play/pause settles correctly', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const api = useMagicPlayer('edge-rapid')
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="play" @click="videoApi.play()">Play</button>
            <button data-test-id="pause" @click="videoApi.pause()">Pause</button>
            <span data-test-id="paused">{{ paused }}</span>
            <MagicPlayerProvider id="edge-rapid" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      for (let i = 0; i < 4; i++) {
        await screen.getByTestId('play').click()
        await nextTick()
        await screen.getByTestId('pause').click()
        await nextTick()
      }

      await expect
        .element(page.getByTestId('paused'))
        .toHaveTextContent('true')
    })
  })

  describe('provider without controls', () => {
    it('renders provider without controls children', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const }
      const wrapper = defineComponent({
        components: { MagicPlayerProvider, MagicPlayerVideo },
        setup() {
          useMagicPlayer('edge-no-controls')
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="edge-no-controls" :options="opts">
            <MagicPlayerVideo />
            <div data-test-id="child">No controls</div>
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      await expect
        .element(page.getByTestId('child'))
        .toHaveTextContent('No controls')
      expect(
        document.querySelector('.magic-player-provider')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-video')
      ).not.toBeNull()
    })
  })

  describe('shared state via composable', () => {
    it('composable shares state with provider', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const api = useMagicPlayer('edge-shared')
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="muted">{{ muted }}</span>
            <button data-test-id="mute" @click="videoApi.mute()">Mute</button>
            <MagicPlayerProvider id="edge-shared" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      await screen.getByTestId('mute').click()
      await nextTick()

      await expect
        .element(page.getByTestId('muted'))
        .toHaveTextContent('true')

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-muted')).toBe('true')
    })
  })

  describe('display time formatting', () => {
    it('display time renders in audio controls', async () => {
      const opts = { src: VIDEO_SRC, mode: 'audio' as const, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerAudio,
          MagicPlayerAudioControls,
        },
        setup() {
          useMagicPlayer('edge-display-time')
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="edge-display-time" :options="opts">
            <MagicPlayerAudio />
            <MagicPlayerAudioControls />
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const displayTimes = document.querySelectorAll(
        '.magic-player-display-time'
      )
      expect(displayTimes.length).toBeGreaterThanOrEqual(2)
      expect(displayTimes[0]!.textContent!.trim()).toMatch(/^0:0[0-9]$/)
    })
  })

  describe('unmount cleanup', () => {
    it('removing player cleans up DOM', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const show = ref(true)
          useMagicPlayer('edge-unmount')
          return { show, opts }
        },
        template: `
          <div>
            <button data-test-id="toggle" @click="show = !show">Toggle</button>
            <MagicPlayerProvider v-if="show" id="edge-unmount" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-provider')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-video')
      ).not.toBeNull()

      await screen.getByTestId('toggle').click()
      await nextTick()

      expect(
        document.querySelector('.magic-player-provider')
      ).toBeNull()
      expect(
        document.querySelector('.magic-player-video')
      ).toBeNull()
    })
  })

  describe('video controls with explicit id', () => {
    it('controls rendered outside provider with explicit id', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          useMagicPlayer('edge-explicit-id')
          return { opts }
        },
        template: `
          <div>
            <MagicPlayerProvider id="edge-explicit-id" :options="opts">
              <MagicPlayerVideo />
              <div>Provider content</div>
            </MagicPlayerProvider>
            <MagicPlayerVideoControls id="edge-explicit-id" :standalone="true" />
          </div>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-video-controls')
      ).not.toBeNull()
      expect(
        document.querySelector(
          '.magic-player-video-controls__bar--inner'
        )
      ).not.toBeNull()
    })
  })

  describe('data-state reflects composable changes', () => {
    it('provider data attrs update when mute changes', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const api = useMagicPlayer('edge-data-mute')
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="mute" @click="videoApi.mute()">Mute</button>
            <span data-test-id="muted">{{ muted }}</span>
            <MagicPlayerProvider id="edge-data-mute" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-muted')).toBe('false')

      await screen.getByTestId('mute').click()
      await nextTick()

      expect(provider!.getAttribute('data-muted')).toBe('true')
      await expect
        .element(page.getByTestId('muted'))
        .toHaveTextContent('true')
    })

    it('provider data attrs update when play changes with loaded media', async () => {
      const opts = { src: VIDEO_SRC, preload: 'auto' as const, playback: false as const }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          const api = useMagicPlayer('edge-data-play')
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="play" @click="videoApi.play()">Play</button>
            <span data-test-id="loaded">{{ loaded }}</span>
            <span data-test-id="playing">{{ playing }}</span>
            <MagicPlayerProvider id="edge-data-play" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      // Wait for media to load first
      await expect
        .element(page.getByTestId('loaded'), { timeout: 10000 })
        .toHaveTextContent('true')

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-playing')).toBe('false')

      await screen.getByTestId('play').click()

      await expect
        .element(page.getByTestId('playing'), { timeout: 5000 })
        .toHaveTextContent('true')

      expect(provider!.getAttribute('data-playing')).toBe('true')
    }, 20000)
  })

  describe('video element with preload auto', () => {
    it('video element receives src and can load', async () => {
      const opts = { src: VIDEO_SRC, preload: 'auto' as const, playback: false as const }
      const wrapper = defineComponent({
        components: { MagicPlayerProvider, MagicPlayerVideo },
        setup() {
          const api = useMagicPlayer('edge-video-src')
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="loaded">{{ loaded }}</span>
            <MagicPlayerProvider id="edge-video-src" :options="opts">
              <MagicPlayerVideo />
            </MagicPlayerProvider>
          </div>
        `,
      })

      render(wrapper, gc)

      const video = document.querySelector('.magic-player-video') as HTMLVideoElement
      expect(video).not.toBeNull()
      expect(video.src).toContain('mux.com')

      // Wait for actual media loading
      await expect
        .element(page.getByTestId('loaded'), { timeout: 10000 })
        .toHaveTextContent('true')
    }, 15000)
  })
})
