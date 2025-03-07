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

export default defineConfig({
  title: 'Vue Equipment',
  description: 'Our Frontend Toolkit, Free and Open Source',
  head: [
    [
      'script',
      {
        src: 'https://stats.maas.earth/js/script.outbound-links.tagged-events.js',
        defer: 'true',
        'data-domain': 'vue.equipment',
      },
    ],
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
        name: 'og:description',
        content: 'Our Frontend Toolkit, Free and Open Source.',
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
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/magicasaservice/vue-equipment',
      },
    ],
    nav: [
      {
        text: 'Overview',
        items: [
          { link: '/overview/introduction', text: 'Introduction' },
          { link: '/overview/getting-started', text: 'Getting Started' },
        ],
      },
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
      {
        collapsed: false,
        items: [
          {
            text: 'Magic as a Service™',
            link: 'https://maas.engineering',
          },
          {
            text: 'Legal Notice',
            link: 'https://maas.engineering/legal-notice',
          },
          {
            text: 'Privacy Policy',
            link: 'https://maas.engineering/privacy-policy',
          },
          {
            text: 'GitHub',
            link: 'https://github.com/magicasaservice',
          },
        ],
      },
    ],
    footer: {
      message:
        'Engineered and Designed by <a href="https://maas.engineering" target="_blank" rel="noopener noreferrer">Magic as a Service™</a>',
      copyright: `Released under the <a
          href="https://github.com/magicasaservice/vue-equipment/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>`,
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
