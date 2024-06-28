import { defineConfig } from 'vitepress'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://github.com/vitejs/vite/issues/5370
import { plugins, composables } from './../../../packages/metadata'

const mappedComposables = getComposables()
const mappedPlugins = getPlugins()

export default defineConfig({
  title: 'Vue Equipment',
  description:
    'A magic collection of Vue composables, plugins, components and directives',
  head: [['link', { rel: 'icon', href: '/apps/docs/public/favicon.svg' }]], // TODO: fix this
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/overview/introduction' },
      mappedComposables,
      mappedPlugins,
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
      mappedComposables,
      mappedPlugins,
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2024 Magic as a Service™',
    },
  },
  srcDir: './../..',
  srcExclude: ['**/*.json'],
  vite: {
    configFile: './vite.config.mts',
    publicDir: './apps/docs/public',
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  },
  rewrites: {
    'apps/docs/src/content/index.md': 'index.md',
    'apps/docs/src/content/:folder/:file.md': ':folder/:file.md',
    'packages/plugins/:pkg/index.md': 'plugins/:pkg/index.md',
    'packages/composables/:cmp/index.md': 'composables/:cmp/index.md',
  },
})

function getComposables() {
  return {
    text: 'Composables',
    collapsed: false,
    items: composables.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}

function getPlugins() {
  return {
    text: 'Plugins',
    collapsed: false,
    items: plugins.map((i) => ({
      text: i.name,
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}
