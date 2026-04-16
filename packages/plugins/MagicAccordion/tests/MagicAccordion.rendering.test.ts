import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

function createAccordion(
  accordionId: string,
  options: Record<string, unknown> = {},
  views: Array<{ id: string; label: string; content: string }> = [
    { id: 'v1', label: 'Section 1', content: 'Content 1' },
    { id: 'v2', label: 'Section 2', content: 'Content 2' },
    { id: 'v3', label: 'Section 3', content: 'Content 3' },
  ]
) {
  return defineComponent({
    components: {
      MagicAccordionProvider,
      MagicAccordionView,
      MagicAccordionTrigger,
      MagicAccordionContent,
      AutoSize,
    },
    setup() {
      const api = useMagicAccordion(accordionId)
      return { ...api }
    },
    template: `
      <MagicAccordionProvider id="${accordionId}" :options="options">
        ${views
          .map(
            (v) => `
          <MagicAccordionView id="${v.id}">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span data-test-id="trigger-${v.id}">${v.label}</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div data-test-id="content-${v.id}">${v.content}</div>
              </MagicAccordionContent>
            </template>
          </MagicAccordionView>
        `
          )
          .join('')}
      </MagicAccordionProvider>
    `,
    data() {
      return { options }
    },
  })
}

describe('MagicAccordion - Rendering', () => {
  describe('provider', () => {
    it('renders provider with correct class', async () => {
      render(createAccordion('render-provider'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      expect(
        document.querySelector('.magic-accordion-provider')
      ).not.toBeNull()
    })

    it('sets data-id on provider', async () => {
      render(createAccordion('render-data-id'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const provider = document.querySelector('.magic-accordion-provider')
      expect(provider!.getAttribute('data-id')).toBe('render-data-id')
    })
  })

  describe('view', () => {
    it('renders view wrappers with correct class', async () => {
      render(createAccordion('render-views'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const views = document.querySelectorAll('.magic-accordion-view')
      expect(views.length).toBe(3)
    })

    it('sets data-id on each view', async () => {
      render(createAccordion('render-view-ids'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const views = document.querySelectorAll('.magic-accordion-view')
      expect(views[0]!.getAttribute('data-id')).toBe('v1')
      expect(views[1]!.getAttribute('data-id')).toBe('v2')
      expect(views[2]!.getAttribute('data-id')).toBe('v3')
    })

    it('sets data-active=false by default', async () => {
      render(createAccordion('render-active-default'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const views = document.querySelectorAll('.magic-accordion-view')
      expect(views[0]!.getAttribute('data-active')).toBe('false')
    })

    it('exposes viewActive in scoped slot', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          AutoSize,
        },
        setup() {
          useMagicAccordion('render-slot')
          return {}
        },
        template: `
          <MagicAccordionProvider id="render-slot">
            <MagicAccordionView id="slot-view">
              <template #default="{ viewActive }">
                <span data-test-id="slot-active">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      await expect
        .element(page.getByTestId('slot-active'))
        .toHaveTextContent('false')
    })
  })

  describe('trigger', () => {
    it('renders trigger as button by default', async () => {
      render(createAccordion('render-trigger-btn'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector('.magic-accordion-trigger')
      expect(trigger!.tagName.toLowerCase()).toBe('button')
    })

    it('sets data-id on trigger', async () => {
      render(createAccordion('render-trigger-id'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector('.magic-accordion-trigger')
      expect(trigger!.getAttribute('data-id')).toBe('v1-trigger')
    })

    it('sets data-disabled=false by default', async () => {
      render(createAccordion('render-trigger-disabled'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector('.magic-accordion-trigger')
      expect(trigger!.getAttribute('data-disabled')).toBe('false')
    })
  })

  describe('content', () => {
    it('renders content wrapper with correct class', async () => {
      render(createAccordion('render-content'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      expect(
        document.querySelector('.magic-accordion-content')
      ).not.toBeNull()
    })

    it('sets data-id on content', async () => {
      render(createAccordion('render-content-id'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector('.magic-accordion-content')
      expect(content!.getAttribute('data-id')).toBe('v1-content')
    })

    it('content hidden when inactive', async () => {
      render(createAccordion('render-content-hidden'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector('.magic-accordion-content')
      expect(content!.getAttribute('data-active')).toBe('false')
    })

    it('sets animation duration CSS variable', async () => {
      render(createAccordion('render-css-var'), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe(
        '200ms'
      )
    })
  })
})
