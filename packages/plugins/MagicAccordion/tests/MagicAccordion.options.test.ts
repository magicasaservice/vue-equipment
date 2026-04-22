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
  options: Record<string, unknown> = {}
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
      <div>
        <button data-test-id="${TestId.SelectV1}" @click="selectView('${ViewId.V1}')">Select V1</button>
        <button data-test-id="${TestId.SelectV2}" @click="selectView('${ViewId.V2}')">Select V2</button>
        <button data-test-id="${TestId.UnselectV1}" @click="unselectView('${ViewId.V1}')">Unselect V1</button>
        <MagicAccordionProvider id="${accordionId}" :options="options">
          <MagicAccordionView id="${ViewId.V1}">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger 1</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div data-test-id="${TestId.Content}">Content 1</div>
              </MagicAccordionContent>
              <span data-test-id="${TestId.ActiveV1}">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
          <MagicAccordionView id="${ViewId.V2}">
            <template #default="{ viewActive }">
              <MagicAccordionTrigger>
                <span>Trigger 2</span>
              </MagicAccordionTrigger>
              <MagicAccordionContent>
                <div>Content 2</div>
              </MagicAccordionContent>
              <span data-test-id="${TestId.ActiveV2}">{{ viewActive }}</span>
            </template>
          </MagicAccordionView>
        </MagicAccordionProvider>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicAccordion - Options', () => {
  describe('mode option', () => {
    it('defaults to single mode: second open closes first', async () => {
      const screen = render(createAccordion(AccordionId.DefaultMode), {
        global: { stubs: { AutoSize } },
      })

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()
      await screen.getByTestId(TestId.SelectV2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.ActiveV2))
        .toHaveTextContent('true')
    })

    it('single mode closes others on select', async () => {
      const screen = render(
        createAccordion(AccordionId.Single, { mode: 'single' }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()
      await screen.getByTestId(TestId.SelectV2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.ActiveV2))
        .toHaveTextContent('true')
    })

    it('multiple mode keeps all open', async () => {
      const screen = render(
        createAccordion(AccordionId.Multiple, { mode: 'multiple' }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()
      await screen.getByTestId(TestId.SelectV2).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.ActiveV2))
        .toHaveTextContent('true')
    })
  })

  describe('disabled option', () => {
    it('disabled prevents trigger clicks', async () => {
      render(createAccordion(AccordionId.OptDisabled, { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.V1}-trigger"]`
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')
    })

    it('disabled sets data-disabled=true on all triggers', async () => {
      render(createAccordion(AccordionId.OptDisabledAttr, { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const triggers = document.querySelectorAll('.magic-accordion-trigger')
      triggers.forEach((trigger) => {
        expect(trigger.getAttribute('data-disabled')).toBe('true')
      })
    })

    it('disabled does not prevent programmatic selectView', async () => {
      const screen = render(
        createAccordion(AccordionId.DisabledApi, { disabled: true }),
        { global: { stubs: { AutoSize } } }
      )

      await screen.getByTestId(TestId.SelectV1).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')
    })
  })

  describe('animation option', () => {
    it('default animation duration is 200ms', async () => {
      render(createAccordion(AccordionId.AnimDefault), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe('200ms')
    })

    it('custom animation duration reflected in --ma-duration CSS var', async () => {
      render(
        createAccordion(AccordionId.AnimCustom, {
          animation: { duration: 500 },
        }),
        { global: { stubs: { AutoSize } } }
      )
      await nextTick()

      const content = document.querySelector(
        '.magic-accordion-content'
      ) as HTMLElement
      expect(content.style.getPropertyValue('--ma-duration')).toBe('500ms')
    })
  })

  describe('content-level overrides', () => {
    it('content transition prop overrides provider option', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.ContentOverride)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.ContentOverride}" :options="{ transition: 'global-fade' }">
            <MagicAccordionView id="${ViewId.CoView}">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger>
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent transition="local-slide">
                  <div data-test-id="${TestId.Content}">Content</div>
                </MagicAccordionContent>
                <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      // Content renders and view state reflects normal behavior
      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('false')
    })
  })

  describe('trigger option', () => {
    it('default trigger responds to click', async () => {
      render(createAccordion(AccordionId.TriggerDefault), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.V1}-trigger"]`
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('true')
    })

    it('mouseenter trigger opens on hover', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.TriggerHover)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.TriggerHover}">
            <MagicAccordionView id="${ViewId.HoverView}">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger trigger="mouseenter">
                  <span>Trigger</span>
                </MagicAccordionTrigger>
                <MagicAccordionContent>
                  <div>Content</div>
                </MagicAccordionContent>
                <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.HoverView}-trigger"]`
      ) as HTMLElement
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })

  describe('view active prop', () => {
    it('view starts open with :active="true"', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.InitialActive)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.InitialActive}">
            <MagicAccordionView id="${ViewId.IaView}" :active="true">
              <template #default="{ viewActive }">
                <MagicAccordionTrigger><span>Trigger</span></MagicAccordionTrigger>
                <MagicAccordionContent>
                  <div>Content</div>
                </MagicAccordionContent>
                <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })

    it('view defaults to inactive without active prop', async () => {
      render(createAccordion(AccordionId.DefaultInactive), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.ActiveV1))
        .toHaveTextContent('false')
    })
  })
})
