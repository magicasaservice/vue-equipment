import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MButton from '../src/components/Button.vue'

import type {
  MButtonMode,
  MButtonSize,
  MButtonVariant,
} from '../src/types/button'

const VARIANTS: MButtonVariant[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'danger',
]
const MODES: MButtonMode[] = [
  'solid',
  'muted',
  'subtle',
  'ghost',
  'outline',
  'plain',
]
const SIZES: MButtonSize[] = ['xs', 'sm', 'md', 'lg']

/** Every utility on the element that sets the given CSS property. */
function utilitiesFor(classes: string[], property: 'bg' | 'text' | 'border') {
  return classes.filter((c) => {
    const bare = c.replace(/^[a-z-]+:/, '')
    return bare.startsWith(`${property}-`) && !/^border-\d+$/.test(bare)
  })
}

describe('MButton', () => {
  it('renders a button with the v1 defaults', () => {
    const wrapper = mount(MButton, { slots: { default: 'Subscribe' } })
    const el = wrapper.get('button')

    expect(el.text()).toBe('Subscribe')
    expect(el.attributes('type')).toBe('button')
    expect(el.attributes('data-variant')).toBe('primary')
    expect(el.attributes('data-mode')).toBe('solid')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.classes()).toContain('m-button')
    expect(el.classes()).toContain('bg-primary-solid')
    expect(el.classes()).toContain('text-primary-on-solid')
    expect(el.classes()).toContain('h-12')
    expect(el.classes()).toContain('rounded-component-lg')
    expect(el.classes()).toContain('type-component-lg')
  })

  it('paints every variant and mode from the generated utilities', () => {
    for (const variant of VARIANTS) {
      for (const mode of MODES) {
        const el = mount(MButton, { props: { variant, mode } }).get('button')
        const classes = el.classes()

        expect(el.attributes('data-variant')).toBe(variant)
        expect(el.attributes('data-mode')).toBe(mode)

        // A background and a border colour always arrive, exactly one each.
        expect(
          utilitiesFor(classes, 'bg').filter((c) => !c.includes(':'))
        ).toHaveLength(1)
        expect(
          utilitiesFor(classes, 'border').filter((c) => !c.includes(':'))
        ).toHaveLength(1)
        expect(
          utilitiesFor(classes, 'text').filter((c) => !c.includes(':'))
        ).toHaveLength(1)

        if (mode === 'solid' || mode === 'muted' || mode === 'subtle') {
          expect(classes).toContain(`bg-${variant}-${mode}`)
          expect(classes).toContain(`text-${variant}-on-${mode}`)
        }

        if (mode === 'outline') {
          expect(classes).toContain(`border-${variant}-muted`)
          expect(classes).toContain('bg-transparent')
        }

        if (mode === 'ghost' || mode === 'plain') {
          expect(classes).toContain('bg-transparent')
        }
      }
    }
  })

  it('walks the size ramp for height, radius and type', () => {
    const expected: Record<MButtonSize, [string, string, string]> = {
      xs: ['h-8', 'rounded-component-sm', 'type-component-sm'],
      sm: ['h-10', 'rounded-component-md', 'type-component-md'],
      md: ['h-12', 'rounded-component-lg', 'type-component-lg'],
      lg: ['h-14', 'rounded-component-xl', 'type-component-xl'],
    }

    for (const size of SIZES) {
      const classes = mount(MButton, { props: { size } })
        .get('button')
        .classes()
      for (const utility of expected[size]) {
        expect(classes).toContain(utility)
      }
    }
  })

  it('drops the size radius when round is set', () => {
    const classes = mount(MButton, { props: { round: true } })
      .get('button')
      .classes()

    expect(classes).toContain('rounded-component-round')
    expect(classes).not.toContain('rounded-component-lg')
  })

  it('takes the inline height and radius ramp', () => {
    const el = mount(MButton, { props: { inline: true, size: 'sm' } }).get(
      'button'
    )

    expect(el.attributes('data-inline')).toBe('true')
    expect(el.classes()).toContain('h-7')
    expect(el.classes()).toContain('rounded-component-xs')
  })

  it('sizes square from the height and lets block win over it', () => {
    const square = mount(MButton, { props: { square: true } })
      .get('button')
      .classes()
    expect(square).toContain('w-12')

    const both = mount(MButton, { props: { square: true, block: true } })
      .get('button')
      .classes()
    expect(both).toContain('w-full')
    expect(both).not.toContain('w-12')
  })

  it('holds the hover colour while selected, without a second background', () => {
    const classes = mount(MButton, { props: { selected: true } })
      .get('button')
      .classes()

    expect(classes).toContain('bg-primary-solid-hover')
    expect(classes).not.toContain('bg-primary-solid')
    expect(classes).toContain('data-[pressed=true]:bg-primary-solid-active')
  })

  it('drops the variant entirely when disabled', () => {
    for (const mode of MODES) {
      const el = mount(MButton, {
        props: { disabled: true, mode, variant: 'danger' },
      }).get('button')

      expect(el.attributes('data-disabled')).toBe('true')
      expect(el.classes().join(' ')).not.toContain('danger')
      expect(el.classes().join(' ')).toContain('disabled')
    }
  })

  it('renders polymorphically', () => {
    const wrapper = mount(MButton, {
      props: { as: 'a' },
      slots: { default: 'Read more' },
    })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('pins the focus ring flush, even as a link', () => {
    // Chrome offsets the outline of a focused link by 1px; v1 set it to 0.
    const el = mount(MButton, { props: { as: 'a' } }).get('a')

    expect(el.classes()).toContain('outline-offset-0')
  })

  it('merges a class from the call site', () => {
    const classes = mount(MButton, { attrs: { class: 'w-24' } })
      .get('button')
      .classes()

    expect(classes).toContain('w-24')
    expect(classes).toContain('m-button')
  })

  it('flags icon slots on the element for the CSS to pick up', () => {
    const el = mount(MButton, {
      props: { icon: true, iconStart: true, iconEnd: true, blur: true },
    }).get('button')

    expect(el.attributes('data-icon')).toBe('true')
    expect(el.attributes('data-icon-start')).toBe('true')
    expect(el.attributes('data-icon-end')).toBe('true')
    expect(el.attributes('data-blur')).toBe('true')
  })
})
