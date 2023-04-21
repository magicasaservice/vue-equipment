import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
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

    sidebar: [
      {
        text: 'Composables',
        items: [
          { text: 'useScrollTo', link: '/composables/useScrollTo/' },
          { text: 'useEasings', link: '/composables/useEasings/' },
        ],
      },
    ],
  },
})
