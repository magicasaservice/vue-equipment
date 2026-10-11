import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { addComponent, defineNuxtModule } from '@nuxt/kit'

interface ComponentPreviewsOptions {
  // Directories holding one folder per plugin or composable.
  roots: Array<string>
}

interface Demo {
  name: string
  path: string
}

const directive = /^::component-preview\{src="([^"]+)"\}\n::$/gm

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

function fenceFor(code: string) {
  const longest = Math.max(
    0,
    ...Array.from(code.matchAll(/`+/g), (match) => match[0].length)
  )
  return '`'.repeat(Math.max(3, longest + 1))
}

/**
 * Expands `::component-preview{src="./demo/DefaultDemo.vue"}` into the
 * registered demo plus its source as a fence, so the page shows the file that
 * renders above it and the source is never copied into the markdown.
 */
export function expandPreviews({
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

    const code = readFileSync(path, 'utf8').trimEnd()
    const fence = fenceFor(code)

    return [
      `::component-preview{name="${demoName(path)}"}`,
      `${fence}vue [${basename(path)}]`,
      code,
      fence,
      '::',
    ].join('\n')
  })
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

    for (const demo of demos) {
      addComponent({ name: demo.name, filePath: demo.path, global: true })
    }

    // Nuxt Content caches a page by its markdown, which stays the same when
    // only a demo changes. Every cache key also covers the markdown options,
    // so the demos’ digest rides along there. This module has to run before
    // Nuxt Content for the option to reach it.
    const digest = createHash('sha256')
    for (const demo of demos) {
      digest.update(relative(nuxt.options.rootDir, demo.path))
      digest.update(readFileSync(demo.path))
    }
    const content = nuxt.options.content
    if (content) {
      content.build ??= {}
      content.build.markdown ??= {}
      Object.assign(content.build.markdown, { previews: digest.digest('hex') })
    }

    nuxt.hook('content:file:beforeParse', ({ file }) => {
      if (!file.path?.endsWith('.md')) {
        return
      }
      file.body = expandPreviews({
        markdown: String(file.body),
        dir: dirname(file.path),
      })
    })
  },
})
