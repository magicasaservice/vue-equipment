import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicTray',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })
    addImports({
      from: '@maas/vue-equipment/plugins/MagicTray',
      name: 'useMagicTray',
    })
  },
})
