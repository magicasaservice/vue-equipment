import { defineConfig } from 'vitepress'
import { metadata } from '../metadata/metadata'

const ComposablesSideBar = getComposablesSideBar()

export default defineConfig({
  title: 'VueEquipment',
  description:
    'A magic collection of Vue composables, plugins, components and directives',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  themeConfig: {
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
    },
  },
})

function getComposablesSideBar() {
  const functions = metadata.functions.filter((i) => !i.internal)

  return {
    text: 'Composables',
    items: functions.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
    link: functions[0].external || `/${functions[0].package}/README`,
  }
}
