import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MToggle from '../src/components/Toggle.vue'

import type { MToggleSize } from '../src/types/toggle'

const SIZES: MToggleSize[] = ['sm', 'md', 'lg']

function factory(props: Record<string, unknown> = {}, options = {}) {
  return mount(MToggle, {
    props: { modelValue: false, ...props },
    ...options,
  })
}

describe('MToggle', () => {
  it('renders the v1 anatomy', () => {
    const wrapper = factory({ label: 'Live' })

    expect(wrapper.get('.m-toggle').classes()).toContain('m-toggle')
    expect(wrapper.find('.m-toggle__checkbox').exists()).toBe(true)
    expect(wrapper.find('.m-toggle__track').exists()).toBe(true)
    expect(wrapper.find('.m-toggle__handle').exists()).toBe(true)
    expect(wrapper.text()).toBe('Live')
  })

  it('is a button, so a keyboard reaches it without a checkbox', () => {
    const el = factory().get('.m-toggle')

    expect(el.element.tagName).toBe('BUTTON')
    expect(el.attributes('type')).toBe('button')
    expect(el.attributes('aria-pressed')).toBe('false')
    expect(el.attributes('data-state')).toBe('off')
  })

  it('honours an id from the call site', () => {
    expect(factory({ id: 'live' }).get('.m-toggle').attributes('id')).toBe(
      'live'
    )
  })

  it('walks the gap ramp and writes the size', () => {
    const expected: Record<MToggleSize, string> = {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    }

    for (const size of SIZES) {
      const el = factory({ size }).get('.m-toggle')

      expect(el.attributes('data-size')).toBe(size)
      expect(el.classes()).toContain(expected[size])
    }
  })

  it('paints the resting track and handle', () => {
    const wrapper = factory()

    expect(wrapper.get('.m-toggle__track').classes()).toEqual(
      expect.arrayContaining([
        'bg-primary-subtle',
        'group-active:bg-primary-subtle-active',
        'border-transparent',
        'border-2',
        'outline-4',
        'outline-offset-0',
        'outline-transparent',
        'rounded-component-round',
        'group-focus-visible:focus-ring',
      ])
    )
    expect(wrapper.get('.m-toggle__handle').classes()).toEqual(
      expect.arrayContaining([
        'bg-primary-light',
        'text-primary-on-light',
        'border-transparent',
        'rounded-component-round',
      ])
    )
  })

  it('paints the checked track and handle', () => {
    const wrapper = factory({ modelValue: true })

    expect(wrapper.get('.m-toggle').attributes('data-state')).toBe('on')
    expect(wrapper.get('.m-toggle__track').classes()).toEqual(
      expect.arrayContaining([
        'bg-accent-solid',
        'group-active:bg-accent-solid-active',
      ])
    )
    expect(wrapper.get('.m-toggle__handle').classes()).toContain(
      'bg-accent-light'
    )
  })

  it('replaces the colour when disabled rather than layering on it', () => {
    const off = factory({ disabled: true })
    const on = factory({ disabled: true, modelValue: true })

    expect(off.get('.m-toggle__track').classes()).toContain(
      'bg-disabled-subtle'
    )
    expect(off.get('.m-toggle__track').classes()).not.toContain(
      'bg-primary-subtle'
    )
    expect(off.get('.m-toggle__handle').classes()).toContain(
      'bg-disabled-light'
    )
    expect(off.get('.m-toggle__handle').classes()).toContain(
      'text-disabled-solid'
    )

    expect(on.get('.m-toggle__track').classes()).toContain('bg-disabled-solid')
    expect(on.get('.m-toggle__handle').classes()).toContain(
      'text-disabled-subtle'
    )
  })

  it('keeps one utility per CSS property on each box', () => {
    for (const props of [{}, { modelValue: true }, { disabled: true }]) {
      const wrapper = factory(props)

      for (const part of ['.m-toggle__track', '.m-toggle__handle']) {
        const classes = wrapper.get(part).classes()

        expect(classes.filter((c) => /^bg-/.test(c))).toHaveLength(1)
        expect(classes.filter((c) => /^border-(?!\d)/.test(c))).toHaveLength(1)
        expect(classes.filter((c) => /^text-/.test(c)).length).toBeLessThan(2)
      }
    }
  })

  it('writes the state the CSS keys off', () => {
    const el = factory({
      mode: 'subtle',
      reverse: true,
      iconChecked: true,
      iconUnchecked: true,
      disabled: true,
    }).get('.m-toggle')

    expect(el.attributes('data-mode')).toBe('subtle')
    expect(el.attributes('data-reverse')).toBe('true')
    expect(el.attributes('data-icon-checked')).toBe('true')
    expect(el.attributes('data-icon-unchecked')).toBe('true')
    expect(el.attributes('data-disabled')).toBe('true')
    expect(el.attributes('disabled')).toBeDefined()
  })

  it('leaves the boolean state off rather than writing false', () => {
    const el = factory().get('.m-toggle')

    expect(el.attributes('data-reverse')).toBeUndefined()
    expect(el.attributes('data-icon-checked')).toBeUndefined()
    expect(el.attributes('data-icon-unchecked')).toBeUndefined()
    expect(el.attributes('data-disabled')).toBeUndefined()
    expect(el.attributes('data-mode')).toBe('solid')
  })

  it('round-trips v-model on a click', async () => {
    const wrapper = factory()

    await wrapper.get('.m-toggle').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('.m-toggle').attributes('data-state')).toBe('on')

    await wrapper.get('.m-toggle').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  // v1 listened for Enter itself and left Space to the checkbox it wrapped.
  // A native button answers both by dispatching a click, so there is no key
  // handler of our own to fire twice.
  it('leaves the keyboard to the button', async () => {
    const wrapper = factory()
    const el = wrapper.get('.m-toggle')

    await el.trigger('keydown', { key: 'Enter' })
    await el.trigger('keydown', { key: ' ' })
    await el.trigger('keyup', { key: ' ' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await el.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('stays put while disabled', async () => {
    const wrapper = factory({ disabled: true })

    await wrapper.get('.m-toggle').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('reads indeterminate as checked and leaves as a boolean', async () => {
    const wrapper = factory({ modelValue: 'indeterminate' })

    expect(wrapper.get('.m-toggle').attributes('data-state')).toBe('on')

    await wrapper.get('.m-toggle').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('shows one icon slot at a time', async () => {
    const wrapper = factory(
      {},
      { slots: { checked: '<i>on</i>', unchecked: '<b>off</b>' } }
    )

    expect(wrapper.get('.m-toggle__handle').html()).toContain('off')
    expect(wrapper.get('.m-toggle__handle').html()).not.toContain('>on<')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.get('.m-toggle__handle').html()).toContain('>on<')
    expect(wrapper.get('.m-toggle__handle').html()).not.toContain('off')
  })

  it('lets the label slot replace the default span', () => {
    const wrapper = factory(
      { label: 'Live' },
      { slots: { label: '<em>Broadcasting</em>' } }
    )

    expect(wrapper.text()).toBe('Broadcasting')
    expect(wrapper.find('em').exists()).toBe(true)
  })

  it('renders no label element when there is nothing to label', () => {
    const wrapper = factory()

    expect(wrapper.get('.m-toggle').element.children).toHaveLength(1)
  })

  it('lets a class from the call site through', () => {
    const wrapper = factory({}, { attrs: { class: 'mt-8' } })

    expect(wrapper.get('.m-toggle').classes()).toContain('mt-8')
  })
})
