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
import { PlayerId, TestId } from './enums'

const VIDEO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'

const gc = {
  global: { components: { MagicPlayerTimeline, MagicPlayerDisplayTime } },
}


function createVideoPlayer(playerId: PlayerId) {
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
        <button data-test-id="${TestId.Play}" @click="videoApi.play()">Play</button>
        <button data-test-id="${TestId.Pause}" @click="videoApi.pause()">Pause</button>
        <button data-test-id="${TestId.Toggle}" @click="videoApi.togglePlay()">Toggle</button>
        <button data-test-id="${TestId.Mute}" @click="videoApi.mute()">Mute</button>
        <button data-test-id="${TestId.Unmute}" @click="videoApi.unmute()">Unmute</button>
        <button data-test-id="${TestId.Seek10}" @click="videoApi.seek(10)">Seek 10</button>
        <span data-test-id="${TestId.Playing}">{{ playing }}</span>
        <span data-test-id="${TestId.Paused}">{{ paused }}</span>
        <span data-test-id="${TestId.Muted}">{{ muted }}</span>
        <span data-test-id="${TestId.Started}">{{ started }}</span>
        <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
        <span data-test-id="${TestId.Fullscreen}">{{ fullscreen }}</span>
        <span data-test-id="${TestId.Volume}">{{ volume }}</span>
        <span data-test-id="${TestId.Duration}">{{ duration }}</span>
        <span data-test-id="${TestId.CurrentTime}">{{ currentTime }}</span>
        <MagicPlayerProvider id="${playerId}" :options="opts">
          <MagicPlayerVideo />
          <MagicPlayerVideoControls :standalone="true" />
        </MagicPlayerProvider>
      </div>
    `,
  })
}

function createAudioPlayer(playerId: PlayerId) {
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
        <button data-test-id="${TestId.Play}" @click="audioApi.play()">Play</button>
        <button data-test-id="${TestId.Pause}" @click="audioApi.pause()">Pause</button>
        <button data-test-id="${TestId.Toggle}" @click="audioApi.togglePlay()">Toggle</button>
        <button data-test-id="${TestId.Mute}" @click="audioApi.mute()">Mute</button>
        <button data-test-id="${TestId.Unmute}" @click="audioApi.unmute()">Unmute</button>
        <span data-test-id="${TestId.Playing}">{{ playing }}</span>
        <span data-test-id="${TestId.Paused}">{{ paused }}</span>
        <span data-test-id="${TestId.Muted}">{{ muted }}</span>
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
            api = useMagicPlayer(PlayerId.ApiShape)
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
            api = useMagicPlayer(PlayerId.ApiObjects)
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
            api = useMagicPlayer(PlayerId.ApiVidM)
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
            api = useMagicPlayer(PlayerId.ApiAudM)
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
      const screen = render(createVideoPlayer(PlayerId.ApiVPlay), gc)
      await screen.getByTestId(TestId.Play).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')
    })

    it('pause() after play() sets paused=true', async () => {
      const screen = render(createVideoPlayer(PlayerId.ApiVPause), gc)
      await screen.getByTestId(TestId.Play).click()
      await nextTick()
      await screen.getByTestId(TestId.Pause).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Paused))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('false')
    })

    it('togglePlay() toggles playing state', async () => {
      const screen = render(createVideoPlayer(PlayerId.ApiVToggle), gc)

      await screen.getByTestId(TestId.Toggle).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Toggle).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('false')
    })

    it('mute() sets muted=true', async () => {
      const screen = render(createVideoPlayer(PlayerId.ApiVMute), gc)
      await screen.getByTestId(TestId.Mute).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Muted))
        .toHaveTextContent('true')
    })

    it('unmute() sets muted=false', async () => {
      const screen = render(createVideoPlayer(PlayerId.ApiVUnmute), gc)
      await screen.getByTestId(TestId.Mute).click()
      await nextTick()
      await screen.getByTestId(TestId.Unmute).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Muted))
        .toHaveTextContent('false')
    })

    it('seek() updates currentTime', async () => {
      const screen = render(createVideoPlayer(PlayerId.ApiVSeek), gc)
      await screen.getByTestId(TestId.Seek10).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.CurrentTime))
        .toHaveTextContent('10')
    })
  })

  describe('audio api state mutations', () => {
    it('play() sets playing=true', async () => {
      const screen = render(createAudioPlayer(PlayerId.ApiAPlay), gc)
      await screen.getByTestId(TestId.Play).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Playing))
        .toHaveTextContent('true')
    })

    it('pause() sets paused=true', async () => {
      const screen = render(createAudioPlayer(PlayerId.ApiAPause), gc)
      await screen.getByTestId(TestId.Play).click()
      await nextTick()
      await screen.getByTestId(TestId.Pause).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Paused))
        .toHaveTextContent('true')
    })

    it('mute()/unmute() toggles muted', async () => {
      const screen = render(createAudioPlayer(PlayerId.ApiAMute), gc)
      await screen.getByTestId(TestId.Mute).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Muted))
        .toHaveTextContent('true')

      await screen.getByTestId(TestId.Unmute).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Muted))
        .toHaveTextContent('false')
    })
  })

  describe('initial state defaults', () => {
    it('starts with all boolean states false', async () => {
      render(createVideoPlayer(PlayerId.ApiDefaults), gc)
      await nextTick()

      for (const id of [TestId.Playing, TestId.Paused, TestId.Muted, TestId.Started, TestId.Fullscreen]) {
        await expect
          .element(page.getByTestId(id))
          .toHaveTextContent('false')
      }
    })

    it('volume defaults to 1', async () => {
      render(createVideoPlayer(PlayerId.ApiVolDefault), gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Volume))
        .toHaveTextContent('1')
    })

    it('currentTime defaults to 0', async () => {
      render(createVideoPlayer(PlayerId.ApiCtDefault), gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.CurrentTime))
        .toHaveTextContent('0')
    })

    it('duration defaults to 0', async () => {
      render(createVideoPlayer(PlayerId.ApiDurDefault), gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Duration))
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
          const api = useMagicPlayer(PlayerId.ApiMediaLoad)
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="${TestId.Loaded}">{{ loaded }}</span>
            <span data-test-id="${TestId.Duration}">{{ duration }}</span>
            <MagicPlayerProvider id="${PlayerId.ApiMediaLoad}" :options="opts">
              <MagicPlayerVideo />
            </MagicPlayerProvider>
          </div>
        `,
      })

      render(wrapper, gc)

      // Wait for video to load
      await expect
        .element(page.getByTestId(TestId.Loaded), { timeout: 10000 })
        .toHaveTextContent('true')

      // Duration should be set after loading
      const durationEl = document.querySelector(
        `[data-test-id="${TestId.Duration}"]`
      ) as HTMLElement
      const duration = parseFloat(durationEl.textContent || '0')
      expect(duration).toBeGreaterThan(0)
    }, 15000)
  })
})
