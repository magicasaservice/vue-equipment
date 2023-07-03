import { defineNuxtModule, addPlugin, resolvePath } from '@nuxt/kit'

import metadata from '../../metadata/index.json'

import type { Import, Preset } from 'unimport'

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

    nuxt.hook('imports:sources', (sources: (Import | Preset)[]) => {
      sources.push({
        from: '@maas/vue-equipment/composables',
        imports: composables,
        priority: -1,
      })
    })
  },
})
