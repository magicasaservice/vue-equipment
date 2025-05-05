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
  const deferredLoading = shallowRef(false)

  const { id, mediaRef, srcType, src } = args

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { loaded } = toRefs(state)

  // Private functions
  function useNative() {
    const el = toValue(mediaRef)

    if (!el || !src) {
      return
    }

    el.src = src
    el.addEventListener(
      'loadeddata',
      () => {
        loaded.value = true
      },
      { once: true }
    )
  }

  async function useHlsJS(autoplay = false) {
    const el = toValue(mediaRef)

    if (!el) {
      return
    }

    // If autoplay is true, hls.startLoad() needs to be deferred until hls is ready
    deferredLoading.value = autoplay

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
        if (deferredLoading.value) {
          hls?.startLoad()
        }
      })

      useEventListener(mediaRef, 'pause', () => {
        hls?.stopLoad()
      })

      // Start loading once the user requested it,
      // separate from any autoplay logic
      useEventListener(mediaRef, 'play', () => {
        hls?.startLoad()
      })

      hls.loadSource(src)
      hls.attachMedia(el)
    }
  }

  // Public functions
  function initialize(autoplay = false) {
    if (srcType === 'native') {
      useNative()
    } else if (srcType === 'hls') {
      useHlsJS(autoplay)
    }
  }

  function destroy() {
    hls?.destroy()
    deferredLoading.value = false
  }

  return {
    initialize,
    destroy,
  }
}

export type UsePlayerRuntimeReturn = ReturnType<typeof usePlayerRuntime>
