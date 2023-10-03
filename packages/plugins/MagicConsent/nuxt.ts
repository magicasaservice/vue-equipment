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
    nuxt.options.build.transpile.push('universal-cookie')

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
      from: '@maas/vue-equipment/plugins/MagicConsent',
      name: 'useConsentApi',
    })
    addImports({
      from: '@maas/vue-equipment/plugins/MagicConsent',
      name: 'useConsentEmitter',
    })
  },
})
