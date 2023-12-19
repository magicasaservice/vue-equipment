import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/MagicToast',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    addComponent({
      filePath: resolver.resolve('src/components/MagicToast.vue'),
      name: 'MagicToast',
      global: true,
    })

    addImports({
      from: 'plugins/MagicToast',
      name: 'useToastApi',
    })

    addImports({
      from: 'plugins/MagicToast',
      name: 'useToastEmitter',
    })
  },
})
