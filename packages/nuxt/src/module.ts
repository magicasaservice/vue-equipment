import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import metadata from '../../metadata/index.json'

import type { Import, Preset } from 'unimport'

// Module options TypeScript interface definition
export interface ModuleOptions {
  autoImportPlugins?: boolean
  autoImportComposables?: boolean
  plugins?: string[]
  composables?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-equipment',
    configKey: 'vueEquipment',
  },
  // Default configuration options of the Nuxt module
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

    // Plugins
    if (options.autoImportPlugins) {
      plugins = metadata.functions
        .filter((fn) => fn.package === 'plugins')
        .map((fn) => fn.name)
    } else {
      plugins = options.plugins || []
    }

    for (const plugin of plugins) {
      const nuxtPlugin = resolver.resolve(`../../plugins/${plugin}/nuxt`)
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

    nuxt.hook('imports:sources', (sources: (Import | Preset)[]) => {
      sources.push({
        from: '@maas/vue-equipment/composables',
        imports: composables,
        priority: -1,
      })

      console.log('sources:', sources)
    })
  },
})