import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
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

const gc = {
  global: { components: { MagicPlayerTimeline, MagicPlayerDisplayTime } },
}


function createPlayer(
  playerId: PlayerId,
  overrides: Record<string, unknown> = {}
) {
  const opts = {
    src: VIDEO_SRC,
    preload: 'none' as const,
    playback: false as const,
    ...overrides,
  }
  return defineComponent({
    components: {
      MagicPlayerProvider,
      MagicPlayerVideo,
      MagicPlayerVideoControls,
      MagicPlayerOverlay,
      MagicPlayerPoster,
    },
    setup() {
      const api = useMagicPlayer(playerId)
      return { ...api, opts }
    },
    template: `
      <div>
        <span data-test-id="${TestId.Playing}">{{ playing }}</span>
        <span data-test-id="${TestId.Muted}">{{ muted }}</span>
        <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
        <span data-test-id="${TestId.Started}">{{ started }}</span>
        <MagicPlayerProvider id="${playerId}" :options="opts">
          <MagicPlayerVideo />
          <MagicPlayerOverlay />
          <MagicPlayerPoster>
            <div data-test-id="${TestId.Poster}">Poster</div>
          </MagicPlayerPoster>
          <MagicPlayerVideoControls :standalone="true" />
        </MagicPlayerProvider>
      </div>
    `,
  })
}

describe('MagicPlayer - Options', () => {
  describe('mode option', () => {
    it('defaults to video mode', async () => {
      render(createPlayer(PlayerId.OptModeDefault), gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-mode')).toBe('video')
    })

    it('audio mode sets data-mode=audio', async () => {
      const opts = {
        src: VIDEO_SRC,
        mode: 'audio' as const,
        preload: 'none' as const,
        playback: false as const,
      }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerAudio,
          MagicPlayerAudioControls,
        },
        setup() {
          useMagicPlayer(PlayerId.OptAudioMode)
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="${PlayerId.OptAudioMode}" :options="opts">
            <MagicPlayerAudio />
            <MagicPlayerAudioControls />
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-mode')).toBe('audio')
    })
  })

  describe('poster visibility logic', () => {
    it('poster visible when not loaded and not started', async () => {
      render(createPlayer(PlayerId.OptPosterVisible), gc)
      await nextTick()

      const poster = document.querySelector(
        '.magic-player-poster'
      ) as HTMLElement
      expect(poster.style.display).not.toBe('none')
    })

    it('poster hides when loaded and started', async () => {
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
          MagicPlayerPoster,
        },
        setup() {
          const api = useMagicPlayer(PlayerId.OptPosterHide)
          api.loaded.value = true
          api.started.value = true
          const opts = {
            src: VIDEO_SRC,
            preload: 'none' as const,
            playback: false as const,
          }
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="${PlayerId.OptPosterHide}" :options="opts">
            <MagicPlayerVideo />
            <MagicPlayerPoster>
              <div data-test-id="${TestId.Poster}">Poster</div>
            </MagicPlayerPoster>
            <MagicPlayerVideoControls :standalone="true" />
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const poster = document.querySelector(
        '.magic-player-poster'
      ) as HTMLElement
      expect(poster.style.display).toBe('none')
    })

    it('poster visible when loaded but not started', async () => {
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
          MagicPlayerPoster,
        },
        setup() {
          const api = useMagicPlayer(PlayerId.OptPosterLoadedOnly)
          api.loaded.value = true
          const opts = {
            src: VIDEO_SRC,
            preload: 'none' as const,
            playback: false as const,
          }
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="${PlayerId.OptPosterLoadedOnly}" :options="opts">
            <MagicPlayerVideo />
            <MagicPlayerPoster>
              <div>Poster</div>
            </MagicPlayerPoster>
            <MagicPlayerVideoControls :standalone="true" />
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const poster = document.querySelector(
        '.magic-player-poster'
      ) as HTMLElement
      expect(poster.style.display).not.toBe('none')
    })
  })

  describe('standalone controls', () => {
    it('standalone controls always visible', async () => {
      render(createPlayer(PlayerId.OptStandalone), gc)
      await nextTick()

      const bar = document.querySelector(
        '.magic-player-video-controls__bar'
      ) as HTMLElement
      expect(bar.style.display).not.toBe('none')
    })

    it('non-standalone defaults data-standalone=false', async () => {
      const opts = {
        src: VIDEO_SRC,
        preload: 'none' as const,
        playback: false as const,
      }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
          MagicPlayerVideoControls,
        },
        setup() {
          useMagicPlayer(PlayerId.OptNonStandalone)
          return { opts }
        },
        template: `
          <MagicPlayerProvider id="${PlayerId.OptNonStandalone}" :options="opts">
            <MagicPlayerVideo />
            <MagicPlayerVideoControls />
          </MagicPlayerProvider>
        `,
      })

      render(wrapper, gc)
      await nextTick()

      const controls = document.querySelector(
        '.magic-player-video-controls'
      )
      expect(controls!.getAttribute('data-standalone')).toBe('false')
    })
  })

  describe('overlay sets hasOverlay', () => {
    it('overlay presence affects controls visibility logic', async () => {
      render(createPlayer(PlayerId.OptHasOverlay), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-overlay')
      ).not.toBeNull()
    })
  })

  describe('playback option', () => {
    it('playback=false accepted without error', async () => {
      render(createPlayer(PlayerId.OptPlaybackFalse, { playback: false }), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-provider')
      ).not.toBeNull()
    })
  })

  describe('preload option', () => {
    it('preload=auto loads video data', async () => {
      const opts = {
        src: VIDEO_SRC,
        preload: 'auto' as const,
        playback: false as const,
      }
      const wrapper = defineComponent({
        components: {
          MagicPlayerProvider,
          MagicPlayerVideo,
        },
        setup() {
          const api = useMagicPlayer(PlayerId.OptPreloadAuto)
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
            <MagicPlayerProvider id="${PlayerId.OptPreloadAuto}" :options="opts">
              <MagicPlayerVideo />
            </MagicPlayerProvider>
          </div>
        `,
      })

      render(wrapper, gc)

      await expect
        .element(page.getByTestId(TestId.Loaded), { timeout: 10000 })
        .toHaveTextContent('true')
    }, 15000)
  })
})
