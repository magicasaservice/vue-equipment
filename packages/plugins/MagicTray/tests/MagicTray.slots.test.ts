import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicTrayProvider from '../src/components/MagicTrayProvider.vue'
import MagicTrayContent from '../src/components/MagicTrayContent.vue'
import { TrayId } from './enums'

function createTray(id: TrayId, options: Record<string, unknown>, slots: string) {
  return defineComponent({
    components: {
      MagicTrayProvider,
      MagicTrayContent,
    },
    template: `
      <MagicTrayProvider id="${id}" :options="options">
        <MagicTrayContent>
          <div style="width: 200px; height: 160px;">Content</div>
          ${slots}
        </MagicTrayContent>
      </MagicTrayProvider>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicTray - Handle slots', () => {
  it('renders the generic handle slot for every side', async () => {
    render(
      createTray(
        TrayId.SlotHandleGeneric,
        { snapPoints: { top: [0, 1], bottom: [0, 1] } },
        `<template #handle="{ side }">
           <span class="custom-handle" :data-handle-side="side">{{ side }}</span>
         </template>`
      )
    )
    await nextTick()
    await nextTick()

    const handles = document.querySelectorAll(
      `[data-id="${TrayId.SlotHandleGeneric}"] .custom-handle`
    )
    expect(handles.length).toBe(2)
    const sides = [...handles]
      .map((h) => h.getAttribute('data-handle-side'))
      .sort()
    expect(sides).toEqual(['bottom', 'top'])
  })

  it('renders per-side handle slots', async () => {
    render(
      createTray(
        TrayId.SlotHandlePerSide,
        { snapPoints: { top: [0, 1], bottom: [0, 1] } },
        `<template #handle-top="{ side }">
           <span class="handle-top" :data-handle-side="side" />
         </template>
         <template #handle-bottom="{ side }">
           <span class="handle-bottom" :data-handle-side="side" />
         </template>`
      )
    )
    await nextTick()
    await nextTick()

    const root = `[data-id="${TrayId.SlotHandlePerSide}"]`
    const top = document.querySelector(`${root} .magic-tray-handle--top .handle-top`)
    const bottom = document.querySelector(
      `${root} .magic-tray-handle--bottom .handle-bottom`
    )
    expect(top).not.toBeNull()
    expect(top!.getAttribute('data-handle-side')).toBe('top')
    expect(bottom).not.toBeNull()
    expect(bottom!.getAttribute('data-handle-side')).toBe('bottom')
  })

  it('falls back to the generic slot for sides without a per-side slot', async () => {
    render(
      createTray(
        TrayId.SlotHandleFallback,
        { snapPoints: { top: [0, 1], bottom: [0, 1] } },
        `<template #handle-top>
           <span class="handle-top" />
         </template>
         <template #handle="{ side }">
           <span class="handle-generic" :data-handle-side="side" />
         </template>`
      )
    )
    await nextTick()
    await nextTick()

    const root = `[data-id="${TrayId.SlotHandleFallback}"]`
    // top uses its dedicated slot
    expect(
      document.querySelector(`${root} .magic-tray-handle--top .handle-top`)
    ).not.toBeNull()
    expect(
      document.querySelector(`${root} .magic-tray-handle--top .handle-generic`)
    ).toBeNull()
    // bottom has no dedicated slot, falls back to generic
    const bottomGeneric = document.querySelector(
      `${root} .magic-tray-handle--bottom .handle-generic`
    )
    expect(bottomGeneric).not.toBeNull()
    expect(bottomGeneric!.getAttribute('data-handle-side')).toBe('bottom')
  })
})
