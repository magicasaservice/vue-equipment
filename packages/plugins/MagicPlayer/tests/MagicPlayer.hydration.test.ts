import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import {
  renderToString,
  ssrInterpolate,
  ssrRenderAttr,
  ssrRenderComponent,
} from '@vue/server-renderer'
import MagicPlayerProvider from '../src/components/MagicPlayerProvider.vue'
import MagicPlayerVideo from '../src/components/MagicPlayerVideo.vue'
import { useMagicPlayer } from '../src/composables/useMagicPlayer'
import { PlayerId, TestId } from './enums'

import type { Component, ComponentInternalInstance } from 'vue'

const VIDEO_SRC =
  'https://stream.mux.com/kj7uNjRztuyNotBkAI55oUeVKSSN1C4ONrIYuYcRKxo/highest.mp4'

const PLAYLIST_SRCS = [VIDEO_SRC, VIDEO_SRC, VIDEO_SRC]

interface PlaylistPageContext {
  playlistIndex: number
  playlistCount: number
}

// The renderer does not export its buffer item type, so name what a page
// pushes: markup and rendered components
type SSRPushItem = string | ReturnType<typeof ssrRenderComponent>

/**
 * A page that reads the playlist state beside the provider, the way a counter
 * or a pair of skip buttons would. A single-file component compiles to both
 * render functions below. On the server the provider renders, and sets
 * itself up, before the counter after it; in the browser the whole template
 * renders before the provider sets up.
 */
function createPlaylistPage(
  playerId: PlayerId,
  overrides: Record<string, unknown> = {}
) {
  const options = {
    src: PLAYLIST_SRCS,
    preload: 'none' as const,
    playback: false as const,
    ...overrides,
  }

  function nextDisabled({ playlistIndex, playlistCount }: PlaylistPageContext) {
    return playlistIndex >= playlistCount - 1
  }

  return defineComponent({
    setup() {
      const { playlistIndex, playlistCount } = useMagicPlayer(playerId)
      return { playlistIndex, playlistCount }
    },
    render(context: PlaylistPageContext) {
      return h('div', [
        h(
          MagicPlayerProvider,
          { id: playerId, options },
          { default: () => [h(MagicPlayerVideo)] }
        ),
        h('span', { 'data-test-id': TestId.PlaylistCount }, [
          String(context.playlistCount),
        ]),
        h(
          'button',
          {
            'data-test-id': TestId.PlaylistNext,
            disabled: nextDisabled(context),
          },
          'Next'
        ),
      ])
    },
    ssrRender(
      context: PlaylistPageContext,
      push: (item: SSRPushItem) => void,
      parent: ComponentInternalInstance
    ) {
      push('<div>')
      push(
        ssrRenderComponent(
          MagicPlayerProvider,
          { id: playerId, options },
          { default: () => [h(MagicPlayerVideo)] },
          parent
        )
      )
      push(
        `<span data-test-id="${TestId.PlaylistCount}">${ssrInterpolate(context.playlistCount)}</span>`
      )
      push(
        `<button data-test-id="${TestId.PlaylistNext}"${ssrRenderAttr('disabled', nextDisabled(context) || null)}>Next</button>`
      )
      push('</div>')
    },
  })
}

/**
 * A page that reads the playlist state inside the provider, the way controls
 * placed in its slot would. Both the server and the browser set the provider
 * up before its slot renders.
 */
function createSlottedPlaylistPage(playerId: PlayerId) {
  const options = {
    src: PLAYLIST_SRCS,
    preload: 'none' as const,
    playback: false as const,
  }

  const PlaylistCounter = defineComponent({
    setup() {
      const { playlistCount } = useMagicPlayer(playerId)
      return () =>
        h('span', { 'data-test-id': TestId.PlaylistCount }, [
          String(playlistCount.value),
        ])
    },
  })

  return defineComponent({
    setup() {
      return () =>
        h(
          MagicPlayerProvider,
          { id: playerId, options },
          { default: () => [h(MagicPlayerVideo), h(PlaylistCounter)] }
        )
    },
  })
}

// Renders the page on the server, then hydrates that markup in the browser
// and collects everything Vue reports while it does.
async function renderAndHydrate(component: Component) {
  const html = await renderToString(createSSRApp(component))

  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  const messages: Array<string> = []
  const app = createSSRApp(component)
  app.config.warnHandler = (message) => {
    messages.push(message)
  }

  const originalError = console.error
  console.error = (...args: Array<unknown>) => {
    messages.push(args.map(String).join(' '))
  }

  try {
    app.mount(container)
    await nextTick()
  } finally {
    console.error = originalError
  }

  return {
    container,
    mismatches: messages.filter((message) => /hydration/i.test(message)),
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}

describe('MagicPlayer hydration', () => {
  let cleanup: (() => void) | undefined

  afterEach(() => {
    cleanup?.()
    cleanup = undefined
  })

  it('hydrates playlist state read beside the provider', async () => {
    const { container, mismatches, unmount } = await renderAndHydrate(
      createPlaylistPage(PlayerId.HydrationPlaylist)
    )
    cleanup = unmount

    expect(mismatches).toEqual([])

    await nextTick()
    expect(
      container.querySelector(`[data-test-id="${TestId.PlaylistCount}"]`)
        ?.textContent
    ).toBe('3')
    expect(
      container
        .querySelector(`[data-test-id="${TestId.PlaylistNext}"]`)
        ?.hasAttribute('disabled')
    ).toBe(false)
  })

  it('hydrates playlist state read inside the provider', async () => {
    const { container, mismatches, unmount } = await renderAndHydrate(
      createSlottedPlaylistPage(PlayerId.HydrationSlot)
    )
    cleanup = unmount

    expect(mismatches).toEqual([])

    await nextTick()
    expect(
      container.querySelector(`[data-test-id="${TestId.PlaylistCount}"]`)
        ?.textContent
    ).toBe('3')
  })

  it('hydrates a looping playlist without a mismatch on the video', async () => {
    const { container, mismatches, unmount } = await renderAndHydrate(
      createPlaylistPage(PlayerId.HydrationLoop, { loop: true })
    )
    cleanup = unmount

    expect(mismatches).toEqual([])
    expect(container.querySelector('video')?.loop).toBe(false)
  })
})
