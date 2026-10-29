import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MCheckbox from '../src/components/Checkbox.vue'

import type {
  MCheckboxMode,
  MCheckboxProps,
  MCheckboxSize,
} from '../src/types/checkbox'

const MODES: MCheckboxMode[] = ['solid', 'subtle']
const SIZES: MCheckboxSize[] = ['sm', 'md', 'lg']

/** Every utility on the element that sets the given CSS property. */
function utilitiesFor(classes: string[], property: 'bg' | 'text' | 'border') {
  return classes.filter((c) => {
    const bare = c.replace(/^[a-z-]+:/, '')
    return bare.startsWith(`${property}-`) && !/^border-\d+$/.test(bare)
  })
}

/**
 * The indicator renders inside a `transition`, which Vue Test Utils stubs by
 * default, and a stub keeps the class that belongs on the element below it.
 */
function mountCheckbox(props: Partial<MCheckboxProps> = {}, attrs = {}) {
  return mount(MCheckbox, {
    props: { modelValue: false, ...props },
    attrs,
    global: { stubs: { transition: false } },
  })
}

function box(wrapper: ReturnType<typeof mountCheckbox>) {
  return wrapper.get('.m-checkbox__input')
}

describe('MCheckbox', () => {
  it('renders the v1 anatomy with the v1 defaults', () => {
    const wrapper = mountCheckbox()
    const root = wrapper.get('.m-checkbox')

    expect(root.element.tagName).toBe('LABEL')
    expect(root.attributes('data-mode')).toBe('solid')
    expect(root.attributes('data-size')).toBe('md')
    expect(root.attributes('data-state')).toBe('unchecked')
    expect(wrapper.get('.m-checkbox > span').text()).toBe('Label')

    expect(box(wrapper).attributes('role')).toBe('checkbox')
    expect(wrapper.find('.m-checkbox__symbol').exists()).toBe(true)
  })

  it('walks the size ramp for the box, the radius and the gap', () => {
    const expected: Record<MCheckboxSize, [string, string, string]> = {
      sm: ['size-4', 'rounded-component-compact-sm', 'gap-2'],
      md: ['size-5', 'rounded-component-compact-md', 'gap-3'],
      lg: ['size-6', 'rounded-component-compact-lg', 'gap-4'],
    }

    for (const size of SIZES) {
      const wrapper = mountCheckbox({ size })
      const [boxSize, radius, gap] = expected[size]

      expect(wrapper.get('.m-checkbox').attributes('data-size')).toBe(size)
      expect(wrapper.get('.m-checkbox').classes()).toContain(gap)
      expect(box(wrapper).classes()).toContain(boxSize)
      expect(box(wrapper).classes()).toContain(radius)
    }
  })

  it('colours the label from the mode, on the root, so the slot inherits it', () => {
    const expected: Record<MCheckboxMode, string> = {
      solid: 'text-primary-solid',
      subtle: 'text-primary-subtle',
    }

    for (const mode of MODES) {
      expect(mountCheckbox({ mode }).get('.m-checkbox').classes()).toContain(
        expected[mode]
      )
    }

    expect(
      mountCheckbox({ disabled: true }).get('.m-checkbox').classes()
    ).toContain('text-disabled-solid')

    expect(
      mountCheckbox({ error: true }).get('.m-checkbox').classes()
    ).toContain('text-danger-solid')
  })

  it('paints the box from one utility per property in every state', () => {
    const cases = [
      { props: {}, bg: 'bg-transparent', border: 'border-primary-muted' },
      {
        props: { modelValue: true },
        bg: 'bg-accent-solid',
        border: 'border-transparent',
      },
      {
        props: { error: true },
        bg: 'bg-danger-subtle',
        border: 'border-danger-muted',
      },
      {
        props: { modelValue: true, error: true },
        bg: 'bg-danger-solid',
        border: 'border-transparent',
      },
      {
        props: { disabled: true },
        bg: 'bg-transparent',
        border: 'border-disabled-subtle',
      },
      {
        props: { modelValue: true, disabled: true },
        bg: 'bg-disabled-solid',
        border: 'border-transparent',
      },
    ] as const

    for (const entry of cases) {
      const classes = box(mountCheckbox(entry.props)).classes()

      expect(classes).toContain(entry.bg)
      expect(classes).toContain(entry.border)

      for (const property of ['bg', 'text', 'border'] as const) {
        expect(
          utilitiesFor(classes, property).filter((c) => !c.includes(':'))
        ).toHaveLength(1)
      }
    }
  })

  it('drops the error colour entirely when disabled, as v1 did', () => {
    const classes = box(
      mountCheckbox({ modelValue: true, error: true, disabled: true })
    ).classes()

    expect(classes.join(' ')).not.toContain('danger')
    expect(classes.join(' ')).toContain('disabled')
  })

  it('paints the mixed state like the checked one', () => {
    const wrapper = mountCheckbox({ modelValue: 'indeterminate' })

    expect(wrapper.get('.m-checkbox').attributes('data-state')).toBe(
      'indeterminate'
    )
    expect(box(wrapper).attributes('aria-checked')).toBe('mixed')
    expect(box(wrapper).classes()).toContain('bg-accent-solid')
    expect(box(wrapper).classes()).toContain('text-accent-on-solid')
  })

  it('round trips v-model through the headless part', async () => {
    const unchecked = mountCheckbox()

    await box(unchecked).trigger('click')
    expect(unchecked.emitted('update:modelValue')?.[0]).toEqual([true])

    await unchecked.setProps({ modelValue: true })
    expect(unchecked.get('.m-checkbox').attributes('data-state')).toBe(
      'checked'
    )

    const checked = mountCheckbox({ modelValue: true })

    expect(box(checked).attributes('aria-checked')).toBe('true')

    await box(checked).trigger('click')
    expect(checked.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('resolves the mixed state to checked on activation', async () => {
    const wrapper = mountCheckbox({ modelValue: 'indeterminate' })

    await box(wrapper).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('never moves while disabled', async () => {
    const wrapper = mountCheckbox({ disabled: true })

    await box(wrapper).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('.m-checkbox').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('.m-checkbox').attributes('data-disabled')).toBe('true')
    expect(box(wrapper).attributes('disabled')).toBeDefined()
  })

  it('emits v1’s payload-free focus and blur', async () => {
    const wrapper = mountCheckbox()

    await box(wrapper).trigger('focus')
    await box(wrapper).trigger('blur')

    expect(wrapper.emitted('focus')?.[0]).toEqual([])
    expect(wrapper.emitted('blur')?.[0]).toEqual([])
  })

  it('reverses the row and flags it for the CSS', () => {
    const root = mountCheckbox({ reverse: true }).get('.m-checkbox')

    expect(root.attributes('data-reverse')).toBe('true')
    expect(root.classes()).toContain('flex-row-reverse')
    expect(root.classes()).not.toContain('flex-row')
  })

  it('takes the label slot over the label prop', () => {
    const wrapper = mount(MCheckbox, {
      props: { modelValue: false, label: 'Ignored' },
      slots: { label: '<em>Accept the terms</em>' },
      global: { stubs: { transition: false } },
    })

    expect(wrapper.text()).toBe('Accept the terms')
  })

  it('honours an id from the call site and merges a class', () => {
    const wrapper = mountCheckbox({ id: 'privacy' }, { class: 'mt-8' })

    expect(box(wrapper).attributes('id')).toBe('privacy')
    expect(wrapper.get('.m-checkbox').classes()).toContain('mt-8')
  })
})
