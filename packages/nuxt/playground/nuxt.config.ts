export default defineNuxtConfig({
  modules: ['../src/module'],
  vueEquipment: {
    autoImportPlugins: true,
  },
  devtools: { enabled: true },
})
