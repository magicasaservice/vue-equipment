import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { createApp, defineComponent, ref } from 'vue'
import MagicDotMatrix from '../src/components/MagicDotMatrix.vue'
import { useMagicDotMatrixEmoji } from '../src/composables/useMagicDotMatrixEmoji'
import { MatrixId, TestId } from './enums'
import type { MagicDotMatrixEmojiOptions } from '../src/types'

function withSetup<ResultType>(composable: () => ResultType): ResultType {
  let result!: ResultType
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  app.unmount()
  return result
}

function createEmojiMatrix(
  matrixId: MatrixId,
  initial: string,
  options: MagicDotMatrixEmojiOptions = {}
) {
  return defineComponent({
    components: { MagicDotMatrix },
    setup() {
      const emoji = ref(initial)
      const api = useMagicDotMatrixEmoji(emoji, options)
      return { emoji, ...api, matrixOptions: api.options }
    },
    template: `
      <div>
        <MagicDotMatrix
          id="${matrixId}"
          :sequence="sequence"
          :options="matrixOptions"
          :style="style"
        />
        <span data-test-id="${TestId.Motion}">{{ motion }}</span>
        <span data-test-id="${TestId.Frames}">{{ sequence.length }}</span>
        <button data-test-id="${TestId.SetBell}" @click="emoji = '🔔'">Bell</button>
      </div>
    `,
  })
}

function getRoot(matrixId: MatrixId) {
  const root = document.querySelector(`[data-id='${matrixId}']`)
  return root instanceof HTMLElement ? root : undefined
}

describe('MagicDotMatrix - Emoji', () => {
  describe('motion', () => {
    it('picks curated motions, ignoring skin tones', () => {
      expect(withSetup(() => useMagicDotMatrixEmoji('🔔')).motion.value).toBe(
        'swing'
      )
      expect(withSetup(() => useMagicDotMatrixEmoji('❤️')).motion.value).toBe(
        'beat'
      )
      expect(withSetup(() => useMagicDotMatrixEmoji('👋🏽')).motion.value).toBe(
        'wave'
      )
    })

    it('reads combined emoji by their parts, except for people', () => {
      expect(withSetup(() => useMagicDotMatrixEmoji('🐦‍🔥')).motion.value).toBe(
        'flicker'
      )
      expect(withSetup(() => useMagicDotMatrixEmoji('👩‍🍳')).motion.value).toBe(
        'bob'
      )
    })

    it('falls back to unicode ranges and then to pop', () => {
      expect(withSetup(() => useMagicDotMatrixEmoji('🇩🇪')).motion.value).toBe(
        'flag'
      )
      expect(withSetup(() => useMagicDotMatrixEmoji('🐶')).motion.value).toBe(
        'hop'
      )
      expect(withSetup(() => useMagicDotMatrixEmoji('A')).motion.value).toBe(
        'pop'
      )
    })
  })

  describe('rendering', () => {
    it('renders the motion’s frames after mount', async () => {
      render(createEmojiMatrix(MatrixId.EmojiRender, '🔥'))

      await expect
        .element(page.getByTestId(TestId.Frames))
        .toHaveTextContent('12')

      const root = getRoot(MatrixId.EmojiRender)
      expect(root?.querySelectorAll('[data-active]').length).toBeGreaterThan(0)
      expect(
        root?.style.getPropertyValue('--magic-dot-matrix-color-1')
      ).not.toBe('')
    })

    it('renders onto the configured grid', async () => {
      render(createEmojiMatrix(MatrixId.EmojiGrid, '❤️', { cols: 6, rows: 6 }))

      await expect
        .element(page.getByTestId(TestId.Frames))
        .toHaveTextContent('16')

      const root = getRoot(MatrixId.EmojiGrid)
      expect(root?.querySelectorAll('.magic-dot-matrix__dot').length).toBe(36)
      expect(root?.querySelectorAll('[data-active]').length).toBeGreaterThan(0)
    })

    it('limits the palette to the configured number of colors', async () => {
      render(createEmojiMatrix(MatrixId.EmojiColors, '❤️', { colors: 2 }))

      await expect
        .element(page.getByTestId(TestId.Frames))
        .toHaveTextContent('16')

      const root = getRoot(MatrixId.EmojiColors)
      expect(
        root?.style.getPropertyValue('--magic-dot-matrix-color-1')
      ).not.toBe('')
      expect(root?.style.getPropertyValue('--magic-dot-matrix-color-3')).toBe(
        ''
      )
    })

    it('renders nothing for an empty string', async () => {
      render(createEmojiMatrix(MatrixId.EmojiEmpty, ''))

      await expect
        .element(page.getByTestId(TestId.Motion))
        .toHaveTextContent('pop')
      await expect
        .element(page.getByTestId(TestId.Frames))
        .toHaveTextContent('0')

      const root = getRoot(MatrixId.EmojiEmpty)
      expect(root?.querySelectorAll('[data-active]').length).toBe(0)
    })

    it('renders again when the emoji changes', async () => {
      render(createEmojiMatrix(MatrixId.EmojiChange, '🔥'))

      await expect
        .element(page.getByTestId(TestId.Frames))
        .toHaveTextContent('12')
      await page.getByTestId(TestId.SetBell).click()

      await expect
        .element(page.getByTestId(TestId.Motion))
        .toHaveTextContent('swing')
      await expect
        .element(page.getByTestId(TestId.Frames))
        .toHaveTextContent('20')
    })
  })
})
