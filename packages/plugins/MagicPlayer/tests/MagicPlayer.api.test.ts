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

const PLAYLIST_SRCS = [VIDEO_SRC, VIDEO_SRC, VIDEO_SRC]

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

      // Simulate media loading without a real network request
      const video = document.querySelector('video') as HTMLVideoElement
      video?.dispatchEvent(new Event('loadeddata'))

      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Loaded))
        .toHaveTextContent('true')
    })
  })

  describe('playlist', () => {
    function createPlaylistPlayer(
      playerId: PlayerId,
      overrides: Record<string, unknown> = {}
    ) {
      const opts = {
        src: PLAYLIST_SRCS,
        preload: 'none' as const,
        playback: false as const,
        ...overrides,
      }
      return defineComponent({
        components: { MagicPlayerProvider, MagicPlayerVideo },
        setup() {
          const api = useMagicPlayer(playerId)
          return { ...api, opts }
        },
        template: `
          <div>
            <span data-test-id="${TestId.PlaylistIndex}">{{ playlistIndex }}</span>
            <span data-test-id="${TestId.PlaylistCount}">{{ playlistCount }}</span>
            <span data-test-id="${TestId.Skipping}">{{ skipping }}</span>
            <button data-test-id="${TestId.PlaylistNext}" @click="next()">Next</button>
            <button data-test-id="${TestId.PlaylistPrev}" @click="prev()">Prev</button>
            <button data-test-id="${TestId.PlaylistGoTo1}" @click="goTo(1)">GoTo 1</button>
            <button data-test-id="${TestId.PlaylistGoTo2}" @click="goTo(2)">GoTo 2</button>
            <MagicPlayerProvider id="${playerId}" :options="opts">
              <MagicPlayerVideo />
            </MagicPlayerProvider>
          </div>
        `,
      })
    }

    it('exposes playlistIndex, playlistCount, next, prev, goTo', () => {
      let api: ReturnType<typeof useMagicPlayer> | undefined
      render(
        defineComponent({
          setup() {
            api = useMagicPlayer(PlayerId.PlApiShape)
            return {}
          },
          template: '<div />',
        })
      )

      expect(api!.playlistIndex).toBeDefined()
      expect(api!.playlistCount).toBeDefined()
      expect(typeof api!.next).toBe('function')
      expect(typeof api!.prev).toBe('function')
      expect(typeof api!.goTo).toBe('function')
    })

    it('playlistIndex starts at 0 and playlistCount reflects array length', async () => {
      render(createPlaylistPlayer(PlayerId.PlInit))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('0')
      await expect
        .element(page.getByTestId(TestId.PlaylistCount))
        .toHaveTextContent('3')
    })

    it('single string src gives playlistCount of 1', async () => {
      const opts = {
        src: VIDEO_SRC,
        preload: 'none' as const,
        playback: false as const,
      }
      render(
        defineComponent({
          components: { MagicPlayerProvider, MagicPlayerVideo },
          setup() {
            const api = useMagicPlayer(PlayerId.PlSingleSrc)
            return { ...api, opts }
          },
          template: `
            <div>
              <span data-test-id="${TestId.PlaylistIndex}">{{ playlistIndex }}</span>
              <span data-test-id="${TestId.PlaylistCount}">{{ playlistCount }}</span>
              <MagicPlayerProvider id="${PlayerId.PlSingleSrc}" :options="opts">
                <MagicPlayerVideo />
              </MagicPlayerProvider>
            </div>
          `,
        })
      )
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistCount))
        .toHaveTextContent('1')
      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('0')
    })

    it('next() increments playlistIndex', async () => {
      const screen = render(createPlaylistPlayer(PlayerId.PlNext))
      await nextTick()

      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('1')
    })

    it('next() does not advance past the last track without loop', async () => {
      const screen = render(createPlaylistPlayer(PlayerId.PlBoundaryNext))
      await nextTick()

      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()
      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()
      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('2')
    })

    it('next() wraps to 0 at the last track when loop is true', async () => {
      const screen = render(
        createPlaylistPlayer(PlayerId.PlLoopNext, { loop: true })
      )
      await nextTick()

      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()
      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()
      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('0')
    })

    it('prev() decrements playlistIndex', async () => {
      const screen = render(createPlaylistPlayer(PlayerId.PlPrev))
      await nextTick()

      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()
      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()
      await screen.getByTestId(TestId.PlaylistPrev).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('1')
    })

    it('prev() does not go below 0 without loop', async () => {
      const screen = render(createPlaylistPlayer(PlayerId.PlBoundaryPrev))
      await nextTick()

      await screen.getByTestId(TestId.PlaylistPrev).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('0')
    })

    it('prev() wraps to last track at index 0 when loop is true', async () => {
      const screen = render(
        createPlaylistPlayer(PlayerId.PlLoopPrev, { loop: true })
      )
      await nextTick()

      await screen.getByTestId(TestId.PlaylistPrev).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('2')
    })

    it('goTo() jumps to the given index', async () => {
      const screen = render(createPlaylistPlayer(PlayerId.PlGoTo))
      await nextTick()

      await screen.getByTestId(TestId.PlaylistGoTo2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PlaylistIndex))
        .toHaveTextContent('2')
    })

    it('skipping is true during navigation and clears after load', async () => {
      const screen = render(createPlaylistPlayer(PlayerId.PlSkipping))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Skipping))
        .toHaveTextContent('false')

      await screen.getByTestId(TestId.PlaylistNext).click()
      await nextTick()

      // With preload=none the media never fires loadeddata,
      // so skipping stays true until the track is actually loaded.
      await expect
        .element(page.getByTestId(TestId.Skipping))
        .toHaveTextContent('true')
    })
  })
})
