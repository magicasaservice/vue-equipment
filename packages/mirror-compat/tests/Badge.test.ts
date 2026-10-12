import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MBadge from '../src/components/Badge.vue'

import type { MBadgeMode, MBadgeSize, MBadgeVariant } from '../src/types/badge'

const VARIANTS: MBadgeVariant[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'danger',
]
const MODES: MBadgeMode[] = ['solid', 'muted', 'subtle', 'outline']
const SIZES: MBadgeSize[] = ['xs', 'sm', 'md', 'lg']

/** Every utility on the element that sets the given CSS property. */
function utilitiesFor(classes: string[], property: 'bg' | 'text' | 'border') {
  return classes.filter((c) => {
    const bare = c.replace(/^[a-z-]+:/, '')
    return bare.startsWith(`${property}-`) && !/^border-\d+$/.test(bare)
  })
}

describe('MBadge', () => {
  it('renders a div with the v1 defaults', () => {
    const wrapper = mount(MBadge, { slots: { default: 'New' } })
    const el = wrapper.get('div')

    expect(el.text()).toBe('New')
    expect(el.attributes('data-variant')).toBe('primary')
    expect(el.attributes('data-mode')).toBe('solid')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.classes()).toContain('m-badge')
    expect(el.classes()).toContain('bg-primary-solid')
    expect(el.classes()).toContain('text-primary-on-solid')
    expect(el.classes()).toContain('h-6')
    expect(el.classes()).toContain('px-2')
    expect(el.classes()).toContain('rounded-component-compact-lg')
  })

  it('paints every variant and mode from the generated utilities', () => {
    for (const variant of VARIANTS) {
      for (const mode of MODES) {
        const el = mount(MBadge, { props: { variant, mode } }).get('div')
        const classes = el.classes()

        expect(el.attributes('data-variant')).toBe(variant)
        expect(el.attributes('data-mode')).toBe(mode)

        // A background, a border and a text colour arrive, exactly one each.
        expect(
          utilitiesFor(classes, 'bg').filter((c) => !c.includes(':'))
        ).toHaveLength(1)
        expect(
          utilitiesFor(classes, 'border').filter((c) => !c.includes(':'))
        ).toHaveLength(1)
        expect(
          utilitiesFor(classes, 'text').filter((c) => !c.includes(':'))
        ).toHaveLength(1)

        if (mode === 'outline') {
          expect(classes).toContain(`border-${variant}-muted`)
          expect(classes).toContain('bg-transparent')
          expect(classes).toContain(`text-${variant}-solid`)
        } else {
          expect(classes).toContain('border-transparent')
          expect(classes).toContain(`bg-${variant}-${mode}`)
          expect(classes).toContain(`text-${variant}-on-${mode}`)
        }
      }
    }
  })

  it('walks the size ramp for height, padding and radius', () => {
    const expected: Record<MBadgeSize, [string, string, string]> = {
      xs: ['h-4', 'px-1.5', 'rounded-component-compact-sm'],
      sm: ['h-5', 'px-1.75', 'rounded-component-compact-md'],
      md: ['h-6', 'px-2', 'rounded-component-compact-lg'],
      lg: ['h-7', 'px-2.25', 'rounded-component-compact-xl'],
    }

    for (const size of SIZES) {
      const el = mount(MBadge, { props: { size } }).get('div')

      expect(el.attributes('data-size')).toBe(size)
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
    }
  })

  it('drops the size radius when round is set', () => {
    const el = mount(MBadge, { props: { round: true } }).get('div')

    expect(el.attributes('data-round')).toBe('true')
    expect(el.classes()).toContain('rounded-component-round')
    expect(el.classes()).not.toContain('rounded-component-compact-lg')
  })

  it('trades the padding for a width when square is set', () => {
    for (const size of SIZES) {
      const el = mount(MBadge, { props: { square: true, size } }).get('div')
      const classes = el.classes()

      expect(el.attributes('data-square')).toBe('true')
      expect(classes).toContain('px-0')
      expect(classes.filter((c) => c.startsWith('px-'))).toHaveLength(1)
      expect(classes.filter((c) => /^w-/.test(c))).toHaveLength(1)
    }
  })

  it('leaves the boolean state off rather than writing false', () => {
    const el = mount(MBadge).get('div')

    expect(el.attributes('data-round')).toBeUndefined()
    expect(el.attributes('data-square')).toBeUndefined()
  })

  it('merges a class from the call site', () => {
    const classes = mount(MBadge, { attrs: { class: 'ml-2' } })
      .get('div')
      .classes()

    expect(classes).toContain('ml-2')
    expect(classes).toContain('m-badge')
  })
})
