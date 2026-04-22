import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, nextTick } from 'vue'
import MagicPie from '../src/components/MagicPie.vue'
import { useMagicPie } from '../src/composables/useMagicPie'
import { PieId } from './enums'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicPie - Edge Cases', () => {
  describe('path correctness at different percentages', () => {
    it('0% and 100% generate different paths', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.EdgeDiffPaths)
            return {}
          },
          template: `<MagicPie id="${PieId.EdgeDiffPaths}" />`,
        })
      )
      await nextTick()

      api!.setPercentage(0)
      await nextTick()
      const path0 = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')

      api!.setPercentage(100)
      await nextTick()
      const path100 = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')

      expect(path0).not.toBe(path100)
    })

    it('25% and 50% generate different paths', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.Edge2550)
            return {}
          },
          template: `<MagicPie id="${PieId.Edge2550}" />`,
        })
      )
      await nextTick()

      api!.setPercentage(25)
      await nextTick()
      const path25 = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')

      api!.setPercentage(50)
      await nextTick()
      const path50 = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')

      expect(path25).not.toBe(path50)
    })

    it('100% path covers full area with multiple line segments', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.EdgeFull)
            return {}
          },
          template: `<MagicPie id="${PieId.EdgeFull}" />`,
        })
      )
      await nextTick()

      api!.setPercentage(100)
      await nextTick()

      const path = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')!
      expect(path.split('L').length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('custom easing', () => {
    it('interpolatePercentage accepts custom easing function', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.EdgeEasing)
            return {}
          },
          template: `<MagicPie id="${PieId.EdgeEasing}" />`,
        })
      )
      await nextTick()

      const easeInstant = (t: number) => (t >= 0 ? 1 : 0)
      api!.interpolatePercentage({
        value: 60,
        duration: 100,
        easing: easeInstant,
      })
      await new Promise((r) => setTimeout(r, 150))

      expect(api!.percentage.value).toBeCloseTo(60, 0)
    })
  })

  describe('flip mode', () => {
    it('flip mode generates different path than normal', async () => {
      let api1: ReturnType<typeof useMagicPie> | undefined
      let api2: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api1 = useMagicPie(PieId.EdgeFlipNormal)
            api2 = useMagicPie(PieId.EdgeFlipFlipped)
            return {}
          },
          template: `
            <div>
              <MagicPie id="${PieId.EdgeFlipNormal}" />
              <MagicPie id="${PieId.EdgeFlipFlipped}" :options="{ flip: true }" />
            </div>
          `,
        })
      )
      await nextTick()

      api1!.setPercentage(50)
      api2!.setPercentage(50)
      await nextTick()

      const paths = document.querySelectorAll('.magic-pie path')
      expect(paths[0]!.getAttribute('d')).not.toBe(
        paths[1]!.getAttribute('d')
      )
    })
  })

  describe('independent instances', () => {
    it('two pies maintain independent state', async () => {
      let api1: ReturnType<typeof useMagicPie> | undefined
      let api2: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api1 = useMagicPie(PieId.EdgeMulti1)
            api2 = useMagicPie(PieId.EdgeMulti2)
            return {}
          },
          template: `
            <div>
              <MagicPie id="${PieId.EdgeMulti1}" />
              <MagicPie id="${PieId.EdgeMulti2}" />
            </div>
          `,
        })
      )
      await nextTick()

      api1!.setPercentage(25)
      api2!.setPercentage(75)

      expect(api1!.percentage.value).toBe(25)
      expect(api2!.percentage.value).toBe(75)
    })
  })
})
