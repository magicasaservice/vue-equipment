import {
  addComponent,
  addImports,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicToast',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicToastProvider.vue'),
      name: 'MagicToastProvider',
      global: true,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicToast',
      name: 'useMagicToast',
    })
  },
})
