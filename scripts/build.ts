import { execSync as exec } from 'node:child_process'
import { consola } from 'consola'

const watch = process.argv.includes('--watch')

async function build() {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  consola.info('Generate Imports')
  // await updateImport(metadata)

  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, {
    stdio: 'inherit',
  })

  // await buildMetaFiles()
}

async function cli() {
  try {
    await build()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

if (require.main === module) {
  cli()
}

export { build }
