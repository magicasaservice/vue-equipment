import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImports,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/MagicConsent',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    nuxt.options.build.transpile.push('universal-cookie')

    addComponentsDir({
      path: resolver.resolve('src/components'),
      global: true,
      pathPrefix: false,
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
