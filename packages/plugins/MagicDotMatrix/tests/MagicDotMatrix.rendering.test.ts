import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import { createDotMatrix } from './test-utils'
import { MatrixId } from './enums'

describe('MagicDotMatrix - Rendering', () => {
  it('renders an svg with one rect per grid cell', async () => {
    render(createDotMatrix(MatrixId.RenderDefault, [[0]], { cols: 3, rows: 4 }))
    await nextTick()

    const root = document.querySelector(`[data-id='${MatrixId.RenderDefault}']`)
    expect(root!.querySelector('svg')).not.toBeNull()
    expect(root!.querySelectorAll('rect.magic-dot-matrix__dot').length).toBe(12)
  })

  it('marks the first frame’s dots as active', async () => {
    render(
      createDotMatrix(MatrixId.RenderActive, [[0, 3]], { cols: 2, rows: 2 })
    )
    await nextTick()

    const dots = document.querySelectorAll(
      `[data-id='${MatrixId.RenderActive}'] .magic-dot-matrix__dot`
    )
    expect(dots[0]!.getAttribute('data-active')).toBe('true')
    expect(dots[1]!.hasAttribute('data-active')).toBe(false)
    expect(dots[2]!.hasAttribute('data-active')).toBe(false)
    expect(dots[3]!.getAttribute('data-active')).toBe('true')
  })
})
