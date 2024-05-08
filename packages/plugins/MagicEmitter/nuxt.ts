import {} from '@nuxt/schema'
import { defineNuxtModule, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicEmitter',
  },
  setup() {
    addImports({
      from: '@maas/vue-equipment/plugins/MagicEmitter',
      name: 'useMagicEmitter',
    })
  },
})
