import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import type { NuxtPlugin } from '@nuxt/schema'
import metadata from '../../metadata/index.json'

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
    const resolver = createResolver(import.meta.url)

    if (options.autoImportPlugins) {
      plugins = metadata.functions
        .filter((fn) => fn.package === 'plugins')
        .map((fn) => fn.name)
    } else {
      plugins = options.plugins || []
    }

    for (const plugin of plugins) {
      const nuxtPlugin = resolver.resolve(`../../plugins/${plugin}/nuxt`)

      // const vuePlugin = await import(resolved)
      // const nuxtPlugin: unknown = defineNuxtPlugin((nuxtApp: any) => {
      //   nuxtApp.vueApp.use(vuePlugin[plugin])
      // })

      addPlugin(nuxtPlugin)
    }

    console.log(nuxt.options.plugins)
  },
})
