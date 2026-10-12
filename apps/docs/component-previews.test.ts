import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  demoName,
  namePreviews,
  readSource,
  sourceModule,
} from './component-previews'

const modalDir = resolve(
  import.meta.dirname,
  '../../packages/plugins/MagicModal'
)

describe('demoName', () => {
  it('prefixes the demo with the folder that owns it', () => {
    expect(demoName(join(modalDir, 'demo/DefaultDemo.vue'))).toBe(
      'MagicModalDefaultDemo'
    )
  })

  it('capitalizes a composable folder', () => {
    expect(
      demoName('/packages/composables/useCountdown/demo/DefaultDemo.vue')
    ).toBe('UseCountdownDefaultDemo')
  })
})

describe('namePreviews', () => {
  it('replaces the path with the name the demo is registered under', () => {
    const markdown = [
      '# MagicModal',
      '',
      '::component-preview{src="./demo/DefaultDemo.vue"}',
      '::',
    ].join('\n')

    expect(namePreviews({ markdown, dir: modalDir })).toBe(
      [
        '# MagicModal',
        '',
        '::component-preview{name="MagicModalDefaultDemo"}',
        '::',
      ].join('\n')
    )
  })

  it('leaves a page without previews untouched', () => {
    const markdown = '# Introduction\n\nNo previews here.\n'
    expect(namePreviews({ markdown, dir: modalDir })).toBe(markdown)
  })

  it('fails on a preview that does not exist', () => {
    expect(() =>
      namePreviews({
        markdown: '::component-preview{src="./demo/MissingDemo.vue"}\n::',
        dir: modalDir,
      })
    ).toThrow('./demo/MissingDemo.vue')
  })
})

describe('readSource', () => {
  it('returns the file as written and highlighted', async () => {
    const path = join(modalDir, 'demo/DefaultDemo.vue')
    const source = await readSource(path)

    expect(source.filename).toBe('DefaultDemo.vue')
    expect(source.code).toBe(readFileSync(path, 'utf8').trimEnd())
    expect(source.html).toMatch(/^<code>/)
    expect(source.html).toMatch(/<\/code>$/)
    expect(source.html).toContain('--shiki-default:')
    expect(source.html).toContain('--shiki-dark:')
  })

  it('loads back unchanged from the module the build serves it in', async () => {
    const source = {
      filename: 'GuardDemo.vue',
      code: "const ready = typeof window !== 'undefined' // Magic as a Service™",
      html: '<code><span>typeof window</span></code>',
    }

    const code = sourceModule(source)
    const loaded = await import(
      `data:text/javascript,${encodeURIComponent(code)}`
    )

    expect(code).not.toContain('typeof window')
    expect(loaded.default).toEqual(source)
  })

  it('reads the file again on every call', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'component-previews-'))
    mkdirSync(join(dir, 'demo'))
    const path = join(dir, 'demo/EditedDemo.vue')

    writeFileSync(path, '<template>\n  <p>First</p>\n</template>\n')
    expect((await readSource(path)).code).toContain('First')

    writeFileSync(path, '<template>\n  <p>Second</p>\n</template>\n')
    expect((await readSource(path)).code).toContain('Second')
  })
})
