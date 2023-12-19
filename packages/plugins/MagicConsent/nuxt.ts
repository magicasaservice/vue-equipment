import {
  defineNuxtModule,
  createResolver,
  addComponent,
  addImports,
  extendViteConfig,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/MagicConsent',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Transpile MagicConsent so that it won’t clash with useCookies
    nuxt.options.build.transpile.push('universal-cookie')
    nuxt.options.build.transpile.push('@vueuse/integrations/useCookies')

    // Extend vite config to include universal-cookie
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('universal-cookie')
    })

    addComponent({
      filePath: resolver.resolve('src/components/MagicConsent.vue'),
      name: 'MagicConsent',
      global: true,
    })
    addImports({
      from: 'plugins/MagicConsent',
      name: 'useConsentApi',
    })
    addImports({
      from: 'plugins/MagicConsent',
      name: 'useConsentEmitter',
    })
  },
})
