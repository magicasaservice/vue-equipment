import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MMenuBox from '../src/components/MenuBox.vue'
import MMenuItem from '../src/components/MenuItem.vue'
import MMenuItemChild from '../src/components/MenuItemChild.vue'
import MMenuCard from '../src/components/MenuCard.vue'

import type { MMenuBoxSize } from '../src/types/menu-box'

const SIZES: MMenuBoxSize[] = ['xs', 'sm', 'md', 'lg']

describe('MMenuBox', () => {
  it('renders a div with the v1 defaults', () => {
    const wrapper = mount(MMenuBox, { slots: { default: 'Menu' } })
    const el = wrapper.get('.m-menu-box')

    expect(el.element.tagName).toBe('DIV')
    expect(el.attributes('data-size')).toBe('md')
    expect(el.text()).toBe('Menu')
  })

  it('carries v1’s chrome as utilities', () => {
    const classes = mount(MMenuBox).get('.m-menu-box').classes()

    // `bg.inverted.default`, `border.default` at 2px on a transparent border,
    // `padding.x`/`padding.y` at spacing 1.
    expect(classes).toContain('bg-primary-inverted')
    expect(classes).toContain('border-2')
    expect(classes).toContain('border-transparent')
    expect(classes).toContain('p-1')
    expect(classes).toContain('list-none')
  })

  it('leaves the shadow to the CSS block, where a call site can turn it off', () => {
    // v1 read `--menu-box-box-shadow`, which the nav menu set to `none`. A
    // utility could only be beaten by a second utility for the same property.
    const classes = mount(MMenuBox).get('.m-menu-box').classes()

    expect(classes.some((name) => name.startsWith('shadow-'))).toBe(false)
  })

  it('leaves the radius to the CSS block, which resolves it as a calc', () => {
    // v1: `radius.default.<size> + padding.x`, which is not a step on the
    // radius ramp, so no `rounded-*` utility may reach the element.
    for (const size of SIZES) {
      const classes = mount(MMenuBox, { props: { size } })
        .get('.m-menu-box')
        .classes()

      expect(classes.filter((c) => c.startsWith('rounded-'))).toHaveLength(0)
      expect(classes.filter((c) => c.startsWith('bg-'))).toHaveLength(1)
    }
  })

  it('writes the size as a data attribute for the ramp to key off', () => {
    for (const size of SIZES) {
      expect(
        mount(MMenuBox, { props: { size } })
          .get('.m-menu-box')
          .attributes('data-size')
      ).toBe(size)
    }
  })

  it('honours v1’s `as` and `asChild`', () => {
    expect(
      mount(MMenuBox, { props: { as: 'ul' } }).get('.m-menu-box').element
        .tagName
    ).toBe('UL')

    const child = mount(MMenuBox, {
      props: { asChild: true },
      slots: { default: () => h('nav', 'Menu') },
    })

    expect(child.get('.m-menu-box').element.tagName).toBe('NAV')
  })

  it('hands its size down to the items and cards inside it', () => {
    const wrapper = mount(MMenuBox, {
      props: { size: 'xs' },
      slots: {
        default: () => [
          h(MMenuItem, null, () => h(MMenuItemChild, null, () => 'Dark')),
          h(MMenuCard),
        ],
      },
    })

    expect(wrapper.get('.m-menu-item').attributes('data-size')).toBe('xs')
    expect(wrapper.get('.m-menu-item-child').attributes('data-size')).toBe('xs')
    expect(wrapper.get('.m-menu-card').attributes('data-size')).toBe('xs')
  })

  it('lets an item keep a size of its own', () => {
    const wrapper = mount(MMenuBox, {
      props: { size: 'xs' },
      slots: { default: () => h(MMenuItem, { size: 'lg' }) },
    })

    expect(wrapper.get('.m-menu-item').attributes('data-size')).toBe('lg')
  })

  it('renders the combinations the apps ask for', () => {
    // ToolbarGlyphSetSelect, ToolbarFontInstanceSelect, ToolbarGlyphInfo.
    expect(
      mount(MMenuBox, {
        props: { size: 'sm' },
        attrs: { class: 'grid max-h-96 min-w-64 gap-6' },
      })
        .get('.m-menu-box')
        .classes()
    ).toEqual(expect.arrayContaining(['m-menu-box', 'grid', 'max-h-96']))

    // ToolbarContextMenu and MenuRenderer, at the default size.
    expect(
      mount(MMenuBox, { attrs: { class: 'grid min-w-72 gap-2' } })
        .get('.m-menu-box')
        .attributes('data-size')
    ).toBe('md')

    // ColorModeSwitch.
    expect(
      mount(MMenuBox, {
        props: { size: 'xs' },
        attrs: { class: 'flex flex-col gap-0.75' },
      })
        .get('.m-menu-box')
        .attributes('data-size')
    ).toBe('xs')
  })
})
