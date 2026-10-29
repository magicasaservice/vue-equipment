import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import MSelect from '../src/components/Select.vue'

import type { MSelectOption, MSelectSize } from '../src/types/select'

const SIZES: MSelectSize[] = ['xs', 'sm', 'md', 'lg']

const COUNTRIES: MSelectOption[] = [
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
]

// Items register on mount, and the `<option>` list is derived from that
// registration, so every mount needs one tick before the control is complete.
async function factory(props: Record<string, unknown> = {}, options = {}) {
  const wrapper = mount(MSelect, {
    props: {
      modelValue: '',
      label: 'Country',
      placeholder: 'Select a country',
      options: COUNTRIES,
      ...props,
    },
    ...options,
  })

  await nextTick()

  return wrapper
}

describe('MSelect', () => {
  it('renders the v1 anatomy', async () => {
    const wrapper = await factory()

    expect(wrapper.get('.m-select').classes()).toContain('m-select')
    expect(wrapper.find('.m-select__target').exists()).toBe(true)
    expect(wrapper.find('.m-select__field').exists()).toBe(true)
    expect(wrapper.find('.m-select__standin').exists()).toBe(true)
    expect(wrapper.get('.m-select__label').text()).toBe('Country')
  })

  it('runs on the browser’s own select, the way v1 did', async () => {
    const wrapper = await factory()
    const select = wrapper.get('select')

    expect(wrapper.get('.m-select').attributes('data-native')).toBe('true')
    expect(select.findAll('option').map((o) => o.text())).toEqual([
      'Germany',
      'France',
      'Japan',
    ])
    expect(select.findAll('option').map((o) => o.attributes('value'))).toEqual([
      'de',
      'fr',
      'jp',
    ])
  })

  it('ties the label to the control and names it after the id', async () => {
    const wrapper = await factory({ id: 'billing-country' })
    const select = wrapper.get('select')

    expect(select.attributes('name')).toBe('billing-country')
    expect(wrapper.get('label').attributes('for')).toBe(select.attributes('id'))
    expect(select.attributes('id')).toBeTruthy()
  })

  it('generates a name when the call site gives no id', async () => {
    const wrapper = await factory()

    expect(wrapper.get('select').attributes('name')).toBeTruthy()
  })

  it('walks the size ramp for height and radius and holds v1’s md gap', async () => {
    const expected: Record<MSelectSize, [string, string]> = {
      xs: ['h-8', 'rounded-component-sm'],
      sm: ['h-10', 'rounded-component-md'],
      md: ['h-12', 'rounded-component-lg'],
      lg: ['h-14', 'rounded-component-xl'],
    }

    for (const size of SIZES) {
      const el = (await factory({ size })).get('.m-select')

      expect(el.attributes('data-size')).toBe(size)
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
      // v1 set the gap once from `gap.md` and its size loop never stepped it.
      expect(el.classes()).toContain('gap-1.5')
    }
  })

  it('keeps one utility per CSS property', async () => {
    const classes = (await factory()).get('.m-select').classes()

    expect(classes.filter((c) => /^h-/.test(c))).toHaveLength(1)
    expect(classes.filter((c) => /^gap-/.test(c))).toHaveLength(1)
    expect(classes.filter((c) => /^rounded-/.test(c))).toHaveLength(1)
    expect(classes.filter((c) => /^bg-/.test(c))).toHaveLength(0)
  })

  it('lets a class from the call site through', async () => {
    const wrapper = await factory({}, { attrs: { class: 'col-span-2' } })

    expect(wrapper.get('.m-select').classes()).toContain('col-span-2')
  })

  it('shows the placeholder until something is picked', async () => {
    const wrapper = await factory()
    const el = wrapper.get('.m-select')

    expect(wrapper.get('.m-select__standin').text()).toBe('Select a country')
    expect(el.attributes('data-filled')).toBeUndefined()
    expect(el.attributes('data-placeholder')).toBe('true')

    await wrapper.setProps({ modelValue: 'fr' })
    await nextTick()

    expect(wrapper.get('.m-select__standin').text()).toBe('France')
    expect(wrapper.get('.m-select').attributes('data-filled')).toBe('true')
    expect(
      wrapper.get('.m-select').attributes('data-placeholder')
    ).toBeUndefined()
  })

  it('writes the state the CSS keys off', async () => {
    const el = (
      await factory({
        modelValue: 'de',
        simple: true,
        blur: true,
        error: true,
        required: true,
        disabled: true,
        iconStart: true,
        iconEnd: true,
      })
    ).get('.m-select')

    expect(el.attributes('data-filled')).toBe('true')
    expect(el.attributes('data-simple')).toBe('true')
    expect(el.attributes('data-blur')).toBe('true')
    expect(el.attributes('data-error')).toBe('true')
    expect(el.attributes('data-disabled')).toBe('true')
    expect(el.attributes('data-icon-start')).toBe('true')
    expect(el.attributes('data-icon-end')).toBe('true')
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(el.attributes('aria-required')).toBe('true')
    expect(el.attributes('aria-disabled')).toBe('true')
  })

  it('leaves the boolean state off rather than writing false', async () => {
    const el = (await factory()).get('.m-select')

    expect(el.attributes('data-simple')).toBeUndefined()
    expect(el.attributes('data-blur')).toBeUndefined()
    expect(el.attributes('data-error')).toBeUndefined()
    expect(el.attributes('data-disabled')).toBeUndefined()
    expect(el.attributes('data-icon-start')).toBeUndefined()
    expect(el.attributes('data-icon-end')).toBeUndefined()
    expect(el.attributes('data-slot-start')).toBeUndefined()
    expect(el.attributes('data-slot-end')).toBeUndefined()
  })

  it('flags the slots it was given', async () => {
    const wrapper = await factory(
      {},
      { slots: { start: '<i>at</i>', end: '<b>go</b>' } }
    )
    const el = wrapper.get('.m-select')

    expect(el.attributes('data-slot-start')).toBe('true')
    expect(el.attributes('data-slot-end')).toBe('true')
    expect(wrapper.get('.m-select__start').html()).toContain('at')
    expect(wrapper.get('.m-select__end').html()).toContain('go')
  })

  it('carries disabled and required to the control', async () => {
    const wrapper = await factory({ disabled: true, required: true })
    const select = wrapper.get('select')

    expect(select.attributes('disabled')).toBeDefined()
    expect(select.attributes('required')).toBeDefined()
  })

  it('round-trips v-model through the native control', async () => {
    const wrapper = await factory()
    const select = wrapper.get('select')

    select.element.value = 'fr'
    await select.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['fr'])

    await wrapper.setProps({ modelValue: 'fr' })

    expect(select.element.value).toBe('fr')
    expect(wrapper.get('.m-select__standin').text()).toBe('France')
  })

  it('round-trips numeric option values unchanged', async () => {
    const wrapper = await factory({
      modelValue: 0,
      options: [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
      ],
    })
    const select = wrapper.get('select')

    select.element.value = '2'
    await select.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
  })

  it('reads an empty string as no selection, the way v1 did', async () => {
    const wrapper = await factory({ modelValue: 'fr' })

    expect(wrapper.get('.m-select').attributes('data-filled')).toBe('true')

    await wrapper.setProps({ modelValue: '' })
    await nextTick()

    expect(wrapper.get('.m-select').attributes('data-filled')).toBeUndefined()
    expect(wrapper.get('select').element.selectedIndex).toBe(-1)
  })

  it('follows a value that changes from outside', async () => {
    const wrapper = await factory()

    await wrapper.setProps({ modelValue: 'jp' })
    await nextTick()

    const select = wrapper.get('select')

    expect(select.element.value).toBe('jp')
    expect(wrapper.get('.m-select__standin').text()).toBe('Japan')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('opens the browser’s picker rather than a popup of its own', async () => {
    const wrapper = await factory({}, { attachTo: document.body })

    await wrapper.get('.m-select').trigger('click')

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    expect(wrapper.find('[data-scope="popup"]').exists()).toBe(false)
    expect(wrapper.find('[data-scope="backdrop"]').exists()).toBe(false)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(
      wrapper.get('.m-select').attributes('data-popup-open')
    ).toBeUndefined()

    // The items live in the hidden registry, which is what fills the <option>s.
    const registry = wrapper.get('[data-scope="registry"]')
    expect(registry.attributes('inert')).toBeDefined()
    expect(registry.findAll('[role="option"]')).toHaveLength(3)

    wrapper.unmount()
  })

  it('closes on a pick without ever having opened a layer', async () => {
    const wrapper = await factory({}, { attachTo: document.body })
    const select = wrapper.get('select')

    await select.trigger('focus')
    select.element.value = 'jp'
    await select.trigger('change')
    await select.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['jp'])
    expect(wrapper.find('[data-scope="popup"]').exists()).toBe(false)
    expect(wrapper.get('.m-select').attributes('data-focused')).toBeUndefined()

    wrapper.unmount()
  })

  it('emits the v1 events and tracks focus', async () => {
    const wrapper = await factory({}, { attachTo: document.body })
    const select = wrapper.get('select')

    await select.trigger('focusin')
    expect(wrapper.emitted('focus')?.at(-1)).toEqual([])

    await select.trigger('focus')
    expect(wrapper.get('.m-select').attributes('data-focused')).toBe('true')

    await select.trigger('focusout')
    expect(wrapper.emitted('blur')?.at(-1)).toEqual([])

    await select.trigger('blur')
    expect(wrapper.get('.m-select').attributes('data-focused')).toBeUndefined()

    wrapper.unmount()
  })

  it('exposes focus', async () => {
    const wrapper = await factory({}, { attachTo: document.body })

    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(wrapper.get('select').element)
    wrapper.unmount()
  })

  it('does not focus when disabled', async () => {
    const wrapper = await factory(
      { disabled: true },
      { attachTo: document.body }
    )

    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).not.toBe(wrapper.get('select').element)
    wrapper.unmount()
  })

  it('follows the option list when it changes', async () => {
    const wrapper = await factory()

    await wrapper.setProps({
      options: [{ value: 'nl', label: 'Netherlands' }],
    })

    expect(
      wrapper
        .get('select')
        .findAll('option')
        .map((o) => o.text())
    ).toEqual(['Netherlands'])
  })
})
