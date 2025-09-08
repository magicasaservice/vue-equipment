import type { MarkdownEnv, MarkdownRenderer, SfcBlock } from 'vitepress'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

// Regular expressions to match the custom component preview tag and script tags
const componentPreviewRegEx =
  /<(?:component-preview|ComponentPreview)\s+src="([^"]+)"\s*\/?>/gi
const scriptLangTsRegEx = /<\s*script[^>]*\blang=['"]ts['"][^>]*/
const scriptSetupRegEx = /<\s*script[^>]*\bsetup\b[^>]*/
const scriptSetupCommonRegEx =
  /<\s*script\s+(setup|lang='ts'|lang="ts")?\s*(setup|lang='ts'|lang="ts")?\s*>/

// Function to generate component name based on the file path
const generateComponentName = (filePath: string) => {
  const prefix = 'ComponentPreview'
  const fileName = filePath.split('/').pop()?.split('.').shift()
  return `${prefix}${fileName?.charAt(0).toUpperCase()}${fileName?.slice(1)}`
}

// Function to inject the import statement for the component
const injectComponentImportScript = (
  env: MarkdownEnv,
  path: string,
  componentName: string
) => {
  const scriptsCode = env.sfcBlocks?.scripts
  if (!scriptsCode) {
    return
  }

  const scriptsSetupIndex = scriptsCode.findIndex((script: SfcBlock) => {
    if (
      scriptSetupRegEx.test(script.tagOpen) ||
      scriptLangTsRegEx.test(script.tagOpen)
    )
      return true
    return false
  })

  if (scriptsSetupIndex === -1) {
    const scriptBlockObj = {
      type: 'script',
      tagClose: '</script>',
      tagOpen: "<script setup lang='ts'>",
      content: `<script setup lang='ts'>
        import ${componentName} from '${path}'
        </script>`,
      contentStripped: `import ${componentName} from '${path}'`,
    }
    scriptsCode.push(scriptBlockObj)
  } else {
    const oldScriptsSetup = scriptsCode[0]
    if (
      oldScriptsSetup.content.includes(path) &&
      oldScriptsSetup.content.includes(componentName)
    ) {
      scriptsCode[0].content = oldScriptsSetup.content
    } else {
      const scriptCodeBlock = '<script lang="ts" setup>\n'
      scriptsCode[0].content = scriptsCode[0].content.replace(
        scriptSetupCommonRegEx,
        scriptCodeBlock
      )
      scriptsCode[0].content = scriptsCode[0].content.replace(
        scriptCodeBlock,
        `<script setup>\nimport ${componentName} from '${path}'\n`
      )
    }
  }
}

// Export the plugin function
export function componentPreview(markdownRenderer: MarkdownRenderer) {
  // Register a new rule to parse the custom component preview tag
  markdownRenderer.core.ruler.after('inline', 'component-preview', (state) => {
    // Extract the real path from the Markdown environment
    const env = state.env as MarkdownEnv

    // Replace matched patterns with the actual component previews
    state.src = state.src.replace(componentPreviewRegEx, (_match, src) => {
      const componentPath = resolve(dirname(env.realPath || ''), src)
      const componentName = generateComponentName(src)

      // If the component file does not exist, return an empty string
      if (!existsSync(componentPath)) {
        console.warn(`Component file not found: ${componentPath}`)
        return ''
      }

      const sourceCode = readFileSync(componentPath, 'utf-8')
      const compiledHighlightedCode = markdownRenderer.options.highlight!(
        sourceCode,
        'vue',
        ''
      )

      // Inject the import statement for the component
      injectComponentImportScript(state.env, src, componentName)

      // Find the index of the token that contains the match
      const matchIndex = state.tokens.findIndex((token) =>
        componentPreviewRegEx.test(token.content)
      )

      // Replace the token content with the actual component preview
      if (matchIndex !== -1) {
        state.tokens[matchIndex].content =
          `<ComponentPreview code="${encodeURIComponent(compiledHighlightedCode)}"><${componentName} /></ComponentPreview>`
      }

      // Return an empty string to remove the original tag
      return ''
    })
  })
}
