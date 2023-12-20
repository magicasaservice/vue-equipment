import { defineConfig } from 'vitepress'
// https://github.com/vitejs/vite/issues/5370
import { metadata } from './../../../packages/metadata'

const composables = getComposables()
const plugins = getPlugins()

export default defineConfig({
  title: 'Vue Equipment',
  description:
    'A magic collection of Vue composables, plugins, components and directives',
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Docs', link: '/overview/introduction' },
      composables,
      plugins,
    ],
    sidebar: [
      {
        text: 'Overview',
        collapsed: false,
        items: [
          {
            text: 'Introduction',
            link: 'overview/introduction',
          },
          {
            text: 'Getting Started',
            link: 'overview/getting-started',
          },
        ],
      },
      composables,
      plugins,
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2023 Magic as a Service™',
    },
  },
  srcDir: './../..',
  srcExclude: ['**/*.json'],
  vite: {
    configFile: './vite.config.ts',
  },
  rewrites: {
    'apps/docs/src/content/index.md': 'index.md',
    'apps/docs/src/content/:folder/:file.md': ':folder/:file.md',
    'packages/plugins/:pkg/index.md': 'plugins/:pkg/index.md',
    'packages/composables/:cmp/index.md': 'composables/:cmp/index.md',
  },
})

function getComposables() {
  const functions = metadata.functions.filter(
    (i) => !i.internal && i.package === 'composables'
  )
  return {
    text: 'Composables',
    collapsed: false,
    items: functions.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}

function getPlugins() {
  const functions = metadata.functions.filter(
    (i) => !i.internal && i.package === 'plugins'
  )

  return {
    text: 'Plugins',
    collapsed: false,
    items: functions.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}
