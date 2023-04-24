import type { PackageIndexes } from './types'

import _metadata, {
  functions as _functions,
  packages as _packages,
} from './index.json'

export const metadata = _metadata as PackageIndexes
export const functions = _functions as PackageIndexes['functions']
export const packages = _packages as PackageIndexes['packages']

export const functionNames = functions.map((f) => f.name)

export function getFunction(name: string) {
  return metadata.functions.find((f) => f.name === name)
}
