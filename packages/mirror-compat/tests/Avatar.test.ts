import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MAvatar from '../src/components/Avatar.vue'

import type { MAvatarMode, MAvatarSize } from '../src/types/avatar'

const MODES: MAvatarMode[] = ['solid', 'subtle', 'outline']
const SIZES: MAvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

/** Every utility on the element that sets the given CSS property. */
function utilitiesFor(classes: string[], property: 'bg' | 'text' | 'border') {
  return classes.filter((c) => {
    const bare = c.replace(/^[a-z-]+:/, '')
    return bare.startsWith(`${property}-`) && !/^border-\d+$/.test(bare)
  })
}

describe('MAvatar', () => {
  it('renders a div with the v1 defaults', () => {
    const el = mount(MAvatar).get('div')

    expect(el.attributes('data-mode')).toBe('solid')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.classes()).toContain('m-avatar')
    expect(el.classes()).toContain('size-12')
    expect(el.classes()).toContain('rounded-component-lg')
    expect(el.classes()).toContain('bg-primary-solid')
    expect(el.classes()).toContain('text-primary-on-solid')
  })

  it('sits on the headless root', () => {
    const el = mount(MAvatar).get('div')

    expect(el.classes()).toContain('mirror-avatar')
    expect(el.attributes('data-scope')).toBe('root')
    expect(el.attributes('data-status')).toBe('idle')
  })

  it('falls back to the initials and lets the slot win', () => {
    expect(mount(MAvatar, { props: { initials: 'RV' } }).text()).toBe('RV')
    expect(
      mount(MAvatar, {
        props: { initials: 'RV' },
        slots: { default: '<svg />' },
      })
        .find('svg')
        .exists()
    ).toBe(true)
  })

  it('paints every mode from the generated utilities', () => {
    for (const mode of MODES) {
      const el = mount(MAvatar, { props: { mode } }).get('div')
      const classes = el.classes()

      expect(el.attributes('data-mode')).toBe(mode)
      expect(classes).toContain('border-2')
      expect(
        utilitiesFor(classes, 'bg').filter((c) => !c.includes(':'))
      ).toHaveLength(1)
      expect(
        utilitiesFor(classes, 'border').filter((c) => !c.includes(':'))
      ).toHaveLength(1)
      expect(
        utilitiesFor(classes, 'text').filter((c) => !c.includes(':'))
      ).toHaveLength(1)
    }

    expect(
      mount(MAvatar, { props: { mode: 'outline' } })
        .get('div')
        .classes()
    ).toContain('border-primary-muted')
  })

  it('walks the size ramp for the box and the radius', () => {
    const expected: Record<MAvatarSize, [string, string]> = {
      xs: ['size-8', 'rounded-component-sm'],
      sm: ['size-10', 'rounded-component-md'],
      md: ['size-12', 'rounded-component-lg'],
      lg: ['size-14', 'rounded-component-xl'],
      xl: ['size-16', 'rounded-component-2xl'],
    }

    for (const size of SIZES) {
      const el = mount(MAvatar, { props: { size } }).get('div')

      expect(el.attributes('data-size')).toBe(size)
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
    }
  })

  it('takes the inline box and radius ramp', () => {
    const expected: Record<MAvatarSize, [string, string]> = {
      xs: ['size-6', 'rounded-component-2xs'],
      sm: ['size-8', 'rounded-component-xs'],
      md: ['size-10', 'rounded-component-sm'],
      lg: ['size-12', 'rounded-component-md'],
      xl: ['size-14', 'rounded-component-lg'],
    }

    for (const size of SIZES) {
      const el = mount(MAvatar, { props: { inline: true, size } }).get('div')

      expect(el.attributes('data-inline')).toBe('true')
      for (const utility of expected[size]) {
        expect(el.classes()).toContain(utility)
      }
    }
  })

  it('drops the size radius when round is set', () => {
    const el = mount(MAvatar, { props: { round: true } }).get('div')

    expect(el.attributes('data-round')).toBe('true')
    expect(el.classes()).toContain('rounded-component-round')
    expect(el.classes()).not.toContain('rounded-component-lg')
  })

  it('drops the box for an image and keeps the solid foreground', () => {
    for (const mode of MODES) {
      const classes = mount(MAvatar, { props: { image: true, mode } })
        .get('div')
        .classes()

      expect(classes).toContain('border-0')
      expect(classes).toContain('bg-transparent')
      expect(classes).toContain('overflow-hidden')
      expect(classes).toContain('text-primary-on-solid')
      expect(classes).not.toContain('border-2')
      expect(classes).not.toContain('bg-primary-solid')
    }
  })

  it('carries the structural image override for a slot that holds one', () => {
    const classes = mount(MAvatar, {
      slots: { default: '<img src="a.png" />' },
    })
      .get('div')
      .classes()

    expect(classes).toContain('has-[img]:border-0')
    expect(classes).toContain('has-[img]:bg-transparent')
    expect(classes).toContain('has-[img]:overflow-hidden')
  })

  it('leaves the boolean state off rather than writing false', () => {
    const el = mount(MAvatar).get('div')

    expect(el.attributes('data-image')).toBeUndefined()
    expect(el.attributes('data-inline')).toBeUndefined()
    expect(el.attributes('data-round')).toBeUndefined()
  })

  it('merges a class and an attribute from the call site', () => {
    const el = mount(MAvatar, {
      attrs: { class: 'shrink-0', 'data-theme': 'aurora' },
    }).get('div')

    expect(el.classes()).toContain('shrink-0')
    expect(el.classes()).toContain('m-avatar')
    expect(el.attributes('data-theme')).toBe('aurora')
  })
})
