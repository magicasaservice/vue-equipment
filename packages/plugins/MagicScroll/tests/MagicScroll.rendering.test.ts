import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicScrollProvider from '../src/components/MagicScrollProvider.vue'
import MagicScrollScene from '../src/components/MagicScrollScene.vue'
import MagicScrollMotion from '../src/components/MagicScrollMotion.vue'
import MagicScrollCollision from '../src/components/MagicScrollCollision.vue'

function createScroll(
  template: string,
  components: Record<string, unknown> = {}
) {
  return defineComponent({
    components: {
      MagicScrollProvider,
      MagicScrollScene,
      MagicScrollMotion,
      MagicScrollCollision,
      ...components,
    },
    template,
  })
}

describe('MagicScroll - Rendering', () => {
  describe('MagicScrollProvider', () => {
    it('renders with correct class', async () => {
      render(
        createScroll(
          `<MagicScrollProvider><div>Content</div></MagicScrollProvider>`
        )
      )
      await nextTick()

      expect(
        document.querySelector('.magic-scroll-provider')
      ).not.toBeNull()
    })

    it('renders slot content with correct text', async () => {
      render(
        createScroll(
          `<MagicScrollProvider><span class="inner">Hello</span></MagicScrollProvider>`
        )
      )
      await nextTick()

      const inner = document.querySelector('.inner')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Hello')
    })

    it('exposes scrollReturn via scoped slot', async () => {
      render(
        createScroll(`
          <MagicScrollProvider v-slot="{ scrollReturn }">
            <span data-test-id="has-scroll">{{ typeof scrollReturn.y }}</span>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      await expect
        .element(page.getByTestId('has-scroll'))
        .toHaveTextContent('object')
    })
  })

  describe('MagicScrollScene', () => {
    it('renders with correct class', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene><div>Scene</div></MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      expect(
        document.querySelector('.magic-scroll-scene')
      ).not.toBeNull()
    })

    it('renders slot content with correct text', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene>
              <span class="scene-inner">Scene Content</span>
            </MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const inner = document.querySelector('.scene-inner')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Scene Content')
    })

    it('exposes progress as number via scoped slot', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene v-slot="{ progress }">
              <span data-test-id="progress">{{ typeof progress }}</span>
            </MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      await expect
        .element(page.getByTestId('progress'))
        .toHaveTextContent('number')
    })
  })

  describe('MagicScrollMotion', () => {
    it('renders with correct class', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene>
              <MagicScrollMotion :sequence="[]"><div>Motion</div></MagicScrollMotion>
            </MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      expect(
        document.querySelector('.magic-scroll-motion')
      ).not.toBeNull()
    })

    it('renders slot content with correct text', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollScene>
              <MagicScrollMotion :sequence="[]">
                <span class="motion-inner">Animated</span>
              </MagicScrollMotion>
            </MagicScrollScene>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const inner = document.querySelector('.motion-inner')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Animated')
    })
  })

  describe('MagicScrollCollision', () => {
    it('renders with correct class', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision><div>Collision</div></MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      expect(
        document.querySelector('.magic-scroll-collision')
      ).not.toBeNull()
    })

    it('sets data-id when id provided', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision id="col-1"><div>Collision</div></MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      expect(
        document.querySelector('[data-id="col-1"]')
      ).not.toBeNull()
    })

    it('auto-generates data-id when no id provided', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision><div>Collision</div></MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const el = document.querySelector('.magic-scroll-collision')
      const dataId = el!.getAttribute('data-id')
      expect(dataId).toBeTruthy()
      expect(dataId!.startsWith('magic-scroll-collision-')).toBe(true)
    })

    it('renders slot content with correct text', async () => {
      render(
        createScroll(`
          <MagicScrollProvider>
            <MagicScrollCollision>
              <span class="col-inner">Tracked</span>
            </MagicScrollCollision>
          </MagicScrollProvider>
        `)
      )
      await nextTick()

      const inner = document.querySelector('.col-inner')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Tracked')
    })
  })
})
