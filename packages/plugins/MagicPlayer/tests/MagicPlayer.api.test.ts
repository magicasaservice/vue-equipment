import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicPlayerProvider from '../src/components/MagicPlayerProvider.vue'
import MagicPlayerVideo from '../src/components/MagicPlayerVideo.vue'
import MagicPlayerAudio from '../src/components/MagicPlayerAudio.vue'
import MagicPlayerVideoControls from '../src/components/MagicPlayerVideoControls.vue'
import MagicPlayerAudioControls from '../src/components/MagicPlayerAudioControls.vue'
import MagicPlayerTimeline from '../src/components/MagicPlayerTimeline.vue'
import MagicPlayerDisplayTime from '../src/components/MagicPlayerDisplayTime.vue'
import { useMagicPlayer } from '../src/composables/useMagicPlayer'

const VIDEO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'

const gc = {
  global: { components: { MagicPlayerTimeline, MagicPlayerDisplayTime } },
}

function createVideoPlayer(playerId: string) {
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
    },
    setup() {
      const api = useMagicPlayer(playerId)
      return { ...api, opts }
    },
    template: `
      <div>
        <button data-test-id="play" @click="videoApi.play()">Play</button>
        <button data-test-id="pause" @click="videoApi.pause()">Pause</button>
        <button data-test-id="toggle" @click="videoApi.togglePlay()">Toggle</button>
        <button data-test-id="mute" @click="videoApi.mute()">Mute</button>
        <button data-test-id="unmute" @click="videoApi.unmute()">Unmute</button>
        <button data-test-id="seek-10" @click="videoApi.seek(10)">Seek 10</button>
        <span data-test-id="playing">{{ playing }}</span>
        <span data-test-id="paused">{{ paused }}</span>
        <span data-test-id="muted">{{ muted }}</span>
        <span data-test-id="started">{{ started }}</span>
        <span data-test-id="loaded">{{ loaded }}</span>
        <span data-test-id="fullscreen">{{ fullscreen }}</span>
        <span data-test-id="volume">{{ volume }}</span>
        <span data-test-id="duration">{{ duration }}</span>
        <span data-test-id="current-time">{{ currentTime }}</span>
        <MagicPlayerProvider id="${playerId}" :options="opts">
          <MagicPlayerVideo />
          <MagicPlayerVideoControls :standalone="true" />
        </MagicPlayerProvider>
      </div>
    `,
  })
}

function createAudioPlayer(playerId: string) {
  const opts = {
    src: VIDEO_SRC,
    mode: 'audio' as const,
    preload: 'none' as const,
    playback: false as const,
  }
  return defineComponent({
    components: {
      MagicPlayerProvider,
      MagicPlayerAudio,
      MagicPlayerAudioControls,
    },
    setup() {
      const api = useMagicPlayer(playerId)
      return { ...api, opts }
    },
    template: `
      <div>
        <button data-test-id="play" @click="audioApi.play()">Play</button>
        <button data-test-id="pause" @click="audioApi.pause()">Pause</button>
        <button data-test-id="toggle" @click="audioApi.togglePlay()">Toggle</button>
        <button data-test-id="mute" @click="audioApi.mute()">Mute</button>
        <button data-test-id="unmute" @click="audioApi.unmute()">Unmute</button>
        <span data-test-id="playing">{{ playing }}</span>
        <span data-test-id="paused">{{ paused }}</span>
        <span data-test-id="muted">{{ muted }}</span>
        <MagicPlayerProvider id="${playerId}" :options="opts">
          <MagicPlayerAudio />
          <MagicPlayerAudioControls />
        </MagicPlayerProvider>
      </div>
    `,
  })
}

