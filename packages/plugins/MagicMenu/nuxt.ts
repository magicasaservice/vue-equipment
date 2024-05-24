import {} from '@nuxt/schema'
import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicMenu',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })
  },
})
