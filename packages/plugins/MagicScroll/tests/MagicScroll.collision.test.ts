import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick, ref } from 'vue'
import MagicScrollProvider from '../src/components/MagicScrollProvider.vue'
import MagicScrollCollision from '../src/components/MagicScrollCollision.vue'
import { useMagicEmitter } from '../../MagicEmitter/src/composables/useMagicEmitter'
import { mountWithApp } from '../../tests/utils'

async function scrollTo(el: HTMLElement, top: number) {
  el.scrollTop = top
  el.dispatchEvent(new Event('scroll'))
  await nextTick()
  await new Promise((r) => setTimeout(r, 150))
}

describe('MagicScroll - Collision', () => {
  describe('collision detection setup', () => {
    it('renders collision element', async () => {
      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollCollision },
          template: `
            <MagicScrollProvider>
              <MagicScrollCollision id="col-render">
                <div style="height:100px">Tracked</div>
              </MagicScrollCollision>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()

      const el = document.querySelector('[data-id="col-render"]')
      expect(el).not.toBeNull()
    })

    it('collision with offset renders correctly', async () => {
      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollCollision },
          template: `
            <MagicScrollProvider>
              <MagicScrollCollision id="col-offset" :offset="{ top: 50, bottom: 50 }">
                <div style="height:100px">Tracked</div>
              </MagicScrollCollision>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()

      const el = document.querySelector('[data-id="col-offset"]')
      expect(el).not.toBeNull()
    })
  })

  describe('multiple collision elements', () => {
    it('renders multiple collision detectors', async () => {
      render(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollCollision },
          template: `
            <MagicScrollProvider>
              <MagicScrollCollision id="col-a">
                <div style="height:100px">A</div>
              </MagicScrollCollision>
              <MagicScrollCollision id="col-b">
                <div style="height:100px">B</div>
              </MagicScrollCollision>
            </MagicScrollProvider>
          `,
        })
      )
      await nextTick()

      expect(document.querySelector('[data-id="col-a"]')).not.toBeNull()
      expect(document.querySelector('[data-id="col-b"]')).not.toBeNull()
    })
  })

  describe('collision events', () => {
    it('emits collision event when scrolling element past viewport edge', async () => {
      const handler = vi.fn()

      // Use mountWithApp for reliable app-scoped emitter sharing
      const { unmount } = mountWithApp(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollCollision },
          setup() {
            const scrollTarget = ref<HTMLElement | null>(null)
            const emitter = useMagicEmitter()
            emitter.on('collision', handler)
            return { scrollTarget }
          },
          template: `
            <div ref="scrollTarget" data-test-id="scroller" style="height:200px;overflow:auto">
              <MagicScrollProvider :target="scrollTarget">
                <MagicScrollCollision id="col-event">
                  <div style="height:50px">Tracked Element</div>
                </MagicScrollCollision>
                <div style="height:2000px"></div>
              </MagicScrollProvider>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      const scroller = document.querySelector(
        '[data-test-id="scroller"]'
      ) as HTMLElement

      // The collision element starts at top, immediately visible.
      // observe() on mount sets lastScrollY. Because lastScrollY starts at 0,
      // first observe() just stores 0 and returns. We need:
      // scroll 1: lastScrollY goes from 0 → stored, early return
      // scroll 2: lastScrollY > 0, direction computed, collision checks run
      // scroll 3+: more collision checks as edges pass

      await scrollTo(scroller, 50)
      await scrollTo(scroller, 150)
      await scrollTo(scroller, 300)

      expect(handler).toHaveBeenCalled()

      const payload = handler.mock.calls[0]![0]
      expect(payload.id).toBe('col-event')
      expect(['up', 'down']).toContain(payload.direction)
      expect(['top', 'bottom']).toContain(payload.childEdge)
      expect(['top', 'bottom']).toContain(payload.parentEdge)

      unmount()
    })

    it('collision fires with down direction on downward scroll', async () => {
      const events: any[] = []

      const { unmount } = mountWithApp(
        defineComponent({
          components: { MagicScrollProvider, MagicScrollCollision },
          setup() {
            const scrollTarget = ref<HTMLElement | null>(null)
            const emitter = useMagicEmitter()
            emitter.on('collision', (e: any) => events.push(e))
            return { scrollTarget }
          },
          template: `
            <div ref="scrollTarget" data-test-id="scroller2" style="height:200px;overflow:auto">
              <MagicScrollProvider :target="scrollTarget">
                <MagicScrollCollision id="col-down">
                  <div style="height:50px">Tracked</div>
                </MagicScrollCollision>
                <div style="height:2000px"></div>
              </MagicScrollProvider>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 300))

      const scroller = document.querySelector(
        '[data-test-id="scroller2"]'
      ) as HTMLElement

      await scrollTo(scroller, 50)
      await scrollTo(scroller, 150)
      await scrollTo(scroller, 300)

      const downEvents = events.filter((e) => e.direction === 'down')
      expect(downEvents.length).toBeGreaterThan(0)

      unmount()
    })
  })
})
