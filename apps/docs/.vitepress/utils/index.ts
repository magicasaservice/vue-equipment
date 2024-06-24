import { join, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { writeFile, readFile } from 'node:fs/promises'
import { remove } from 'fs-extra'
import type { PackageIndexes } from './../../../../packages/metadata'

const DIR_TYPES = resolve(__dirname, '../../../types/')

export async function updateImport({ packages, functions }: PackageIndexes) {
  for (const { name, dir, manualImport } of Object.values(packages)) {
    if (manualImport) continue

    const imports = functions
      .filter((i) => i.package === name)
      .map((f) => f.name)
      .sort()
      .map((name) => `export * from './${name}'`)

    await writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)

    // temporary file for export-size
    await remove(join(dir, 'index.mjs'))
  }
}

export function replacer(
  code: string,
  value: string,
  key: string,
  insert: 'head' | 'tail' | 'none' = 'none'
) {
  const START = `<!--${key}_STARTS-->`
  const END = `<!--${key}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = value ? `${START}\n${value}\n${END}` : `${START}${END}`

  if (!code.match(regex)) {
    if (insert === 'none') return code
    else if (insert === 'head') return `${target}\n\n${code}`
    else return `${code}\n\n${target}`
  }

  return code.replace(regex, target)
}

export async function getTypeDefinition(
  pkg: string,
  name: string
): Promise<string | undefined> {
  const typingFilepath = join(DIR_TYPES, `${pkg}/${name}/index.d.ts`)

  if (!existsSync(typingFilepath)) return

  let types = await readFile(typingFilepath, 'utf-8')

  if (!types) return

  // clean up types
  types = types
    .replace(/import\(.*?\)\./g, '')
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, '')
    .replace(/export {}/g, '')

  const prettier = await import('prettier')
  const formatted = await prettier.format(types, {
    semi: false,
    parser: 'typescript',
  })

  return formatted.trim()
}
