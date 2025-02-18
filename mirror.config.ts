import {
  defineConfig,
  defaultConfig,
  type MirrorConfig,
  type TokenGroup,
} from '@maas/mirror'

const customConfig = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    source: [
      ...(defaultConfig.tokens!.source! as unknown as TokenGroup[]),
      {
        files: [
          {
            path: 'theme/dark',
            filename: {
              replace: [
                {
                  from: 'theme/dark',
                  to: 'theme/dark/application',
                },
              ],
            },
            selector: '[data-color-mode="dark"]',
            tokens: {
              ignore: ['**', '!app/color/**'],
            },
          },
        ],
      },
    ],
  },
} satisfies MirrorConfig

export default defineConfig(customConfig)
