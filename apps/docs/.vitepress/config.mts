import { defineConfig } from 'vitepress'
// https://github.com/vitejs/vite/issues/5370
import { metadata } from './../../../packages/metadata'

const ComposablesSideBar = getComposablesSideBar()
const PluginsSideBar = getPluginsSideBar()

export default defineConfig({
  title: 'Vue Equipment',
  description:
    'A magic collection of Vue composables, plugins, components and directives',
  themeConfig: {
    logo: '/favicon.svg',
    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2023 Magic as a Service™',
    },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Composables',
        link: '/composables/',
      },
      {
        text: 'Plugins',
        link: '/plugins/',
      },
    ],
    sidebar: {
      '/composables/': [ComposablesSideBar],
      '/plugins/': [PluginsSideBar],
    },
  },
  srcDir: './../../packages',
  srcExclude: ['**/*.json'],
  vite: {
    configFile: './vite.config.ts',
  },
})

function getComposablesSideBar() {
  const functions = metadata.functions.filter(
    (i) => !i.internal && i.package === 'composables'
  )
  return {
    text: 'Composables',
    items: functions.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}

function getPluginsSideBar() {
  const functions = metadata.functions.filter(
    (i) => !i.internal && i.package === 'plugins'
  )

  return {
    text: 'Plugins',
    items: functions.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}
