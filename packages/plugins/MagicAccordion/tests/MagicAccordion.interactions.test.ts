import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
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
  opts: {
    mode?: string
    disabled?: boolean
    trigger?: string
  } = {}
) {
  const { mode = 'single', disabled = false, trigger = 'click' } = opts

  return defineComponent({
    components: {
      MagicAccordionProvider,
      MagicAccordionView,
      MagicAccordionTrigger,
      MagicAccordionContent,
      AutoSize,
    },
    setup() {
      useMagicAccordion(accordionId)
      return {}
    },
    template: `
      <MagicAccordionProvider id="${accordionId}" :options="{ mode: '${mode}', disabled: ${disabled} }">
        <MagicAccordionView id="${ViewId.Panel1}">
          <template #default="{ viewActive }">
            <MagicAccordionTrigger trigger="${trigger}">
              <span data-test-id="${TestId.Trigger1}">Trigger 1</span>
            </MagicAccordionTrigger>
            <MagicAccordionContent>
              <div>Content 1</div>
            </MagicAccordionContent>
            <span data-test-id="${TestId.Active1}">{{ viewActive }}</span>
          </template>
        </MagicAccordionView>
        <MagicAccordionView id="${ViewId.Panel2}">
          <template #default="{ viewActive }">
            <MagicAccordionTrigger trigger="${trigger}">
              <span data-test-id="${TestId.Trigger2}">Trigger 2</span>
            </MagicAccordionTrigger>
            <MagicAccordionContent>
              <div>Content 2</div>
            </MagicAccordionContent>
            <span data-test-id="${TestId.Active2}">{{ viewActive }}</span>
          </template>
        </MagicAccordionView>
      </MagicAccordionProvider>
    `,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicAccordion - Interactions', () => {
  describe('click trigger', () => {
    it('clicking trigger opens panel', async () => {
      render(createAccordion(AccordionId.ClickOpen), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
    })

    it('clicking open trigger closes panel (toggle)', async () => {
      render(createAccordion(AccordionId.ClickToggle), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')

      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('false')
    })

    it('single mode: clicking second trigger closes first', async () => {
      render(createAccordion(AccordionId.SingleSwitch), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn1 = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      const btn2 = document.querySelector(
        `[data-id="${ViewId.Panel2}-trigger"]`
      ) as HTMLElement

      btn1.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')

      btn2.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('false')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('true')
    })

    it('multiple mode: clicking second trigger keeps first open', async () => {
      render(createAccordion(AccordionId.MultiOpen, { mode: 'multiple' }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn1 = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      const btn2 = document.querySelector(
        `[data-id="${ViewId.Panel2}-trigger"]`
      ) as HTMLElement

      btn1.click()
      await nextTick()

      btn2.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
      await expect
        .element(page.getByTestId(TestId.Active2))
        .toHaveTextContent('true')
    })
  })

  describe('mouseenter trigger', () => {
    it('hovering trigger opens panel', async () => {
      render(
        createAccordion(AccordionId.Hover, { trigger: 'mouseenter' }),
        { global: { stubs: { AutoSize } } }
      )
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
    })
  })

  describe('disabled state', () => {
    it('clicking disabled trigger does nothing', async () => {
      render(createAccordion(AccordionId.Disabled, { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('false')
    })

    it('disabled trigger has data-disabled=true', async () => {
      render(createAccordion(AccordionId.DisabledAttr, { disabled: true }), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      expect(btn.getAttribute('data-disabled')).toBe('true')
    })
  })

  describe('keyboard interaction', () => {
    it('Enter key opens panel when trigger focused', async () => {
      render(createAccordion(AccordionId.Keyboard), {
        global: { stubs: { AutoSize } },
      })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.Panel1}-trigger"]`
      ) as HTMLElement
      btn.focus()
      await nextTick()

      await userEvent.keyboard('{Enter}')
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active1))
        .toHaveTextContent('true')
    })
  })

  describe('trigger with explicit viewId', () => {
    it('trigger outside view controls panel via viewId prop', async () => {
      const wrapper = defineComponent({
        components: {
          MagicAccordionProvider,
          MagicAccordionView,
          MagicAccordionTrigger,
          MagicAccordionContent,
          AutoSize,
        },
        setup() {
          useMagicAccordion(AccordionId.ExternalTrigger)
          return {}
        },
        template: `
          <MagicAccordionProvider id="${AccordionId.ExternalTrigger}">
            <MagicAccordionTrigger view-id="${ViewId.ExtPanel}">
              <span data-test-id="${TestId.ExternalTrigger}">External</span>
            </MagicAccordionTrigger>
            <MagicAccordionView id="${ViewId.ExtPanel}">
              <template #default="{ viewActive }">
                <span data-test-id="${TestId.Active}">{{ viewActive }}</span>
                <MagicAccordionContent>
                  <div>Content</div>
                </MagicAccordionContent>
              </template>
            </MagicAccordionView>
          </MagicAccordionProvider>
        `,
      })

      render(wrapper, { global: { stubs: { AutoSize } } })
      await nextTick()

      const btn = document.querySelector(
        `[data-id="${ViewId.ExtPanel}-trigger"]`
      ) as HTMLElement
      btn.click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Active))
        .toHaveTextContent('true')
    })
  })
})
