import { shallowRef, toRefs, toValue, type MaybeRef, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useMagicError } from '@maas/vue-equipment/plugins/MagicError'
import { usePlayerState } from './usePlayerState'

import type Hls from 'hls.js'
import type { MagicPlayerOptions } from '../../types'

export type UsePlayerRuntimeArgs = {
  id: MaybeRef<string>
  mediaRef?: Ref<HTMLVideoElement | HTMLAudioElement | null>
  srcType?: MagicPlayerOptions['srcType']
  src?: string
  debug?: boolean
}

export function usePlayerRuntime(args: UsePlayerRuntimeArgs) {
  let hls: Hls | undefined
  const deferredLoading = shallowRef(false)

  const { id, mediaRef, srcType, src, debug = false } = args

  const { logWarning, throwError } = useMagicError({
    prefix: 'MagicPlayer',
    source: 'usePlayerRuntime',
  })

  const { initializeState } = usePlayerState(toValue(id))
  const state = initializeState()
  const { loaded } = toRefs(state)

  // Private functions
  function handleHlsRuntimeError(args: {
    data: { fatal: boolean; type: string; details?: string }
    hls?: Hls
  }) {
    const { data, hls } = args
    const error = new Error(data.details || 'HLS error')

    if (!data.fatal) {
      if (debug) {
        logWarning(
          `HLS Non-fatal error [${data.type}]: ${data.details || 'Unknown'}`
        )
      }
      return
    }

    switch (data.type) {
      case 'networkError':
        throwError({
          message: 'HLS network error',
          errorCode: 'hls_network_error',
          cause: error,
        })
        break
      case 'mediaError':
        try {
          if (hls) {
            hls.recoverMediaError()
            if (debug) {
              logWarning('HLS media error recovered')
            }
            return
          }
        } catch (recoveryError) {
          throwError({
            message: 'HLS media recovery failed',
            errorCode: 'hls_media_recovery_failed',
            cause: recoveryError,
          })
        }

        throwError({
          message: 'HLS media error',
          errorCode: 'hls_media_error',
          cause: error,
        })
        break
      default:
        throwError({
          message: 'HLS fatal error',
          errorCode: 'hls_fatal_error',
          cause: error,
        })
    }
  }

  function useNative() {
    const el = toValue(mediaRef)

    if (!el || !src) {
      return
    }

    try {
      el.src = src

      el.addEventListener(
        'loadeddata',
        () => {
          loaded.value = true
        },
        { once: true }
      )
    } catch (error) {
      throwError({
        message: 'Player initialization failed',
        errorCode: 'player_initialization_failed',
        cause: error,
      })
    }
  }

  async function useHlsJS(autoplay = false) {
    const el = toValue(mediaRef)

    if (!el) {
      return
    }

    // If autoplay is true, hls.startLoad() needs to be deferred until hls is ready
    deferredLoading.value = autoplay

    try {
      const { default: Hls } = await import('hls.js')
      hls = new Hls({ autoStartLoad: false })

      if (!Hls.isSupported()) {
        useNative()
        return
      }

      if (!src) {
        return
      }

      // HLS success events
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

      // HLS error handling
      hls.on(Hls.Events.ERROR, (_event, data) => {
        handleHlsRuntimeError({ data, hls })
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
    } catch (error) {
      throwError({
        message: 'Player initialization failed',
        errorCode: 'player_initialization_failed',
        cause: error,
      })
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
    try {
      hls?.destroy()
    } finally {
      hls = undefined
      deferredLoading.value = false
    }
  }

  return {
    initialize,
    destroy,
  }
}

export type UsePlayerRuntimeReturn = ReturnType<typeof usePlayerRuntime>
