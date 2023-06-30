import { toValue } from '@vueuse/shared'
import { ref, onMounted, onUnmounted } from 'vue'

import type { MaybeRef } from '@vueuse/shared'
import type { RuntimeSourceProvider } from './../types'
import type Hls from 'hls.js'

export function useRuntimeSourceProvider(
  target: MaybeRef<HTMLMediaElement | null | undefined>,
  provider: RuntimeSourceProvider,
  source: string
) {
  let hls: Hls | undefined
  const loaded = ref(false)

  const useNative = () => {
    const el = toValue(target)
    if (!el) return
    el.src = source
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
    const el = toValue(target)
    if (!el) return
    const { default: Hls } = await import('hls.js')
    hls = new Hls()
    if (!Hls.isSupported()) {
      useNative()
    } else {
      hls.loadSource(source)
      hls.attachMedia(el)
      hls.on(Hls.Events.FRAG_LOADED, () => {
        loaded.value = true
      })
    }
  }

  onMounted(() => {
    if (provider === 'file') {
      useNative()
    } else if (provider === 'hls') {
      useHlsJS()
    }
  })

  onUnmounted(() => {
    hls?.destroy()
  })

  return {
    loaded,
  }
}

export type UseRuntimeSourceProvider = ReturnType<
  typeof useRuntimeSourceProvider
>
