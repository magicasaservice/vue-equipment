import { defineMirrorConfig } from '@maas/mirror'

/**
 * Every target is emitted under a selector, and the selectors form a
 * specificity ladder so the generated files can load in any order:
 *
 *   (0,1,0)  base          :root, [data-color-mode="light"]
 *   (0,2,0)  breakpoint    :root:root, [data-color-mode][data-color-mode]
 *   (0,2,0)  colour mode   [data-color-mode="dark"][data-color-mode]
 *   (0,3,0)  theme         [data-theme="vue-equipment"][data-theme][data-theme]
 *   (0,4,0)  theme + mode  [data-color-mode="dark"] [data-theme="x"][data-theme][data-theme]
 *
 * Repeating an attribute selector adds one to the specificity without changing
 * what it matches. The base selector also names `[data-color-mode="light"]`
 * so a light subtree inside a dark document reads the base values again.
 */

export default defineMirrorConfig({
  source: [
    { type: 'git', repo: 'magicasaservice/mirror-tokens' },
    { type: 'local', path: './tokens' },
  ],
  options: {
    debug: false,
    platforms: ['css', 'js', 'ts', 'json'],
  },
  targets: {
    config: {
      selector: ':root, [data-color-mode="light"]',
      files: [
        {
          src: 'config',
          tokens: {
            ignore: ['**', '!**/color/palette/**'],
          },
        },
      ],
    },
    application: {
      include: [{ src: 'config' }],
      selector: ':root, [data-color-mode="light"]',
      files: [
        {
          src: 'application',
          tokens: {
            ignore: [
              '**/symbol',
              '**/symbol/**',
              '!**/fontFamily/component/symbol',
              '!**/fontWeight/component/symbol/**',
            ],
          },
        },
      ],
    },
    radii: {
      include: [{ src: 'config' }],
      selector: ':root, [data-color-mode="light"]',
      files: [
        {
          src: 'application',
          tokens: {
            ignore: ['**', '!**/radius/**'],
          },
        },
      ],
    },
    'theme/dark/application': {
      include: [{ src: 'config' }, { src: 'application' }],
      selector: '[data-color-mode="dark"][data-color-mode]',
      files: [
        {
          src: 'application',
          tokens: {
            ignore: ['**', '!**/color/**'],
          },
        },
        { src: 'theme/dark' },
      ],
    },
    'theme/vue-equipment/light/application': {
      include: [{ src: 'config' }],
      selector: '[data-theme="vue-equipment"][data-theme][data-theme]',
      files: [{ src: 'theme/vueEquipmentLight' }],
    },
    // The theme under dark mode, whichever of the two attributes sits further
    // up the tree
    'theme/vue-equipment/dark/application': {
      include: [{ src: 'config' }],
      selector: [
        '[data-color-mode="dark"][data-theme="vue-equipment"][data-theme][data-theme]',
        '[data-color-mode="dark"] [data-theme="vue-equipment"][data-theme][data-theme]',
        '[data-theme="vue-equipment"] [data-color-mode="dark"][data-color-mode][data-color-mode]',
      ].join(', '),
      files: [{ src: 'theme/vueEquipmentDark' }],
    },
    'breakpoint/sm/application': {
      include: [{ src: 'config' }, { src: 'application' }],
      selector: ':root:root, [data-color-mode][data-color-mode]',
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
  },
})
