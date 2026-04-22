import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-vue'

import { defineComponent, nextTick, reactive } from 'vue'
import MagicPlayerProvider from '../src/components/MagicPlayerProvider.vue'
import MagicPlayerVideo from '../src/components/MagicPlayerVideo.vue'
import MagicPlayerVideoControls from '../src/components/MagicPlayerVideoControls.vue'
import MagicPlayerTimeline from '../src/components/MagicPlayerTimeline.vue'
import MagicPlayerDisplayTime from '../src/components/MagicPlayerDisplayTime.vue'
import { useMagicPlayer } from '../src/composables/useMagicPlayer'
import { useMagicEmitter } from '../../MagicEmitter'
import { PlayerId, TestId } from './enums'

const VIDEO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'

const gc = {
  global: { components: { MagicPlayerTimeline, MagicPlayerDisplayTime } },
}


function createEventPlayer(playerId: PlayerId) {
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
      const emitter = useMagicEmitter()
      const events = reactive<string[]>([])

      emitter.on('onPlay', () => events.push('onPlay'))
      emitter.on('onPause', () => events.push('onPause'))
      emitter.on('onMute', () => events.push('onMute'))
      emitter.on('onUnmute', () => events.push('onUnmute'))
      emitter.on('onLoad', () => events.push('onLoad'))
      emitter.on('onStart', () => events.push('onStart'))
      emitter.on('onTouch', () => events.push('onTouch'))
      emitter.on('onDragStart', () => events.push('onDragStart'))
      emitter.on('onDragEnd', () => events.push('onDragEnd'))

      return { ...api, events, opts }
    },
    template: `
      <div>
        <button data-test-id="${TestId.Play}" @click="videoApi.play()">Play</button>
        <button data-test-id="${TestId.Pause}" @click="videoApi.pause()">Pause</button>
        <button data-test-id="${TestId.Mute}" @click="videoApi.mute()">Mute</button>
        <button data-test-id="${TestId.Unmute}" @click="videoApi.unmute()">Unmute</button>
        <span data-test-id="${TestId.Events}">{{ events.join(',') }}</span>
        <MagicPlayerProvider id="${playerId}" :options="opts">
          <MagicPlayerVideo />
          <MagicPlayerVideoControls :standalone="true" />
        </MagicPlayerProvider>
      </div>
    `,
  })
}

function getEventsText(): string {
  return document.querySelector(`[data-test-id="${TestId.Events}"]`)?.textContent || ''
}

describe('MagicPlayer - Events', () => {
  // Suppress MagicError unhandled rejections from play/pause race conditions.
  // When play() is called then immediately pause(), the browser aborts the play
  // promise which triggers MagicError.throwError inside a .catch() handler.
  let rejectHandler: (e: PromiseRejectionEvent) => void
  beforeEach(() => {
    rejectHandler = (e: PromiseRejectionEvent) => {
      if (e.reason?.name === 'MagicError') {
        e.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', rejectHandler)
  })
  afterEach(() => {
    window.removeEventListener('unhandledrejection', rejectHandler)
  })

  describe('play/pause events', () => {
    it('emits onPlay when play is called', async () => {
      const screen = render(createEventPlayer(PlayerId.EvtPlay), gc)
      await nextTick()

      await screen.getByTestId(TestId.Play).click()
      await nextTick()
      await nextTick()

      expect(getEventsText()).toContain('onPlay')
    })

    it('emits onPause when pause is called', async () => {
      const screen = render(createEventPlayer(PlayerId.EvtPause), gc)
      await nextTick()

      await screen.getByTestId(TestId.Play).click()
      await nextTick()

      await screen.getByTestId(TestId.Pause).click()
      await nextTick()
      await nextTick()

      expect(getEventsText()).toContain('onPause')
    })

    it('emits onPlay on first play', async () => {
      const screen = render(createEventPlayer(PlayerId.EvtStart), gc)
      await nextTick()

      await screen.getByTestId(TestId.Play).click()
      await nextTick()
      await nextTick()

      expect(getEventsText()).toContain('onPlay')
    })
  })

  describe('mute events', () => {
    it('emits onMute when mute is called', async () => {
      const screen = render(createEventPlayer(PlayerId.EvtMute), gc)
      await nextTick()

      await screen.getByTestId(TestId.Mute).click()
      await nextTick()
      await nextTick()

      expect(getEventsText()).toContain('onMute')
    })

    it('emits onUnmute when unmute is called', async () => {
      const screen = render(createEventPlayer(PlayerId.EvtUnmute), gc)
      await nextTick()

      await screen.getByTestId(TestId.Mute).click()
      await nextTick()

      await screen.getByTestId(TestId.Unmute).click()
      await nextTick()
      await nextTick()

      expect(getEventsText()).toContain('onUnmute')
    })
  })

  describe('touch event', () => {
    it('emits onTouch on pointerdown on provider', async () => {
      render(createEventPlayer(PlayerId.EvtTouch), gc)
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
      await nextTick()

      expect(getEventsText()).toContain('onTouch')

      document.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          isPrimary: true,
        })
      )
    })
  })
})
