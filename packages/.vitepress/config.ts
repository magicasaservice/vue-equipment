import { defineConfig } from 'vitepress'
import { metadata } from '../metadata/metadata'

const ComposablesSideBar = getComposablesSideBar()
const PluginsSideBar = getPluginsSideBar()

export default defineConfig({
  title: 'Vue Equipment',
  description:
    'A magic collection of Vue composables, plugins, components and directives',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    logo: '/favicon.svg',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Magic as a Service GmbH',
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
