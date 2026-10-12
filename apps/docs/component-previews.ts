import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { addComponent, addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { createHighlighter } from 'shiki'
import { mirrorDark, mirrorLight } from './shiki-theme'

interface ComponentPreviewsOptions {
  // Directories holding one folder per plugin or composable.
  roots: Array<string>
}

interface Demo {
  name: string
  path: string
}

export interface ComponentPreviewSource {
  filename: string
  code: string
  html: string
}

const directive = /^::component-preview\{src="([^"]+)"\}$/gm

const mapId = 'virtual:component-previews'
const sourcePrefix = 'virtual:component-preview-source/'
const updateEvent = 'component-previews:update'

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

// `packages/plugins/MagicDrawer/demo/DefaultDemo.vue` registers as
// `MagicDrawerDefaultDemo`.
export function demoName(path: string) {
  const owner = basename(dirname(dirname(path)))
  return `${capitalize(owner)}${basename(path, '.vue')}`
}

function listDemos(roots: Array<string>): Array<Demo> {
  return roots.flatMap((root) =>
    readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(root, entry.name, 'demo'))
      .filter((dir) => existsSync(dir))
      .flatMap((dir) =>
        readdirSync(dir)
          .filter((file) => file.endsWith('.vue'))
          .map((file) => join(dir, file))
      )
      .map((path) => ({ name: demoName(path), path }))
  )
}

/**
 * Turns `::component-preview{src="./demo/DefaultDemo.vue"}` into the name the
 * demo is registered under. The name depends on the path alone, so a page
 * cached by its markdown stays correct however often the demo changes.
 */
export function namePreviews({
  markdown,
  dir,
}: {
  markdown: string
  dir: string
}) {
  return markdown.replace(directive, (_match, src: string) => {
    const path = resolve(dir, src)

    if (!existsSync(path)) {
      throw new Error(`The preview ${src} does not exist at ${path}`)
    }

    return `::component-preview{name="${demoName(path)}"}`
  })
}

let highlighter: ReturnType<typeof createHighlighter> | undefined

// The pane under a demo is highlighted with the themes the page’s own code
// blocks use, and reads their `--shiki-*` variables the same way.
export async function readSource(
  path: string
): Promise<ComponentPreviewSource> {
  highlighter ??= createHighlighter({
    themes: [mirrorLight, mirrorDark],
    langs: ['vue'],
  })

  const code = readFileSync(path, 'utf8').trimEnd()
  const html = (await highlighter).codeToHtml(code, {
    lang: 'vue',
    themes: { default: mirrorLight.name, dark: mirrorDark.name },
    defaultColor: false,
  })

  return {
    filename: basename(path),
    code,
    // The pane brings its own `pre`, so only the `code` element is kept.
    html: html.replace(/^<pre[^>]*>/, '').replace(/<\/pre>$/, ''),
  }
}

function encode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64')
}

/**
 * The module a demo’s source loads from. Nuxt’s server build rewrites
 * expressions such as `typeof window` wherever they appear in its output,
 * string literals included, so the code and its markup travel base64 encoded
 * and are decoded where they arrive.
 */
export function sourceModule(source: ComponentPreviewSource) {
  return [
    'const decode = (value) =>',
    '  new TextDecoder().decode(',
    '    Uint8Array.from(atob(value), (character) => character.charCodeAt(0))',
    '  )',
    '',
    'export default {',
    `  filename: ${JSON.stringify(source.filename)},`,
    `  code: decode(${JSON.stringify(encode(source.code))}),`,
    `  html: decode(${JSON.stringify(encode(source.html))}),`,
    '}',
    '',
  ].join('\n')
}

export default defineNuxtModule<ComponentPreviewsOptions>({
  meta: {
    name: 'component-previews',
    configKey: 'componentPreviews',
  },
  defaults: {
    roots: [],
  },
  setup(options, nuxt) {
    const demos = listDemos(options.roots)
    const byName = new Map(demos.map((demo) => [demo.name, demo]))
    const byPath = new Map(demos.map((demo) => [demo.path, demo]))

    for (const demo of demos) {
      addComponent({ name: demo.name, filePath: demo.path, global: true })
    }

    // The source shown under a demo is a module of its own, read from the demo
    // file whenever that module loads. It never passes through the page
    // cache, so neither a build nor a running dev server can show it stale.
    addVitePlugin({
      name: 'component-previews',
      resolveId(id) {
        if (id === mapId || id.startsWith(sourcePrefix)) {
          return `\0${id}`
        }
        return undefined
      },
      async load(id) {
        if (id === `\0${mapId}`) {
          const loaders = demos.map(
            (demo) =>
              `  ${JSON.stringify(demo.name)}: () => import(${JSON.stringify(`${sourcePrefix}${demo.name}`)}),`
          )
          return `export default {\n${loaders.join('\n')}\n}\n`
        }

        if (id.startsWith(`\0${sourcePrefix}`)) {
          const demo = byName.get(id.slice(`\0${sourcePrefix}`.length))
          if (!demo) {
            return undefined
          }
          this.addWatchFile(demo.path)
          return sourceModule(await readSource(demo.path))
        }

        return undefined
      },
      // A demo is its own hot boundary, so the update stops at the demo and
      // never reaches its source module. The pane is told directly instead.
      async handleHotUpdate({ file, server }) {
        const demo = byPath.get(file)
        if (!demo) {
          return
        }
        server.ws.send({
          type: 'custom',
          event: updateEvent,
          data: { name: demo.name, source: await readSource(demo.path) },
        })
      },
    })

    nuxt.hook('content:file:beforeParse', ({ file }) => {
      if (!file.path?.endsWith('.md')) {
        return
      }
      file.body = namePreviews({
        markdown: String(file.body),
        dir: dirname(file.path),
      })
    })
  },
})
