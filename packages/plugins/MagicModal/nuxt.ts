import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/MagicModal',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })
    addImports({
      from: '@lugins/MagicModal',
      typeFrom: 'plugins/MagicModal',
      name: 'useModalApi',
    })
    addImports({
      from: 'plugins/MagicModal',
      typeFrom: 'plugins/MagicModal',
      name: 'useModalEmitter',
    })
  },
})
