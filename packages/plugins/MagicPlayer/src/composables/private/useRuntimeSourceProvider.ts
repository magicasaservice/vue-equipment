import { ref, onMounted, onUnmounted, toValue, type Ref } from 'vue'

import type { UseRuntimeSourceProviderArgs } from '../../types'
import type Hls from 'hls.js'

export type UseRuntimeSourceProviderReturn = {
  loaded: Ref<boolean>
}

export function useRuntimeSourceProvider(
  args: UseRuntimeSourceProviderArgs,
): UseRuntimeSourceProviderReturn {
  let hls: Hls | undefined
  const loaded = ref(false)

  const useNative = () => {
    const el = toValue(args.videoRef)
    if (!el) return
    el.src = args.src
    el.addEventListener(
      'loadeddata',
      () => {
        loaded.value = true
      },
      { once: true },
    )
    el.load()
  }

  const useHlsJS = async () => {
    const el = toValue(args.videoRef)
    if (!el) return
    const { default: Hls } = await import('hls.js')
    hls = new Hls()
    if (!Hls.isSupported()) {
      useNative()
    } else {
      hls.loadSource(args.src)
      hls.attachMedia(el)
      hls.on(Hls.Events.FRAG_LOADED, () => {
        loaded.value = true
      })
    }
  }

  onMounted(() => {
    if (args.srcType === 'native') {
      useNative()
    } else if (args.srcType === 'hls') {
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
