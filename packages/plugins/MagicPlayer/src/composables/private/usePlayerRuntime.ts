import { ref, watch, onMounted, onUnmounted, toValue, type MaybeRef } from 'vue'
import { usePlayerStateEmitter } from './usePlayerStateEmitter'

import type Hls from 'hls.js'
import type { SourceType } from '../../types'

export type UsePlayerRuntimeArgs = {
  id: MaybeRef<string>
  mediaRef?: MaybeRef<HTMLVideoElement | undefined>
  srcType?: SourceType
  src?: string
}

export function usePlayerRuntime(args: UsePlayerRuntimeArgs) {
  let hls: Hls | undefined
  const loaded = ref(false)

  const { mediaRef, srcType, src } = args

  const useNative = () => {
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
    el.load()
  }

  const useHlsJS = async () => {
    const el = toValue(mediaRef)
    if (!el) return
    const { default: Hls } = await import('hls.js')
    hls = new Hls()
    if (!Hls.isSupported()) {
      useNative()
    } else if (src) {
      hls.loadSource(src)
      hls.attachMedia(el)
      hls.on(Hls.Events.FRAG_LOADED, () => {
        loaded.value = true
      })
    }
  }

  onMounted(() => {
    if (srcType === 'native') {
      useNative()
    } else if (srcType === 'hls') {
      useHlsJS()
    }
  })

  onUnmounted(() => {
    hls?.destroy()
  })

  const emitter = usePlayerStateEmitter()

  // Listen to updates
  emitter.on('update', (payload) => {
    if (payload.id !== toValue(args.id)) return

    if (payload.api === 'runtime') {
      switch (payload.key) {
        case 'loaded':
          loaded.value = payload.value as boolean
          break
      }
    }
  })

  // Emit updates
  watch(loaded, (value) => {
    emitter.emit('update', {
      id: toValue(args.id),
      api: 'runtime',
      key: 'loaded',
      value,
    })
  })

  return {
    loaded,
  }
}

export type UsePlayerRuntimeReturn = ReturnType<typeof usePlayerRuntime>
