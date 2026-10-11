import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MTextarea from '../src/components/Textarea.vue'

import type { MTextareaSize } from '../src/types/textarea'

const SIZES: MTextareaSize[] = ['xs', 'sm', 'md', 'lg']

describe('MTextarea', () => {
  it('renders the v1 anatomy', () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
    })

    expect(wrapper.get('.m-textarea').classes()).toContain('m-textarea')
    expect(wrapper.find('.m-textarea__outer').exists()).toBe(true)
    expect(wrapper.find('.m-textarea__target').exists()).toBe(true)
    expect(wrapper.find('.m-textarea__inner').exists()).toBe(true)
    expect(wrapper.find('.m-textarea__mirror').exists()).toBe(true)
    expect(wrapper.find('.m-textarea__line textarea').exists()).toBe(true)
    expect(wrapper.get('.m-textarea__label').text()).toBe('Message')
  })

  it('sits on the headless control', () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
    })

    expect(wrapper.get('textarea').classes()).toContain('mirror-textarea')
  })

  it('carries the label into the placeholder and ties the label to the control', () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
    })

    const textarea = wrapper.get('textarea')
    const id = textarea.attributes('id')

    expect(id).toBeTruthy()
    expect(textarea.attributes('placeholder')).toBe('Message')
    expect(textarea.attributes('name')).toBe(id)
    expect(wrapper.get('label').attributes('for')).toBe(id)
  })

  it('honours an id from the call site', () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message', id: 'contact-message' },
    })

    expect(wrapper.get('textarea').attributes('id')).toBe('contact-message')
    expect(wrapper.get('label').attributes('for')).toBe('contact-message')
  })

  it('walks the size ramp for the radius', () => {
    const expected: Record<MTextareaSize, string> = {
      xs: 'rounded-component-sm',
      sm: 'rounded-component-md',
      md: 'rounded-component-lg',
      lg: 'rounded-component-xl',
    }

    for (const size of SIZES) {
      const el = mount(MTextarea, {
        props: { modelValue: '', label: 'Message', size },
      }).get('.m-textarea')

      expect(el.attributes('data-size')).toBe(size)
      expect(el.classes()).toContain(expected[size])
    }
  })

  it('mirrors the value behind the control, with a zero-width space', () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: 'one\ntwo\n', label: 'Message' },
    })

    expect(wrapper.get('.m-textarea__mirror').text()).toBe('one\ntwo\n​')
  })

  it('measures markup in the value as text rather than rendering it', () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '<b>bold</b>', label: 'Message' },
    })

    expect(wrapper.find('.m-textarea__mirror b').exists()).toBe(false)
    expect(wrapper.get('.m-textarea__mirror').text()).toContain('<b>bold</b>')
  })

  it('writes the state the CSS keys off', () => {
    const el = mount(MTextarea, {
      props: {
        modelValue: 'hello',
        label: 'Message',
        error: true,
        disabled: true,
        simple: true,
        blur: true,
        required: true,
      },
    }).get('.m-textarea')

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
    const el = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
    }).get('.m-textarea')

    expect(el.attributes('data-filled')).toBeUndefined()
    expect(el.attributes('data-error')).toBeUndefined()
    expect(el.attributes('data-disabled')).toBeUndefined()
    expect(el.attributes('data-simple')).toBeUndefined()
    expect(el.attributes('data-blur')).toBeUndefined()
  })

  it('emits the v1 events', async () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
    })

    const textarea = wrapper.get('textarea')

    await textarea.setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hello'])

    await textarea.trigger('focus')
    expect(wrapper.emitted('focus')?.at(-1)).toEqual([])
    expect(wrapper.get('.m-textarea').attributes('data-focused')).toBe('true')

    await textarea.trigger('blur')
    expect(wrapper.emitted('blur')?.at(-1)).toEqual([])
    expect(
      wrapper.get('.m-textarea').attributes('data-focused')
    ).toBeUndefined()
  })

  it('exposes focus', async () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
      attachTo: document.body,
    })

    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(wrapper.get('textarea').element)
    wrapper.unmount()
  })

  it('does not focus when disabled', async () => {
    const wrapper = mount(MTextarea, {
      props: { modelValue: '', label: 'Message', disabled: true },
      attachTo: document.body,
    })

    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).not.toBe(wrapper.get('textarea').element)
    wrapper.unmount()
  })

  it('passes the flags down to the control', () => {
    const textarea = mount(MTextarea, {
      props: {
        modelValue: '',
        label: 'Message',
        disabled: true,
        required: true,
        spellcheck: true,
      },
    }).get('textarea')

    expect(textarea.attributes('disabled')).toBeDefined()
    expect(textarea.attributes('required')).toBeDefined()
    expect(textarea.attributes('spellcheck')).toBe('true')
  })

  it('merges a class from the call site', () => {
    const classes = mount(MTextarea, {
      props: { modelValue: '', label: 'Message' },
      attrs: { class: 'mt-4' },
    })
      .get('.m-textarea')
      .classes()

    expect(classes).toContain('mt-4')
    expect(classes).toContain('m-textarea')
  })
})
