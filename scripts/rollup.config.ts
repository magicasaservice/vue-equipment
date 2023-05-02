import { resolve } from 'node:path'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import { PluginPure as pure } from 'rollup-plugin-pure'
import type { OutputOptions, Plugin, RollupOptions } from 'rollup'
import fg from 'fast-glob'
import { packages } from '../meta/packages'

const configs: RollupOptions[] = []

const pluginEsbuild = esbuild()
const pluginDts = dts()
const pluginPure = pure({
  functions: ['defineComponent'],
})

const externals = [
  '@vueuse/core',
  '@maas/vue-equipment/composables',
  '@maas/vue-equipment/plugins',
  '@maas/vue-equipment/metadata',
]

for (const {
  name,
  external,
  submodules,
  build,
  cjs,
  mjs,
  dts,
  target,
} of packages) {
  if (build === false) continue

  const functionNames = ['index']

  if (submodules)
    functionNames.push(
      ...fg
        .sync('*/index.ts', { cwd: resolve(`packages/${name}`) })
        .map((i) => i.split('/')[0])
    )

  for (const fn of functionNames) {
    const input =
      fn === 'index'
        ? `packages/${name}/index.ts`
        : `packages/${name}/${fn}/index.ts`

    const output: OutputOptions[] = []

    if (mjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.mjs`,
        format: 'es',
      })
    }

    if (cjs !== false) {
      output.push({
        file: `packages/${name}/dist/${fn}.cjs`,
        format: 'cjs',
      })
    }

    configs.push({
      input,
      output,
      plugins: [
        target ? esbuild({ target }) : pluginEsbuild,
        json(),
        pluginPure,
      ],
      external: [...externals, ...(external || [])],
    })

    if (dts !== false) {
      configs.push({
        input,
        output: {
          file: `packages/${name}/dist/${fn}.d.ts`,
          format: 'es',
        },
        plugins: [pluginDts],
        external: [...externals, ...(external || [])],
      })
    }
  }
}

export default configs
