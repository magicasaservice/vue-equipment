import { ref } from 'vue'

export type UseMetaViewportArgs = {
  content: string
}

export function useMetaViewport(args?: UseMetaViewportArgs) {
  const content =
    args?.content ||
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'

  const metaViewport = ref<string | undefined>(undefined)

  function setMetaViewport() {
    const metaElement = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement

    metaViewport.value = metaElement.content
    metaElement.setAttribute('content', content)
  }

  function resetMetaViewport() {
    const metaElement = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement

    if (metaViewport.value) {
      metaElement.setAttribute('content', metaViewport.value)
    }
  }

  return {
    setMetaViewport,
    resetMetaViewport,
  }
}
