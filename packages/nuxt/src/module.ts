import {
  defineNuxtModule,
  addImportsSources,
  createResolver,
  installModule,
  extendViteConfig,
} from '@nuxt/kit'

import { plugins, composables } from '../../metadata/'

export interface ModuleOptions {
  plugins?: string[] | boolean
  composables?: string[] | boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@maas/vue-equipment/nuxt',
    configKey: 'vueEquipment',
  },
  defaults: {
    plugins: true,
    composables: true,
  },
  async setup(options, nuxt) {
    let mappedPlugins: string[]
    let mappedComposables: string[]

    const resolver = createResolver(import.meta.url)

    nuxt.options.build.transpile.push('@maas/vue-equipment')

    // Prevent vite from optimizing plugins
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps ?? {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude ?? []
      config.optimizeDeps.exclude.push('@maas/vue-equipment/plugins')
    })

    // Aliases
    const packages = ['plugins', 'composables', 'utils']
    nuxt.options.alias = nuxt.options.alias ?? {}

    packages.forEach((pkg) => {
      nuxt.options.alias[`@maas/vue-equipment/${pkg}`] =
        nuxt.options.alias[`@maas/vue-equipment/${pkg}`] ??
        resolver.resolve(`../${pkg}`)
    })

    // Plugins
    if (options.plugins === true) {
      mappedPlugins = plugins.map((fn) => fn.name)
    } else {
      mappedPlugins = options.plugins || []
    }

    for (const plugin of mappedPlugins) {
      // Install plugin
      const nuxtPlugin = await resolver.resolvePath(
        `@maas/vue-equipment/plugins/${plugin}/nuxt`
      )

      await installModule(nuxtPlugin)
    }

    // Composables
    if (options.composables === true) {
      mappedComposables = composables.map((fn) => fn.name)
    } else {
      mappedComposables = options.composables || []
    }

    addImportsSources({
      from: '@maas/vue-equipment/composables',
      imports: mappedComposables,
    })
  },
})
