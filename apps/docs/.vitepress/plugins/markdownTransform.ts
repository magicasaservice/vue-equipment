import { join, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import type { Plugin } from 'vite'
import { getTypeDefinition, replacer } from './../utils'
import { functionNames } from '../../../../packages/metadata'

export function MarkdownTransform(): Plugin {
  const DIR_TYPES = resolve(__dirname, '../../../../types/composables')
  const hasTypes = existsSync(DIR_TYPES)

  if (!hasTypes) {
    console.warn('No types dist found! Run `pnpm build:types` first.')
  }

  return {
    name: 'vueuse-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null

      const [pkg, _name, i] = id.split('/').slice(-3)

      const name =
        functionNames.find((n) => n.toLowerCase() === _name.toLowerCase()) ||
        _name

      if (functionNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n')
        const firstHeader = code.search(/\n#{2,6}\s.+/)
        const sliceIndex =
          firstHeader < 0
            ? frontmatterEnds < 0
              ? 0
              : frontmatterEnds + 4
            : firstHeader

        const { header, footer } = await getFunctionMarkdown(pkg, name)

        if (hasTypes) code = replacer(code, footer, 'FOOTER', 'tail')

        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)
        code = code.replace(
          /(# (\w| )+?)\n/,
          `$1\n\n<FunctionInfo fn="${name}"/>\n`
        )
      }

      return code
    },
  }
}

const DIR_SRC = resolve(__dirname, '../../../../packages/')
const GITHUB_BLOB_URL =
  'https://github.com/magicasaservice/vue-equipment/blob/main/packages'

export async function getFunctionMarkdown(pkg: string, name: string) {
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${name}`

  const dirname = join(DIR_SRC, pkg, name)
  const demoPath = ['demo.vue', 'demo.client.vue'].find((i) =>
    existsSync(join(dirname, i))
  )

  // Fetch types for all composables
  const types =
    pkg === 'composables' ? await getTypeDefinition(pkg, name) : undefined

  let typingSection = ''

  if (types) {
    const code = `\`\`\`typescript\n${types.trim()}\n\`\`\``
    typingSection =
      types.length > 1000
        ? `
## Type Declarations
<details>
<summary op50 italic cursor-pointer select-none>Show Type Declarations</summary>

${code}

</details>
`
        : `\n## Type Declarations\n\n${code}`
  }

  const demoSection = demoPath
    ? demoPath.endsWith('.client.vue')
      ? `
<script setup>
  import { defineAsyncComponent } from 'vue'
  const Demo = defineAsyncComponent(() => import('./${demoPath}'))
</script>

## Demo
<ClientOnly>
  <Suspense>
    <Demo/>
    <template #fallback>
      Loading demo...
    </template>
  </Suspense>
</ClientOnly>
`
      : `
<script setup>
  import Demo from \'./${demoPath}\'
</script>

## Demo
<DemoContainer>
  <p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a></p>
  <Demo/>
</DemoContainer>
`
    : ''

  const header = demoSection
  const footer = `${typingSection}`

  return {
    header,
    footer,
  }
}
