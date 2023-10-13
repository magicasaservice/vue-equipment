import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/MagicNoise',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicNoise.vue'),
      name: 'MagicNoise',
      global: true,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicNoise',
      name: 'useNoiseApi',
    })
  },
})
