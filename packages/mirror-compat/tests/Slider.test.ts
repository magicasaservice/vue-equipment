import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MSlider from '../src/components/Slider.vue'

import type { MSliderProps } from '../src/types/slider'

const STEPS = [
  { label: 'foo', value: 'foo' },
  { label: 'bar', value: 'bar' },
  { label: 'baz', value: 'baz' },
  { label: 'bat', value: 'bat' },
  { label: 'quux', value: 'quux' },
]

function mountSlider(props: Partial<MSliderProps> = {}, attrs = {}) {
  return mount(MSlider, { props: { modelValue: 0, ...props }, attrs })
}

function thumb(wrapper: ReturnType<typeof mountSlider>) {
  return wrapper.get('.m-slider__handle')
}

describe('MSlider', () => {
  it('renders the v1 anatomy with the v1 defaults', () => {
    const wrapper = mountSlider({ modelValue: 50 })
    const root = wrapper.get('.m-slider')

    expect(root.attributes('role')).toBe('group')
    expect(root.classes()).toContain('w-full')
    expect(wrapper.get('.m-slider__container').classes()).toContain('h-8')
    expect(wrapper.find('.m-slider__track').exists()).toBe(true)
    expect(wrapper.find('.m-slider__range').exists()).toBe(true)
    expect(wrapper.find('.m-slider__handle-fill').exists()).toBe(true)
    expect(wrapper.find('.m-slider__target').exists()).toBe(true)

    expect(thumb(wrapper).attributes('role')).toBe('slider')
    expect(thumb(wrapper).attributes('aria-valuemin')).toBe('0')
    expect(thumb(wrapper).attributes('aria-valuemax')).toBe('100')
    expect(thumb(wrapper).attributes('aria-valuenow')).toBe('50')
  })

  it('paints the resting track from one background utility', () => {
    const classes = mountSlider().get('.m-slider__track').classes()

    expect(classes).toContain('bg-primary-subtle')
    expect(classes.filter((c) => c.startsWith('bg-'))).toHaveLength(1)
    expect(classes).toContain('rounded-component-round')
  })

  it('replaces the track colour while disabled', () => {
    const wrapper = mountSlider({ disabled: true })
    const classes = wrapper.get('.m-slider__track').classes()

    expect(classes).toContain('bg-disabled-subtle')
    expect(classes).not.toContain('bg-primary-subtle')
    expect(wrapper.get('.m-slider').attributes('data-disabled')).toBe('true')
  })

  it('carries the fill percentage the step row is clipped to', () => {
    const style = (value: number, min = 0, max = 100) =>
      mountSlider({ modelValue: value, min, max })
        .get('.m-slider')
        .attributes('style')

    expect(style(0)).toContain('--m-slider-fill: 0%')
    expect(style(25)).toContain('--m-slider-fill: 25%')
    expect(style(100)).toContain('--m-slider-fill: 100%')
    expect(style(5, 0, 20)).toContain('--m-slider-fill: 25%')
    expect(style(999)).toContain('--m-slider-fill: 100%')
  })

  it('takes a numeric string, as v1 did', () => {
    const wrapper = mountSlider({ modelValue: '40' })

    expect(thumb(wrapper).attributes('aria-valuenow')).toBe('40')
    expect(wrapper.get('.m-slider').attributes('style')).toContain(
      '--m-slider-fill: 40%'
    )
  })

  it('round trips v-model from the keyboard', async () => {
    const wrapper = mountSlider({ modelValue: 50 })

    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([51])

    await thumb(wrapper).trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([49])
  })

  it('walks by the step it was given', async () => {
    const wrapper = mountSlider({ modelValue: 50, step: 10 })

    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([60])
  })

  it('stops at the bounds', async () => {
    const wrapper = mountSlider({ modelValue: 100 })

    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })

    const emitted = wrapper.emitted('update:modelValue')

    expect(emitted?.at(-1) ?? [100]).toEqual([100])
  })

  it('never moves while disabled', async () => {
    const wrapper = mountSlider({ modelValue: 50, disabled: true })

    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(thumb(wrapper).attributes('tabindex')).toBe('-1')
  })

  it('turns named steps into an index and emits the step value back', async () => {
    const wrapper = mountSlider({ modelValue: 'baz', steps: STEPS })

    expect(thumb(wrapper).attributes('aria-valuemin')).toBe('0')
    expect(thumb(wrapper).attributes('aria-valuemax')).toBe('4')
    expect(thumb(wrapper).attributes('aria-valuenow')).toBe('2')
    expect(wrapper.get('.m-slider').attributes('style')).toContain(
      '--m-slider-fill: 50%'
    )

    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['bat'])
  })

  it('draws one dot per step, in both rows', () => {
    const wrapper = mountSlider({ modelValue: 'foo', steps: STEPS })
    const rows = wrapper.findAll('.m-slider__steps')

    expect(rows).toHaveLength(2)
    expect(rows[0]?.attributes('data-active')).toBeUndefined()
    expect(rows[1]?.attributes('data-active')).toBe('true')
    expect(rows[0]?.findAll('span')).toHaveLength(STEPS.length)
  })

  it('leaves the step rows out when there are none', () => {
    expect(mountSlider().findAll('.m-slider__steps')).toHaveLength(0)
  })

  it('reports a drag the way v1 did', async () => {
    const wrapper = mountSlider({ modelValue: 50 })

    await wrapper.get('.m-slider__container').trigger('pointerdown', {
      clientX: 10,
    })

    expect(wrapper.emitted('dragging')?.[0]).toEqual([true])

    await wrapper.get('.m-slider__container').trigger('pointerup', {
      clientX: 10,
    })

    expect(wrapper.emitted('dragging')?.at(-1)).toEqual([false])
  })

  it('holds the focus ring back after a pointer press until a key', async () => {
    const wrapper = mountSlider({ modelValue: 50 })
    const root = wrapper.get('.m-slider')

    expect(root.attributes('data-pointer-focus')).toBeUndefined()

    await wrapper.get('.m-slider__container').trigger('pointerdown', {
      clientX: 10,
    })

    expect(root.attributes('data-pointer-focus')).toBe('true')

    await thumb(wrapper).trigger('keydown', { key: 'ArrowRight' })

    expect(root.attributes('data-pointer-focus')).toBeUndefined()
  })

  it('merges a class from the call site', () => {
    const classes = mountSlider({}, { class: 'w-24' })
      .get('.m-slider')
      .classes()

    expect(classes).toContain('w-24')
    expect(classes).toContain('m-slider')
  })
})