describe('MagicPlayer - API', () => {
  describe('composable return shape', () => {
    it('returns all state refs', () => {
      let api: ReturnType<typeof useMagicPlayer> | undefined
      render(
        defineComponent({
          setup() {
            api = useMagicPlayer('api-shape')
            return {}
          },
          template: '<div />',
        })
      )

      const stateKeys = [
        'playing', 'paused', 'started', 'loaded', 'muted',
        'fullscreen', 'touched', 'dragging', 'waiting', 'ended',
        'stalled', 'seeking', 'volume', 'rate', 'duration',
        'currentTime', 'buffered', 'seekedTime', 'seekedPercentage',
        'scrubbedPercentage', 'thumbPercentage', 'popoverOffsetX',
      ]
      for (const key of stateKeys) {
        expect(api![key as keyof typeof api]).toBeDefined()
      }
    })

    it('returns api objects', () => {
      let api: ReturnType<typeof useMagicPlayer> | undefined
      render(
        defineComponent({
          setup() {
            api = useMagicPlayer('api-objects')
            return {}
          },
          template: '<div />',
        })
      )

      expect(api!.videoApi).toBeDefined()
      expect(api!.audioApi).toBeDefined()
      expect(api!.controlsApi).toBeDefined()
      expect(api!.playerRuntime).toBeDefined()
    })

    it('videoApi has expected methods', () => {
      let api: ReturnType<typeof useMagicPlayer> | undefined
      render(
        defineComponent({
          setup() {
            api = useMagicPlayer('api-vid-m')
            return {}
          },
          template: '<div />',
        })
      )

      const methods = [
        'play', 'pause', 'togglePlay', 'seek',
        'mute', 'unmute', 'enterFullscreen', 'exitFullscreen',
        'initializeFullscreen',
      ]
      for (const m of methods) {
        expect(typeof (api!.videoApi as Record<string, unknown>)[m]).toBe('function')
      }
    })

    it('audioApi has expected methods', () => {
      let api: ReturnType<typeof useMagicPlayer> | undefined
      render(
        defineComponent({
          setup() {
            api = useMagicPlayer('api-aud-m')
            return {}
          },
          template: '<div />',
        })
      )

      const methods = ['play', 'pause', 'togglePlay', 'seek', 'mute', 'unmute']
      for (const m of methods) {
        expect(typeof (api!.audioApi as Record<string, unknown>)[m]).toBe('function')
      }
    })
  })

  describe('video api state mutations', () => {
    it('play() sets playing=true', async () => {
      const screen = render(createVideoPlayer('api-v-play'), gc)
      await screen.getByTestId('play').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('true')
    })

    it('pause() after play() sets paused=true', async () => {
      const screen = render(createVideoPlayer('api-v-pause'), gc)
      await screen.getByTestId('play').click()
      await nextTick()
      await screen.getByTestId('pause').click()
      await nextTick()

      await expect
        .element(page.getByTestId('paused'))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('false')
    })

    it('togglePlay() toggles playing state', async () => {
      const screen = render(createVideoPlayer('api-v-toggle'), gc)

      await screen.getByTestId('toggle').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('true')

      await screen.getByTestId('toggle').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('false')
    })

    it('mute() sets muted=true', async () => {
      const screen = render(createVideoPlayer('api-v-mute'), gc)
      await screen.getByTestId('mute').click()
      await nextTick()

      await expect
        .element(page.getByTestId('muted'))
        .toHaveTextContent('true')
    })

    it('unmute() sets muted=false', async () => {
      const screen = render(createVideoPlayer('api-v-unmute'), gc)
      await screen.getByTestId('mute').click()
      await nextTick()
      await screen.getByTestId('unmute').click()
      await nextTick()

      await expect
        .element(page.getByTestId('muted'))
        .toHaveTextContent('false')
    })

    it('seek() updates currentTime', async () => {
      const screen = render(createVideoPlayer('api-v-seek'), gc)
      await screen.getByTestId('seek-10').click()
      await nextTick()

      await expect
        .element(page.getByTestId('current-time'))
        .toHaveTextContent('10')
    })
  })

  describe('audio api state mutations', () => {
    it('play() sets playing=true', async () => {
      const screen = render(createAudioPlayer('api-a-play'), gc)
      await screen.getByTestId('play').click()
      await nextTick()

      await expect
        .element(page.getByTestId('playing'))
        .toHaveTextContent('true')
    })

    it('pause() sets paused=true', async () => {
      const screen = render(createAudioPlayer('api-a-pause'), gc)
      await screen.getByTestId('play').click()
      await nextTick()
      await screen.getByTestId('pause').click()
      await nextTick()

      await expect
        .element(page.getByTestId('paused'))
        .toHaveTextContent('true')
    })

    it('mute()/unmute() toggles muted', async () => {
      const screen = render(createAudioPlayer('api-a-mute'), gc)
      await screen.getByTestId('mute').click()
      await nextTick()

      await expect
        .element(page.getByTestId('muted'))
        .toHaveTextContent('true')

      await screen.getByTestId('unmute').click()
      await nextTick()

      await expect
        .element(page.getByTestId('muted'))
        .toHaveTextContent('false')
    })
  })

  describe('initial state defaults', () => {
    it('starts with all boolean states false', async () => {
      render(createVideoPlayer('api-defaults'), gc)
      await nextTick()

      for (const id of ['playing', 'paused', 'muted', 'started', 'fullscreen']) {
        await expect
          .element(page.getByTestId(id))
          .toHaveTextContent('false')
      }
    })

    it('volume defaults to 1', async () => {
      render(createVideoPlayer('api-vol-default'), gc)
      await nextTick()

      await expect
        .element(page.getByTestId('volume'))
        .toHaveTextContent('1')
    })

    it('currentTime defaults to 0', async () => {
      render(createVideoPlayer('api-ct-default'), gc)
      await nextTick()

      await expect
        .element(page.getByTestId('current-time'))
        .toHaveTextContent('0')
    })

    it('duration defaults to 0', async () => {
      render(createVideoPlayer('api-dur-default'), gc)
      await nextTick()

      await expect
        .element(page.getByTestId('duration'))
        .toHaveTextContent('0')
    })
  })

  describe('media loading', () => {
    it('loaded becomes true after preload=auto', async () => {
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
          const api = useMagicPlayer('api-media-load')
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="loaded">{{ loaded }}</span>
            <span data-test-id="duration">{{ duration }}</span>
            <MagicPlayerProvider id="api-media-load" :options="opts">
              <MagicPlayerVideo />
            </MagicPlayerProvider>
          </div>
        `,
      })

      render(wrapper, gc)

      // Wait for video to load
      await expect
        .element(page.getByTestId('loaded'), { timeout: 10000 })
        .toHaveTextContent('true')

      // Duration should be set after loading
      const durationEl = document.querySelector(
        '[data-test-id="duration"]'
      ) as HTMLElement
      const duration = parseFloat(durationEl.textContent || '0')
      expect(duration).toBeGreaterThan(0)
    }, 15000)
  })
})
