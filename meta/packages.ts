import type { PackageManifest } from '@vue-equipment/metadata'

export const packages: any[] = [
  {
    name: 'metadata',
    display: 'Metadata for VueEquipment packages',
    manualImport: true,
    iife: false,
    utils: true,
    target: 'node16',
  },
  {
    name: 'composables',
    display: 'VueEquipment Composables',
    description: 'A magic collection of Vue composables',
  },
]
