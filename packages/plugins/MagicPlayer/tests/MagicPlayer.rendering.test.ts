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
const AUDIO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'

const gc = {
  global: {
    components: { MagicPlayerTimeline, MagicPlayerDisplayTime },
  },
}


function createVideoPlayer(
  playerId: PlayerId,
  overrides: Record<string, unknown> = {}
) {
  const opts = {
    src: VIDEO_SRC,
    mode: 'video' as const,
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
      useMagicPlayer(playerId)
      return { opts }
    },
    template: `
      <MagicPlayerProvider id="${playerId}" :options="opts">
        <MagicPlayerVideo />
        <MagicPlayerOverlay />
        <MagicPlayerPoster>
          <div data-test-id="poster-content">Poster</div>
        </MagicPlayerPoster>
        <MagicPlayerVideoControls :standalone="true" />
      </MagicPlayerProvider>
    `,
  })
}

function createAudioPlayer(
  playerId: PlayerId,
  overrides: Record<string, unknown> = {}
) {
  const opts = {
    src: AUDIO_SRC,
    mode: 'audio' as const,
    preload: 'none' as const,
    playback: false as const,
    ...overrides,
  }
  return defineComponent({
    components: {
      MagicPlayerProvider,
      MagicPlayerAudio,
      MagicPlayerAudioControls,
    },
    setup() {
      useMagicPlayer(playerId)
      return { opts }
    },
    template: `
      <MagicPlayerProvider id="${playerId}" :options="opts">
        <MagicPlayerAudio />
        <MagicPlayerAudioControls />
      </MagicPlayerProvider>
    `,
  })
}

