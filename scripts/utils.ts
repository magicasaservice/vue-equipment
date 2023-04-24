import { join, resolve } from 'node:path'
import fs from 'fs-extra'

const DIR_TYPES = resolve(__dirname, '../types/packages')

async function getTypeDefinition(
  pkg: string,
  name: string
): Promise<string | undefined> {
  const typingFilepath = join(DIR_TYPES, `${pkg}/${name}/index.d.ts`)

  if (!fs.existsSync(typingFilepath)) return

  let types = await fs.readFile(typingFilepath, 'utf-8')

  if (!types) return

  // clean up types
  types = types
    .replace(/import\(.*?\)\./g, '')
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, '')
    .replace(/export {}/g, '')

  const prettier = await import('prettier')
  return prettier
    .format(types, {
      semi: false,
      parser: 'typescript',
    })
    .trim()
}

export { getTypeDefinition }
