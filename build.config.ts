import { defineBuildConfig } from 'unbuild'
import unpluginVue from 'unplugin-vue'

export default defineBuildConfig({
  entries: ['./packages/composables', './packages/plugins'],
  clean: true,
  declaration: true,
  failOnWarn: false,
  externals: ['vue', '@vueuse/core', 'fontkit', 'mitt', 'animejs'],
  hooks: {
    'rollup:options'(_ctx, options) {
      if (Array.isArray(options.plugins)) {
        options.plugins.push(unpluginVue.rollup())
      }
    },
  },
})
