import { MaybeRef, toValue } from '@vueuse/shared'
import { ref, onMounted } from 'vue'
import type { RuntimeSourceProvider } from './../types'

export function useRuntimeSourceProvider(
  target: MaybeRef<HTMLMediaElement | null | undefined>,
  provider: RuntimeSourceProvider,
  source: string
) {
  const loaded = ref(false)

  const useHls = async () => {
    const el = toValue(target)
    if (!el) return
    const { default: Hls } = await import('hls.js')
    const hls = new Hls()
    if (!Hls.isSupported()) {
      return console.error('Hls is not supported')
    } else {
      hls.loadSource(source)
      hls.attachMedia(el)
      hls.on(Hls.Events.FRAG_LOADED, () => {
        loaded.value = true
      })
    }
  }

  const useFile = () => {
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

  onMounted(() => {
    if (provider === 'hls') {
      useHls()
    } else if (provider === 'file') {
      useFile()
    }
  })

  return {
    loaded,
  }
}

export type UseRuntimeSourceProvider = ReturnType<
  typeof useRuntimeSourceProvider
>
