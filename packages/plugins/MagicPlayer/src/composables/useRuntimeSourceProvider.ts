import { toValue } from '@vueuse/shared'
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

import type { MaybeRef } from '@vueuse/shared'
import type { SourceType } from './../types'
import type Hls from 'hls.js'

export type UseRuntimeSourceProviderReturn = {
  loaded: Ref<boolean>
}

export function useRuntimeSourceProvider(
  target: MaybeRef<HTMLMediaElement | null | undefined>,
  srcType: SourceType,
  source: string
): UseRuntimeSourceProviderReturn {
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
    if (srcType === 'native') {
      useNative()
    } else if (srcType === 'hls') {
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


