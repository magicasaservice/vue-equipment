import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicAccordion',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicAccordion',
      name: 'useMagicAccordion',
    })
  },
})
