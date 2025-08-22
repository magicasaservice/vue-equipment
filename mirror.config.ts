import { defineConfig, components } from '@maas/mirror'

export default defineConfig({
  components,
  tokens: [
    {
      // Build application
      include: [{ src: 'config' }],
      source: [
        {
          target: 'application',
          selector: ':root, [data-color-mode="light"]',
          files: [
            {
              src: 'application',
              tokens: {
                ignore: [
                  '**/symbol',
                  '**/symbol/**',
                  '**/color',
                  '**/dimension/spacing/**',
                ],
              },
            },
            {
              src: 'theme/vueEquipmentLight',
            },
          ],
        },
      ],
    },
    {
      // Build /component/*
      include: [
        { src: 'config' },
        { src: 'application' },
        { src: 'theme/vueEquipmentLight' },
      ],
      source: components?.map((component) => ({
        target: `component/${component}`,
        selector: ':root, [data-color-mode="light"]',
        files: [
          {
            src: `component/${component}`,
            tokens: {
              ignore: [
                '**/config',
                '**/config/**',
                '**/symbol',
                '**/symbol/**',
                '!**/dimension/symbol/**',
                '!**/dimension/**/symbol/**',
                '!**/asset/symbol/**',
                '**/mask/**',
              ],
            },
          },
        ],
      })),
    },
    {
      // Build /theme/dark/application
      include: [{ src: 'config' }],
      source: [
        {
          target: 'theme/dark/application',
          selector: '[data-color-mode="dark"]',
          files: [{ src: 'theme/vueEquipmentDark' }],
        },
      ],
    },
    {
      // Build /theme/dark/component/*
      include: [
        { src: 'config' },
        { src: 'application' },
        { src: 'theme/vueEquipmentDark' },
      ],
      source: components.map((component) => ({
        target: `theme/dark/component/${component}`,
        selector: '[data-color-mode="dark"]',
        files: [
          {
            src: `component/${component}`,
            tokens: {
              ignore: ['**', '!**/color/**', '!**/boxShadow/**'],
            },
          },
        ],
      })),
    },
    {
      // Build breakpoint/sm/application
      include: [{ src: 'config' }, { src: 'application' }],
      source: [
        {
          target: 'breakpoint/sm/application',
          selector: ':root',
          atRule: ['@media (min-width: 640px)'],
          files: [
            {
              src: 'breakpoint/sm',
              tokens: {
                ignore: [
                  '**',
                  '!app/fontSize/surface/**',
                  '!app/letterSpacing/surface/**',
                ],
              },
            },
          ],
        },
      ],
    },
  ],
})
