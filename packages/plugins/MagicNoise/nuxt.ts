import {} from '@nuxt/schema'
import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicNoise',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicNoise.vue'),
      name: 'MagicNoise',
      global: true,
    })
  },
})
