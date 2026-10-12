import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MInput from '../src/components/Input.vue'

import type { MInputSize } from '../src/types/input'

const SIZES: MInputSize[] = ['xs', 'sm', 'md', 'lg']

describe('MInput', () => {
  it('renders the v1 anatomy', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email' },
    })

    expect(wrapper.get('.m-input').classes()).toContain('m-input')
    expect(wrapper.find('.m-input__target').exists()).toBe(true)
    expect(wrapper.find('.m-input__field').exists()).toBe(true)
    expect(wrapper.find('.m-input__control input').exists()).toBe(true)
    expect(wrapper.get('.m-input__label').text()).toBe('Email')
    expect(wrapper.get('.m-input__field').attributes('class')).toBeTruthy()
  })

  it('carries the label into the placeholder and ties the label to the control', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email' },
    })

    const input = wrapper.get('input')
    const id = input.attributes('id')

    expect(id).toBeTruthy()
    expect(input.attributes('placeholder')).toBe('Email')
    expect(input.attributes('name')).toBe(id)
    expect(wrapper.get('label').attributes('for')).toBe(id)
  })

  it('honours an id from the call site', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email', id: 'newsletter-email' },
    })

    expect(wrapper.get('input').attributes('id')).toBe('newsletter-email')
    expect(wrapper.get('label').attributes('for')).toBe('newsletter-email')
  })

  it('walks the size ramp for height and radius and holds v1’s md gap', () => {
    const expected: Record<MInputSize, [string, string]> = {
      xs: ['h-8', 'rounded-component-sm'],
      sm: ['h-10', 'rounded-component-md'],
      md: ['h-12', 'rounded-component-lg'],
      lg: ['h-14', 'rounded-component-xl'],
    }

    for (const size of SIZES) {
      const el = mount(MInput, {
        props: { modelValue: '', label: 'Email', size },
      }).get('.m-input')

      expect(el.attributes('data-size')).toBe(size)
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
      // v1 set the gap once from `gap.md` and its size loop never stepped it.
      expect(el.classes()).toContain('gap-1.5')
    }
  })

  it('writes the state the CSS keys off', async () => {
    const wrapper = mount(MInput, {
      props: {
        modelValue: 'hello',
        label: 'Email',
        error: true,
        disabled: true,
        simple: true,
        blur: true,
        required: true,
      },
    })

    const el = wrapper.get('.m-input')

    expect(el.attributes('data-filled')).toBe('true')
    expect(el.attributes('data-error')).toBe('true')
    expect(el.attributes('data-disabled')).toBe('true')
    expect(el.attributes('data-simple')).toBe('true')
    expect(el.attributes('data-blur')).toBe('true')
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(el.attributes('aria-required')).toBe('true')
    expect(el.attributes('aria-disabled')).toBe('true')
  })

  it('leaves the boolean state off rather than writing false', () => {
    const el = mount(MInput, {
      props: { modelValue: '', label: 'Email' },
    }).get('.m-input')

    expect(el.attributes('data-filled')).toBeUndefined()
    expect(el.attributes('data-error')).toBeUndefined()
    expect(el.attributes('data-disabled')).toBeUndefined()
    expect(el.attributes('data-simple')).toBeUndefined()
  })

  it('flags the slots it was given', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email' },
      slots: { start: '<i>at</i>', end: '<b>go</b>' },
    })

    const el = wrapper.get('.m-input')

    expect(el.attributes('data-slot-start')).toBe('true')
    expect(el.attributes('data-slot-end')).toBe('true')
    expect(wrapper.get('.m-input__start').html()).toContain('at')
    expect(wrapper.get('.m-input__end').html()).toContain('go')
  })

  it('emits the v1 events', async () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email' },
    })

    const input = wrapper.get('input')

    await input.setValue('a@b.c')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a@b.c'])

    await input.trigger('focus')
    expect(wrapper.emitted('focus')?.at(-1)).toEqual([])
    expect(wrapper.get('.m-input').attributes('data-focused')).toBe('true')

    await input.trigger('blur')
    expect(wrapper.emitted('blur')?.at(-1)).toEqual([])
    expect(wrapper.get('.m-input').attributes('data-focused')).toBeUndefined()
  })

  it('exposes focus', async () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email' },
      attachTo: document.body,
    })

    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(wrapper.get('input').element)
    wrapper.unmount()
  })

  it('does not focus when disabled', async () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email', disabled: true },
      attachTo: document.body,
    })

    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).not.toBe(wrapper.get('input').element)
    wrapper.unmount()
  })

  it('passes the input type through', () => {
    const wrapper = mount(MInput, {
      props: { modelValue: '', label: 'Email', type: 'email' },
    })

    expect(wrapper.get('input').attributes('type')).toBe('email')
  })
})
