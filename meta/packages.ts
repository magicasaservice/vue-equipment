import type { PackageManifest } from '@maas/vue-equipment/metadata'

export const packages: PackageManifest[] = [
  {
    name: 'metadata',
    display: 'Metadata for Vue Equipment packages',
    manualImport: true,
    utils: true,
    target: 'node16',
  },
  {
    name: 'composables',
    display: 'Vue Equipment Composables',
    description: 'A magic collection of Vue composables',
  },
  {
    name: 'plugins',
    display: 'Vue Equipment Plugins',
    description: 'A magic collection of Vue plugins',
  },
]
