import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicAccordionProvider from '../src/components/MagicAccordionProvider.vue'
import MagicAccordionView from '../src/components/MagicAccordionView.vue'
import MagicAccordionTrigger from '../src/components/MagicAccordionTrigger.vue'
import MagicAccordionContent from '../src/components/MagicAccordionContent.vue'
import { useMagicAccordion } from '../src/composables/useMagicAccordion'
import { AccordionId, ViewId, TestId } from './enums'

// ─── Stubs ────────────────────────────────────────────────────────────────────

const AutoSize = defineComponent({
  name: 'AutoSize',
  template: '<div><slot /></div>',
})

// ─── Factory ──────────────────────────────────────────────────────────────────

function createAccordion(
  accordionId: AccordionId,
  options: Record<string, unknown> = {},
  views: Array<{ id: ViewId; label: string; content: string }> = [
    { id: ViewId.V1, label: 'Section 1', content: 'Content 1' },
    { id: ViewId.V2, label: 'Section 2', content: 'Content 2' },
    { id: ViewId.V3, label: 'Section 3', content: 'Content 3' },
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicAccordion - Rendering', () => {
  describe('provider', () => {
    it('sets data-id on provider', async () => {
      render(createAccordion(AccordionId.RenderDataId), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const provider = document.querySelector('.magic-accordion-provider')
      expect(provider!.getAttribute('data-id')).toBe(AccordionId.RenderDataId)
    })
  })

  describe('view', () => {
    it('renders three view wrappers', async () => {
      render(createAccordion(AccordionId.RenderViews), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const views = document.querySelectorAll('.magic-accordion-view')
      expect(views.length).toBe(3)
    })

    it('sets data-id on each view', async () => {
      render(createAccordion(AccordionId.RenderViewIds), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const views = document.querySelectorAll('.magic-accordion-view')
      expect(views[0]!.getAttribute('data-id')).toBe(ViewId.V1)
      expect(views[1]!.getAttribute('data-id')).toBe(ViewId.V2)
      expect(views[2]!.getAttribute('data-id')).toBe(ViewId.V3)
    })

    it('sets data-active=false by default on all views', async () => {
      render(createAccordion(AccordionId.RenderActiveDefault), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const views = document.querySelectorAll('.magic-accordion-view')
      views.forEach((v) => expect(v.getAttribute('data-active')).toBe('false'))
    })

    it('exposes viewActive=false in scoped slot by default', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.RenderSlot)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.RenderSlot}">
            <MagicAccordionView id="${ViewId.SlotView}">
              <template #default="{ viewActive }">
                <span data-test-id="${TestId.SlotActive}">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.SlotActive))
        .toHaveTextContent('false')
    })
  })

  describe('trigger', () => {
    it('renders trigger as button', async () => {
      render(createAccordion(AccordionId.RenderTriggerBtn), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector('.magic-accordion-trigger')
      expect(trigger!.tagName.toLowerCase()).toBe('button')
    })

    it('sets data-id on trigger as {viewId}-trigger', async () => {
      render(createAccordion(AccordionId.RenderTriggerId), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector('.magic-accordion-trigger')
      expect(trigger!.getAttribute('data-id')).toBe(`${ViewId.V1}-trigger`)
    })

    it('sets data-disabled=false by default', async () => {
      render(createAccordion(AccordionId.RenderTriggerDisabled), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const trigger = document.querySelector('.magic-accordion-trigger')
      expect(trigger!.getAttribute('data-disabled')).toBe('false')
    })
  })

  describe('content', () => {
    it('sets data-id on content as {viewId}-content', async () => {
      render(createAccordion(AccordionId.RenderContentId), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector('.magic-accordion-content')
      expect(content!.getAttribute('data-id')).toBe(`${ViewId.V1}-content`)
    })

    it('content has data-active=false when view is inactive', async () => {
      render(createAccordion(AccordionId.RenderContentHidden), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector('.magic-accordion-content')
      expect(content!.getAttribute('data-active')).toBe('false')
    })

    it('sets --ma-duration CSS variable to 200ms by default', async () => {
      render(createAccordion(AccordionId.RenderCssVar), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe('200ms')
    })
  })
})
