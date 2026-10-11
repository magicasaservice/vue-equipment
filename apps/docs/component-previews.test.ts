import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { demoName, expandPreviews } from './component-previews'

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

describe('expandPreviews', () => {
  it('names the demo and appends its source as a fence', () => {
    const markdown = [
      '# MagicModal',
      '',
      '::component-preview{src="./demo/DefaultDemo.vue"}',
      '::',
    ].join('\n')
    const source = readFileSync(join(modalDir, 'demo/DefaultDemo.vue'), 'utf8')

    const expanded = expandPreviews({ markdown, dir: modalDir })

    expect(expanded).toBe(
      [
        '# MagicModal',
        '',
        '::component-preview{name="MagicModalDefaultDemo"}',
        '```vue [DefaultDemo.vue]',
        source.trimEnd(),
        '```',
        '::',
      ].join('\n')
    )
  })

  it('leaves a page without previews untouched', () => {
    const markdown = '# Introduction\n\nNo previews here.\n'
    expect(expandPreviews({ markdown, dir: modalDir })).toBe(markdown)
  })

  it('outgrows a fence inside the demo', () => {
    const dir = mkdtempSync(join(tmpdir(), 'component-previews-'))
    mkdirSync(join(dir, 'demo'))
    writeFileSync(join(dir, 'demo/FenceDemo.vue'), '<!-- ``` -->\n')

    const expanded = expandPreviews({
      markdown: '::component-preview{src="./demo/FenceDemo.vue"}\n::',
      dir,
    })

    expect(expanded).toContain('````vue [FenceDemo.vue]\n<!-- ``` -->\n````')
  })

  it('fails on a preview that does not exist', () => {
    expect(() =>
      expandPreviews({
        markdown: '::component-preview{src="./demo/MissingDemo.vue"}\n::',
        dir: modalDir,
      })
    ).toThrow('./demo/MissingDemo.vue')
  })
})
