import {} from '@nuxt/schema'
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicDrawer',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Hotfix
    // Waiting for https://github.com/xiel/wheel-gestures/pull/707
    nuxt.options.build.transpile.push('wheel-gestures')

    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })
    addImports({
      from: '@maas/vue-equipment/plugins/MagicDrawer',
      name: 'useDrawerApi',
    })
    addImports({
      from: '@maas/vue-equipment/plugins/MagicDrawer',
      name: 'useDrawerEmitter',
    })
  },
})
