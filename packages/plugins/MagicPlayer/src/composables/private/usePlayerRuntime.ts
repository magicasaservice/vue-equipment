import { shallowRef, toRefs, toValue, type MaybeRef, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { usePlayerState } from './usePlayerState'

import type Hls from 'hls.js'
import type { MagicPlayerOptions } from '../../types'

export type UsePlayerRuntimeArgs = {
  id: MaybeRef<string>
  mediaRef?: Ref<HTMLVideoElement | HTMLAudioElement | null>
  srcType?: MagicPlayerOptions['srcType']
  src?: string
}

export function usePlayerRuntime(args: UsePlayerRuntimeArgs) {
  let hls: Hls | undefined
  const defferedLoading = shallowRef(false)

  const { id, mediaRef, srcType, src } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { loaded } = toRefs(state)

  // Private functions
  function useNative() {
    const el = toValue(mediaRef)
    if (!el || !src) return
    el.src = src
    el.addEventListener(
      'loadeddata',
      () => {
        loaded.value = true
      },
      { once: true }
    )
  }

  async function useHlsJS() {
    const el = toValue(mediaRef)
    if (!el) return

    useEventListener(mediaRef, 'play', () => {
      // Since the autoplay event is faster than the hls initialization,
      // hls.startLoad() needs to be deferred until hls is ready
      defferedLoading.value = true
    })

    const { default: Hls } = await import('hls.js')

    hls = new Hls({ autoStartLoad: false })
    if (!Hls.isSupported()) {
      useNative()
    } else if (src) {
      hls.on(Hls.Events.FRAG_LOADED, () => {
        loaded.value = true
      })

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        toValue(mediaRef)?.dispatchEvent(new Event('suspend'))
      })

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (defferedLoading.value) {
          hls?.startLoad()
        }
      })

      useEventListener(mediaRef, 'pause', () => {
        hls?.stopLoad()
      })

      // If the user pauses the video and then plays it again,
      // hls.startLoad() needs to be called. Best to use a seperate watcher for this
      useEventListener(mediaRef, 'play', () => {
        hls?.startLoad()
      })

      hls.loadSource(src)
      hls.attachMedia(el)
    }
  }

  // Public functions
  function initialize() {
    if (srcType === 'native') {
      useNative()
    } else if (srcType === 'hls') {
      useHlsJS()
    }
  }

  function destroy() {
    hls?.destroy()
    defferedLoading.value = false
  }

  return {
    initialize,
    destroy,
  }
}

export type UsePlayerRuntimeReturn = ReturnType<typeof usePlayerRuntime>
