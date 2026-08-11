import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicDotMatrix',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicDotMatrix.vue'),
      name: 'MagicDotMatrix',
      global: true,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicDotMatrix',
      name: 'useMagicDotMatrix',
    })
  },
})
