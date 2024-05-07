import {} from '@nuxt/schema'
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImportsDir,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicMarquee',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })
  },
})
