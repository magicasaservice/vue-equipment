import { defineConfig } from 'vitepress'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://github.com/vitejs/vite/issues/5370
import { plugins, composables } from './../../../packages/metadata'
import { componentPreview } from './plugins/componentPreview'

const mappedComposables = getComposables()
const mappedPlugins = getPlugins()

const currentYear = new Date().getFullYear()

export default defineConfig({
  title: 'Vue Equipment',
  description: 'Our Frontend Toolkit, Free and Open Source',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  markdown: {
    preConfig(md) {
      md.use(componentPreview)
    },
    toc: {
      level: [2],
    },
  },
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
      copyright: `© ${currentYear} Magic as a Service™`,
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
      text: i.name.replace('Magic', 'Magic '),
      link: i.external || `/${i.package}/${i.name}/`,
    })),
  }
}
