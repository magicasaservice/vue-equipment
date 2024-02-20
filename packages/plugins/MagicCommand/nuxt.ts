import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
  addComponent,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicCommand',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    // addComponentsDir({
    //   path: resolver.resolve('src/components'),
    //   global: true,
    //   pathPrefix: false,
    // })

    // addImports({
    //   from: '@maas/vue-equipment/plugins/MagicDrawer',
    //   name: 'useDrawerApi',
    // })
    // addImports({
    //   from: '@maas/vue-equipment/plugins/MagicDrawer',
    //   name: 'useDrawerEmitter',
    // })
  },
})
