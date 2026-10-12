import type { ContentNavigationItem } from '@nuxt/content'

export function useDocsNavigation() {
  return useAsyncData<Array<ContentNavigationItem>>('docs-navigation', () =>
    queryCollectionNavigation('docs')
  )
}
