import {} from '@nuxt/schema'
import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicToast',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicToast.vue'),
      name: 'MagicToast',
      global: true,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicToast',
      name: 'useToastApi',
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicToast',
      name: 'useToastEmitter',
    })
  },
})
