import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { TrayId } from './enums'

function createTray(id: TrayId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: {
      MagicTrayProvider,
      MagicTrayContent,
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <MagicTrayContent>
          <div style="width: 200px; height: 160px;">Content</div>
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicTray - Rendering', () => {
  it('renders the tray with its data-id', async () => {
    render(createTray(TrayId.RenderInline))
    await nextTick()
    const el = document.querySelector(`[data-id="${TrayId.RenderInline}"]`)
    expect(el).not.toBeNull()
    expect(el!.classList.contains('magic-tray-content')).toBe(true)
  })

  it('renders a handle for every side that has snap points', async () => {
    render(
      createTray(TrayId.RenderHandles, {
        snapPoints: { top: [0, 1], bottom: [0, 1] },
      })
    )
    await nextTick()
    await nextTick()
    const handles = document.querySelectorAll(
      `[data-id="${TrayId.RenderHandles}"] .magic-tray-handle`
    )
    expect(handles.length).toBe(2)
    const sides = [...handles].map((h) => h.getAttribute('data-side')).sort()
    expect(sides).toEqual(['bottom', 'top'])
  })

  it('renders no handles when handles is false', async () => {
    render(
      createTray(TrayId.RenderNoHandles, {
        snapPoints: { bottom: [0, 1] },
        handles: false,
      })
    )
    await nextTick()
    await nextTick()
    const handles = document.querySelectorAll(
      `[data-id="${TrayId.RenderNoHandles}"] .magic-tray-handle`
    )
    expect(handles.length).toBe(0)
  })

  it('renders handles only for explicitly enabled sides', async () => {
    render(
      createTray(TrayId.RenderPartialHandles, {
        snapPoints: { top: [0, 1], bottom: [0, 1] },
        handles: { top: true },
      })
    )
    await nextTick()
    await nextTick()
    const handles = document.querySelectorAll(
      `[data-id="${TrayId.RenderPartialHandles}"] .magic-tray-handle`
    )
    expect(handles.length).toBe(1)
    expect(handles[0]!.getAttribute('data-side')).toBe('top')
  })

  it('reflects disabled state via data-disabled', async () => {
    render(createTray(TrayId.RenderDisabled, { disabled: true }))
    await nextTick()
    const el = document.querySelector(`[data-id="${TrayId.RenderDisabled}"]`)
    expect(el!.getAttribute('data-disabled')).toBe('true')
  })
})
