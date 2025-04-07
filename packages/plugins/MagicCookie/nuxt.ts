import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
  extendViteConfig,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicCookie',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Transpile MagicCookie so that it won’t clash with useCookies
    nuxt.options.build.transpile.push('universal-cookie')
    nuxt.options.build.transpile.push('@vueuse/integrations/useCookies')

    // Extend vite config to include universal-cookie
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('universal-cookie')
    })

    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
    })

    addImports({
      from: '@maas/vue-equipment/plugins/MagicCookie',
      name: 'useMagicCookie',
    })
  },
})
