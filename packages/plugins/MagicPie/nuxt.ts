import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicPie',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicPie.vue'),
      name: 'MagicPie',
      global: true,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicPie',
      name: 'useMagicPie',
    })
  },
})
