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
import { PlayerId, TestId } from './enums'

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
          const api1 = useMagicPlayer(PlayerId.EdgeMulti1)
          const api2 = useMagicPlayer(PlayerId.EdgeMulti2)
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
            <button data-test-id="${TestId.Play1}" @click="play1()">Play 1</button>
            <button data-test-id="${TestId.Play2}" @click="play2()">Play 2</button>
            <span data-test-id="${TestId.Playing1}">{{ playing1 }}</span>
            <span data-test-id="${TestId.Playing2}">{{ playing2 }}</span>
            <MagicPlayerProvider id="${PlayerId.EdgeMulti1}" :options="opts1">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
            <MagicPlayerProvider id="${PlayerId.EdgeMulti2}" :options="opts2">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      await screen.getByTestId(TestId.Play1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Playing2))
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
          const api = useMagicPlayer(PlayerId.EdgeRapid)
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Play}" @click="videoApi.play()">Play</button>
            <button data-test-id="${TestId.Pause}" @click="videoApi.pause()">Pause</button>
            <span data-test-id="${TestId.Paused}">{{ paused }}</span>
            <MagicPlayerProvider id="${PlayerId.EdgeRapid}" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      for (let i = 0; i < 4; i++) {
        await screen.getByTestId(TestId.Play).click()
        await nextTick()
        await screen.getByTestId(TestId.Pause).click()
        await nextTick()
      }

      await expect
        .element(page.getByTestId(TestId.Paused))
        .toHaveTextContent('true')
    })
  })

  describe('provider without controls', () => {
    it('renders provider without controls children', async () => {
      const opts = { src: VIDEO_SRC, preload: 'none' as const }
      const wrapper = defineComponent({
        components: { MagicPlayerProvider, MagicPlayerVideo },
        setup() {
          useMagicPlayer(PlayerId.EdgeNoControls)
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="${PlayerId.EdgeNoControls}" :options="opts">
            <MagicPlayerVideo />
            <div data-test-id="${TestId.Child}">No controls</div>
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Child))
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
          const api = useMagicPlayer(PlayerId.EdgeShared)
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Muted}">{{ muted }}</span>
            <button data-test-id="${TestId.Mute}" @click="videoApi.mute()">Mute</button>
            <MagicPlayerProvider id="${PlayerId.EdgeShared}" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      await screen.getByTestId(TestId.Mute).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Muted))
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
          useMagicPlayer(PlayerId.EdgeDisplayTime)
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="${PlayerId.EdgeDisplayTime}" :options="opts">
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
          useMagicPlayer(PlayerId.EdgeUnmount)
          return { show, opts }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Toggle}" @click="show = !show">Toggle</button>
            <MagicPlayerProvider v-if="show" id="${PlayerId.EdgeUnmount}" :options="opts">
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

      await screen.getByTestId(TestId.Toggle).click()
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
          useMagicPlayer(PlayerId.EdgeExplicitId)
          return { opts }
        },
        template: `
          <div>
            <MagicPlayerProvider id="${PlayerId.EdgeExplicitId}" :options="opts">
              <MagicPlayerVideo />
              <div>Provider content</div>
            </MagicPlayerProvider>
            <MagicPlayerVideoControls id="${PlayerId.EdgeExplicitId}" :standalone="true" />
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
          const api = useMagicPlayer(PlayerId.EdgeDataMute)
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Mute}" @click="videoApi.mute()">Mute</button>
            <span data-test-id="${TestId.Muted}">{{ muted }}</span>
            <MagicPlayerProvider id="${PlayerId.EdgeDataMute}" :options="opts">
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

      await screen.getByTestId(TestId.Mute).click()
      await nextTick()

      expect(provider!.getAttribute('data-muted')).toBe('true')
      await expect
        .element(page.getByTestId(TestId.Muted))
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
          const api = useMagicPlayer(PlayerId.EdgeDataPlay)
          return { ...api, opts }
        },
        template: `
          <div>
            <button data-test-id="${TestId.Play}" @click="videoApi.play()">Play</button>
            <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
            <span data-test-id="${TestId.Playing}">{{ playing }}</span>
            <MagicPlayerProvider id="${PlayerId.EdgeDataPlay}" :options="opts">
              <MagicPlayerVideo />
              <MagicPlayerVideoControls :standalone="true" />
            </MagicPlayerProvider>
          </div>
        `,
      })

      const screen = render(wrapper, gc)

      // Wait for media to load first
      await expect
        .element(page.getByTestId(TestId.Loaded), { timeout: 10000 })
        .toHaveTextContent('true')

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-playing')).toBe('false')

      await screen.getByTestId(TestId.Play).click()

      await expect
        .element(page.getByTestId(TestId.Playing), { timeout: 5000 })
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
          const api = useMagicPlayer(PlayerId.EdgeVideoSrc)
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
            <MagicPlayerProvider id="${PlayerId.EdgeVideoSrc}" :options="opts">
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
        .element(page.getByTestId(TestId.Loaded), { timeout: 10000 })
        .toHaveTextContent('true')
    }, 15000)
  })
})
