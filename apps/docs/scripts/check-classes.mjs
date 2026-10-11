// Fails when a Mirror utility class used in the docs app is not emitted by the
// generator. The class of bug this catches is invisible by construction:
// Tailwind silently emits nothing for a name that is not in the preset.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(here, '../app')
const utilities = JSON.parse(
  readFileSync(resolve(here, '../../../.maas/utilities.json'), 'utf8')
)

const emitted = new Set(utilities.classNames)

// Prefixes the generator owns. A literal starting with one of these must
// resolve to an emitted class; anything else is Tailwind's own namespace.
const owned = /^(bg|text|border|border-[tblr]|divide|type|focus)-/

// Tailwind utilities that share a prefix with a Mirror namespace but are not
// Mirror's to emit.
const passthrough =
  /^(?:text-(?:left|right|center|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)|border(?:-[tblrxyse])?(?:-(?:\d+|\[.*\]|none|solid|dashed|dotted|hidden))?|divide-[xy](?:-(?:\d+|\[.*\]|reverse))?|bg-(?:transparent|current|inherit|none|clip-\w+|(?:linear|radial|conic)-[\w./%[\]-]+)|text-(?:current|inherit|transparent))$/

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    // Only source that can carry a class attribute. `main.css` writes rules
    // against `--app-*` custom properties, never against utility names.
    return statSync(path).isDirectory()
      ? walk(path)
      : /\.(vue|ts)$/.test(path)
        ? [path]
        : []
  })
}

const misses = []

for (const file of walk(appDir)) {
  // Style blocks hold CSS, not classes; their property names would otherwise
  // read as candidates.
  const source = readFileSync(file, 'utf8').replace(
    /<style[\s\S]*?<\/style>/g,
    ''
  )
  // Class literals only: strings in class attributes, :class bindings and
  // arrays. Matching every identifier would produce noise, so scan words that
  // look like utilities and filter to the namespaces the generator owns.
  for (const match of source.matchAll(/[\w:[\]/.-]*[\w\]]/g)) {
    const raw = match[0]
    // Strip Tailwind variants (hover:, lg:, dark:, focus-visible:, group-*:)
    const base = raw.replace(/^(?:[\w[\]&>*.:_-]+?:)+/, '').replace(/!$/, '')
    if (!owned.test(base)) {
      continue
    }
    if (base.startsWith('type-')) {
      if (!emitted.has(base) && !/^type-(surface|component)-/.test(base)) {
        continue
      }
      if (emitted.has(base)) {
        continue
      }
      misses.push({ file, class: base })
      continue
    }
    if (passthrough.test(base)) {
      continue
    }
    if (emitted.has(base)) {
      continue
    }
    misses.push({ file, class: base })
  }
}

if (misses.length) {
  const byClass = new Map()
  for (const miss of misses) {
    const files = byClass.get(miss.class) ?? new Set()
    files.add(miss.file.replace(`${appDir}/`, ''))
    byClass.set(miss.class, files)
  }
  console.error(`${byClass.size} class name(s) not in .maas/utilities.json:\n`)
  for (const [name, files] of [...byClass].sort()) {
    console.error(`  ${name}\n    ${[...files].join('\n    ')}`)
  }
  process.exit(1)
}

console.log(`OK: every Mirror utility in app/ exists in the generated preset.`)
