import type { PackageManifest } from '@vue-equipment/metadata'

export const packages: PackageManifest[] = [
  {
    name: 'metadata',
    display: 'Metadata for VueEquipment packages',
    manualImport: true,
    utils: true,
    target: 'node16',
  },
  {
    name: 'composables',
    display: 'VueEquipment Composables',
    description: 'A magic collection of Vue composables',
  },
]
