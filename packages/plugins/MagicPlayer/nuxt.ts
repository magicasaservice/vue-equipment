import {} from '@nuxt/schema'
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicPlayer',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
      ignore: ['icons/*'],
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicPlayer',
      name: 'usePlayerApi',
    })
  },
})
