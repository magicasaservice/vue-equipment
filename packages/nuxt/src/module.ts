import {
  defineNuxtModule,
  addImportsSources,
  createResolver,
  installModule,
} from '@nuxt/kit'

import metadata from '../../metadata/index.json'

export interface ModuleOptions {
  plugins?: string[] | boolean
  composables?: string[] | boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@maas/vue-equipment',
    configKey: 'vueEquipment',
  },
  defaults: {
    plugins: true,
    composables: true,
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
    if (options.plugins === true) {
      plugins = metadata.functions
        .filter((fn) => fn.package === 'plugins')
        .map((fn) => fn.name)
    } else {
      plugins = options.plugins || []
    }

    for (const plugin of plugins) {
      // Install plugin
      const nuxtPlugin = await resolver.resolvePath(
        `@maas/vue-equipment/plugins/${plugin}/nuxt`,
      )

      installModule(nuxtPlugin)
    }

    // Composables
    if (options.composables === true) {
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
