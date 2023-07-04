import {
  defineNuxtModule,
  addPlugin,
  addImportsSources,
  createResolver,
  resolvePath,
} from '@nuxt/kit'

import metadata from '../../metadata/index.json'

export interface ModuleOptions {
  autoImportPlugins?: boolean
  autoImportComposables?: boolean
  plugins?: string[]
  composables?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@maas/vue-equipment',
    configKey: 'vueEquipment',
  },
  defaults: {
    autoImportPlugins: false,
    autoImportComposables: false,
    plugins: [],
    composables: [],
  },
  async setup(options, nuxt) {
    let plugins: string[]
    let composables: any[]

    // const resolver = createResolver(import.meta.url)

    nuxt.options.build.transpile.push('@maas/vue-equipment')
    nuxt.options.alias = nuxt.options.alias || {}

    nuxt.options.alias['@maas/vue-equipment/plugins'] =
      nuxt.options.alias['@maas/vue-equipment/plugins'] ||
      (await resolvePath('../plugins'))

    nuxt.options.alias['@maas/vue-equipment/composables'] =
      nuxt.options.alias['@maas/vue-equipment/plugins'] ||
      (await resolvePath('../composables'))

    console.log('nuxt.options.alias:', nuxt.options.alias)

    // Plugins
    if (options.autoImportPlugins) {
      plugins = metadata.functions
        .filter((fn) => fn.package === 'plugins')
        .map((fn) => fn.name)
    } else {
      plugins = options.plugins || []
    }

    for (const plugin of plugins) {
      const nuxtPlugin = await resolvePath(
        `@maas/vue-equipment/plugins/${plugin}/nuxt`
      )
      addPlugin(nuxtPlugin)
      console.log('nuxtPlugin:', nuxtPlugin)
    }

    // Composables
    if (options.autoImportComposables) {
      composables = metadata.functions
        .filter((fn) => fn.package === 'composables')
        .map((fn) => fn.name)
    } else {
      composables = options.composables || []
    }

    addImportsSources({
      from: '@maas/vue-equipment/composables',
      imports: composables,
      priority: -1,
    })
  },
})
