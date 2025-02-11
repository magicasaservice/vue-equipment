import { defineConfig } from 'vitepress'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://github.com/vitejs/vite/issues/5370
import { plugins, composables } from './../../../packages/metadata'
import { componentPreview } from './plugins/componentPreview'

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

const mappedComposables = getComposables()
const mappedPlugins = getPlugins()
const currentYear = new Date().getFullYear()

export default defineConfig({
  title: 'Vue Equipment',
  description: 'Our Frontend Toolkit, Free and Open Source',
  head: [
    ['link', { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' }],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
    ],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'og:image', content: '/images/og-image.jpg' }],
    ['meta', { name: 'og:image:width', content: '1200' }],
    ['meta', { name: 'og:image:height', content: '630' }],
    [
      'meta',
      {
        name: 'og:image:alt',
        content:
          'A v-shaped triangle carabiner with engraved small text on one side',
      },
    ],
    [
      'meta',
      { name: 'og:url', content: 'https://vue-equipment.maas.engineering' },
    ],
    [
      'meta',
      { name: 'og:title', content: 'Vue Equipment | Magic as a Service™' },
    ],
    [
      'meta',
      {
        name: 'description',
        content:
          'Our Frontend Toolkit, Free and Open Source. Built by Magic as a Service™',
      },
    ],
    [
      'meta',
      {
        name: 'og:description',
        content:
          'Our Frontend Toolkit, Free and Open Source. Built by Magic as a Service™',
      },
    ],
    ['meta', { name: 'og:type', content: 'website' }],
  ],
  markdown: {
    preConfig(md) {
      md.use(componentPreview)
    },
    toc: {
      level: [2],
    },
  },
  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
    nav: [
      { text: 'Overview', link: '/overview/introduction' },
      mappedPlugins,
      mappedComposables,
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
      mappedPlugins,
      mappedComposables,
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
