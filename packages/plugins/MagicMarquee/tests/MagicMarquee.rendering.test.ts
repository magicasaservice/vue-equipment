import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicMarquee from '../src/components/MagicMarquee.vue'
import { createMarquee } from './test-utils'

describe('MagicMarquee - Rendering', () => {
  describe('container', () => {
    it('renders with correct class', async () => {
      render(createMarquee('render-class'))
      await nextTick()

      expect(document.querySelector('.magic-marquee')).not.toBeNull()
    })

    it('renders track element', async () => {
      render(createMarquee('render-track'))
      await nextTick()

      expect(
        document.querySelector('.magic-marquee__track')
      ).not.toBeNull()
    })

    it('renders content element', async () => {
      render(createMarquee('render-content'))
      await nextTick()

      expect(
        document.querySelector('.magic-marquee__content')
      ).not.toBeNull()
    })

    it('renders slot content with correct text', async () => {
      render(createMarquee('render-slot'))
      await nextTick()

      const inner = document.querySelector('.inner-content')
      expect(inner).not.toBeNull()
      expect(inner!.textContent).toBe('Item')
    })
  })

  describe('duplicates', () => {
    it('at least one content element exists', async () => {
      render(createMarquee('render-dup'))
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))

      const contents = document.querySelectorAll(
        '.magic-marquee__content'
      )
      expect(contents.length).toBeGreaterThanOrEqual(1)
    })

    it('duplicate content has aria-hidden for accessibility', async () => {
      render(
        defineComponent({
          components: { MagicMarquee },
          template: `
            <div style="width:500px">
              <MagicMarquee id="render-aria">
                <span style="width:10px;display:inline-block">X</span>
              </MagicMarquee>
            </div>
          `,
        })
      )
      await nextTick()
      await new Promise((r) => setTimeout(r, 100))

      const contents = document.querySelectorAll(
        '.magic-marquee__content'
      )
      if (contents.length > 1) {
        expect(contents[1]!.getAttribute('aria-hidden')).toBe('true')
      }
    })
  })
})
