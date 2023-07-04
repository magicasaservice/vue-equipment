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

    const resolver = createResolver(import.meta.url)

    nuxt.options.build.transpile.push('@maas/vue-equipment')
    nuxt.options.alias = nuxt.options.alias || {}

    // Aliases
    const packages = ['plugins', 'composables']
    packages.forEach((pkg) => {
      nuxt.options.alias[`@maas/vue-equipment/${pkg}`] =
        nuxt.options.alias[`@maas/vue-equipment/${pkg}`] ||
        resolver.resolve(`../${pkg}`)
    })

    // Plugins
    if (options.autoImportPlugins) {
      plugins = metadata.functions
        .filter((fn) => fn.package === 'plugins')
        .map((fn) => fn.name)
    } else {
      plugins = options.plugins || []
    }

    for (const plugin of plugins) {
      const nuxtPlugin = await resolver.resolvePath(
        `@maas/vue-equipment/plugins/${plugin}/nuxt`
      )
      addPlugin(nuxtPlugin)
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
    })
  },
})