describe('MagicPlayer - Rendering', () => {
  describe('provider', () => {
    it('sets data-id on provider', async () => {
      render(createVideoPlayer(PlayerId.RenderDataId), gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-id')).toBe('render-data-id')
    })

    it('sets data-mode to video by default', async () => {
      render(createVideoPlayer(PlayerId.RenderModeVideo), gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-mode')).toBe('video')
    })

    it('sets data-mode to audio when configured', async () => {
      render(createAudioPlayer(PlayerId.RenderModeAudio), gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-mode')).toBe('audio')
    })

    it('sets default data attributes to false', async () => {
      render(createVideoPlayer(PlayerId.RenderDefaults), gc)
      await nextTick()

      const provider = document.querySelector('.magic-player-provider')
      expect(provider!.getAttribute('data-playing')).toBe('false')
      expect(provider!.getAttribute('data-paused')).toBe('false')
      expect(provider!.getAttribute('data-started')).toBe('false')
      expect(provider!.getAttribute('data-muted')).toBe('false')
      expect(provider!.getAttribute('data-loaded')).toBe('false')
      expect(provider!.getAttribute('data-fullscreen')).toBe('false')
      expect(provider!.getAttribute('data-touched')).toBe('false')
      expect(provider!.getAttribute('data-waiting')).toBe('false')
    })

    it('renders slot content', async () => {
      render(createVideoPlayer(PlayerId.RenderSlot), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-overlay')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-video-controls')
      ).not.toBeNull()
    })
  })

  describe('video element', () => {
    it('renders video element with correct class', async () => {
      render(createVideoPlayer(PlayerId.RenderVideoEl), gc)
      await nextTick()

      const video = document.querySelector(
        '.magic-player-video'
      ) as HTMLVideoElement
      expect(video).not.toBeNull()
      expect(video.tagName).toBe('VIDEO')
    })

    it('video has playsinline attribute', async () => {
      render(createVideoPlayer(PlayerId.RenderVideoInline), gc)
      await nextTick()

      const video = document.querySelector(
        '.magic-player-video'
      ) as HTMLVideoElement
      expect(video.hasAttribute('playsinline')).toBe(true)
    })

    it('video has correct preload attribute', async () => {
      render(createVideoPlayer(PlayerId.RenderVideoPreload), gc)
      await nextTick()

      const video = document.querySelector(
        '.magic-player-video'
      ) as HTMLVideoElement
      expect(video.preload).toBe('none')
    })
  })

  describe('audio element', () => {
    it('renders audio element with correct class', async () => {
      render(createAudioPlayer(PlayerId.RenderAudioEl), gc)
      await nextTick()

      const audio = document.querySelector(
        '.magic-player-audio'
      ) as HTMLAudioElement
      expect(audio).not.toBeNull()
      expect(audio.tagName).toBe('AUDIO')
    })
  })

  describe('overlay', () => {
    it('overlay has data attributes', async () => {
      render(createVideoPlayer(PlayerId.RenderOverlayAttrs), gc)
      await nextTick()

      const overlay = document.querySelector('.magic-player-overlay')
      expect(overlay!.getAttribute('data-playing')).toBe('false')
      expect(overlay!.getAttribute('data-paused')).toBe('false')
      expect(overlay!.getAttribute('data-started')).toBe('false')
      expect(overlay!.getAttribute('data-loaded')).toBe('false')
      expect(overlay!.getAttribute('data-muted')).toBe('false')
    })
  })

  describe('poster', () => {
    it('poster is visible by default (not loaded, not started)', async () => {
      render(createVideoPlayer(PlayerId.RenderPosterVisible), gc)
      await nextTick()

      const poster = document.querySelector(
        '.magic-player-poster'
      ) as HTMLElement
      expect(poster.style.display).not.toBe('none')
    })

    it('poster renders slot content', async () => {
      render(createVideoPlayer(PlayerId.RenderPosterSlot), gc)
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.PosterContent))
        .toHaveTextContent('Poster')
    })
  })

  describe('video controls', () => {
    it('video controls have data attributes', async () => {
      render(createVideoPlayer(PlayerId.RenderVcAttrs), gc)
      await nextTick()

      const controls = document.querySelector(
        '.magic-player-video-controls'
      )
      expect(controls!.getAttribute('data-playing')).toBe('false')
      expect(controls!.getAttribute('data-paused')).toBe('false')
      expect(controls!.getAttribute('data-started')).toBe('false')
      expect(controls!.getAttribute('data-muted')).toBe('false')
      expect(controls!.getAttribute('data-dragging')).toBe('false')
      expect(controls!.getAttribute('data-fullscreen')).toBe('false')
    })

    it('standalone controls set data-standalone=true', async () => {
      render(createVideoPlayer(PlayerId.RenderVcStandalone), gc)
      await nextTick()

      const controls = document.querySelector(
        '.magic-player-video-controls'
      )
      expect(controls!.getAttribute('data-standalone')).toBe('true')
    })

    it('renders bar with inner content', async () => {
      render(createVideoPlayer(PlayerId.RenderVcBar), gc)
      await nextTick()

      expect(
        document.querySelector(
          '.magic-player-video-controls__bar--inner'
        )
      ).not.toBeNull()
    })

    it('renders timeline inside controls', async () => {
      render(createVideoPlayer(PlayerId.RenderVcTimeline), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-timeline')
      ).not.toBeNull()
    })
  })

  describe('audio controls', () => {
    it('audio controls have data attributes', async () => {
      render(createAudioPlayer(PlayerId.RenderAcAttrs), gc)
      await nextTick()

      const controls = document.querySelector(
        '.magic-player-audio-controls'
      )
      expect(controls!.getAttribute('data-playing')).toBe('false')
      expect(controls!.getAttribute('data-paused')).toBe('false')
      expect(controls!.getAttribute('data-started')).toBe('false')
      expect(controls!.getAttribute('data-muted')).toBe('false')
      expect(controls!.getAttribute('data-dragging')).toBe('false')
    })

    it('renders slot items', async () => {
      render(createAudioPlayer(PlayerId.RenderAcSlots), gc)
      await nextTick()

      expect(
        document.querySelector('[data-slot="play-toggle"]')
      ).not.toBeNull()
      expect(
        document.querySelector('[data-slot="display-time-current"]')
      ).not.toBeNull()
      expect(
        document.querySelector('[data-slot="display-time-duration"]')
      ).not.toBeNull()
      expect(
        document.querySelector('[data-slot="timeline"]')
      ).not.toBeNull()
    })
  })

  describe('timeline', () => {
    it('renders timeline elements', async () => {
      render(createVideoPlayer(PlayerId.RenderTl), gc)
      await nextTick()

      expect(
        document.querySelector('.magic-player-timeline__target')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-timeline__track')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-timeline__thumb')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-timeline__buffered')
      ).not.toBeNull()
      expect(
        document.querySelector('.magic-player-timeline__scrubbed')
      ).not.toBeNull()
    })
  })
})
