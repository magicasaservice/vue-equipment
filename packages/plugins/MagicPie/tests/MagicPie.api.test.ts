import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { defineComponent, nextTick } from 'vue'
import MagicPie from '../src/components/MagicPie.vue'
import { useMagicPie } from '../src/composables/useMagicPie'
import { PieId, TestId } from './enums'

// ─── Factory ──────────────────────────────────────────────────────────────────

function createPie(pieId: PieId, options: Record<string, unknown> = {}) {
  return defineComponent({
    components: { MagicPie },
    setup() {
      const api = useMagicPie(pieId)
      return { ...api }
    },
    template: `
      <div>
        <MagicPie id="${pieId}" :options="options" />
        <span data-test-id="${TestId.Percentage}">{{ percentage }}</span>
        <button data-test-id="${TestId.Set50}" @click="setPercentage(50)">Set 50</button>
        <button data-test-id="${TestId.SetNeg}" @click="setPercentage(-10)">Set -10</button>
        <button data-test-id="${TestId.SetOver}" @click="setPercentage(150)">Set 150</button>
        <button data-test-id="${TestId.Set75}" @click="setPercentage(75)">Set 75</button>
      </div>
    `,
    data() {
      return { options }
    },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MagicPie - API', () => {
  describe('composable return shape', () => {
    it('returns expected functions and state', () => {
      let api: ReturnType<typeof useMagicPie> | undefined

      render(
        defineComponent({
          setup() {
            api = useMagicPie(PieId.ApiShape)
            return {}
          },
          template: '<div>test</div>',
        })
      )

      expect(typeof api!.setPercentage).toBe('function')
      expect(typeof api!.interpolatePercentage).toBe('function')
      expect(typeof api!.cancelInterpolatePercentage).toBe('function')
      expect(api!.percentage).toBeDefined()
    })
  })

  describe('setPercentage', () => {
    it('sets percentage to given value', async () => {
      const screen = render(createPie(PieId.ApiSet))
      await nextTick()

      await screen.getByTestId(TestId.Set50).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Percentage))
        .toHaveTextContent('50')
    })

    it('clamps to 0 minimum', async () => {
      const screen = render(createPie(PieId.ApiClampMin))
      await nextTick()

      await screen.getByTestId(TestId.SetNeg).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Percentage))
        .toHaveTextContent('0')
    })

    it('clamps to 100 maximum', async () => {
      const screen = render(createPie(PieId.ApiClampMax))
      await nextTick()

      await screen.getByTestId(TestId.SetOver).click()
      await nextTick()

      await expect
        .element(page.getByTestId(TestId.Percentage))
        .toHaveTextContent('100')
    })

    it('updates SVG path when percentage changes', async () => {
      const screen = render(createPie(PieId.ApiPathUpdate))
      await nextTick()

      const pathBefore = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')

      await screen.getByTestId(TestId.Set75).click()
      await nextTick()

      const pathAfter = document
        .querySelector('.magic-pie path')!
        .getAttribute('d')
      expect(pathAfter).not.toBe(pathBefore)
    })
  })

  describe('interpolatePercentage', () => {
    it('animates percentage to target value', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.ApiInterp)
            return {}
          },
          template: `<MagicPie id="${PieId.ApiInterp}" />`,
        })
      )
      await nextTick()

      api!.interpolatePercentage({ value: 80, duration: 100 })
      await new Promise((r) => setTimeout(r, 200))

      expect(api!.percentage.value).toBeCloseTo(80, 0)
    })

    it('second call cancels the first', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.ApiCancelPrev)
            return {}
          },
          template: `<MagicPie id="${PieId.ApiCancelPrev}" />`,
        })
      )
      await nextTick()

      api!.interpolatePercentage({ value: 100, duration: 2000 })
      await new Promise((r) => setTimeout(r, 50))

      api!.interpolatePercentage({ value: 20, duration: 100 })
      await new Promise((r) => setTimeout(r, 200))

      expect(api!.percentage.value).toBeCloseTo(20, 0)
    })

    it('cancelInterpolatePercentage stops animation mid-flight', async () => {
      let api: ReturnType<typeof useMagicPie> | undefined
      render(
        defineComponent({
          components: { MagicPie },
          setup() {
            api = useMagicPie(PieId.ApiCancel)
            return {}
          },
          template: `<MagicPie id="${PieId.ApiCancel}" />`,
        })
      )
      await nextTick()

      api!.interpolatePercentage({ value: 100, duration: 1000 })
      await new Promise((r) => setTimeout(r, 50))
      api!.cancelInterpolatePercentage()

      const stoppedValue = api!.percentage.value
      await new Promise((r) => setTimeout(r, 100))

      expect(api!.percentage.value).toBe(stoppedValue)
    })
  })
})
