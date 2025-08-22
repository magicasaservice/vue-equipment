import { defineNuxtModule, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@maas/vue-equipment/nuxt/MagicError',
  },
  setup() {
    addImports({
      from: '@maas/vue-equipment/plugins/MagicError',
      name: 'useMagicError',
    })
  },
})
