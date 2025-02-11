import type { Config } from 'release-it'

export default {
  git: {
    commit: true,
    tag: true,
    push: true,
    commitMessage: 'release: v${version}',
    requireCleanWorkingDir: true,
    requireBranch: 'main',
  },
  github: {
    release: true,
    autoGenerate: true,
    preRelease: true, // TODO: Remove this for the stable release
  },
  npm: {
    allowSameVersion: true,
    tag: 'beta', // TODO: Remove this for the stable release
  },
  plugins: {
    '@release-it/bumper': {
      in: 'package.json',
      out: ['package.json', 'packages/*/package.json', 'apps/*/package.json'],
    },
  },
} satisfies Config
