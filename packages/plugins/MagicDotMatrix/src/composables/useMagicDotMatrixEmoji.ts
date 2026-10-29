import { computed, shallowRef, toValue, watch } from 'vue'
import { tryOnMounted } from '@vueuse/core'
import { defu } from 'defu'
import { animateEmoji } from '../utils/emoji/animateEmoji'
import { motions } from '../utils/emoji/motions'
import { pickMotion } from '../utils/emoji/pickMotion'
import { defaultEmojiOptions } from '../utils/defaultOptions'
import type { MaybeRefOrGetter } from 'vue'
import type {
  DotMatrixEmojiAnimation,
  MagicDotMatrixEmojiOptions,
} from '../types/index'

/**
 * @experimental Options, return values and motions may change, and the
 * composable may be removed again in a future release.
 */
export function useMagicDotMatrixEmoji(
  emoji: MaybeRefOrGetter<string>,
  options?: MaybeRefOrGetter<MagicDotMatrixEmojiOptions>
) {
  // Private state
  const mappedOptions = computed(() =>
    defu(toValue(options) ?? {}, defaultEmojiOptions)
  )
  const animation = shallowRef<
    Pick<DotMatrixEmojiAnimation, 'sequence' | 'colors'>
  >({ sequence: [], colors: [] })

  // Public state
  const motion = computed(() => pickMotion(toValue(emoji)).name)

  const sequence = computed(() => animation.value.sequence)

  const matrixOptions = computed(() => ({
    cols: mappedOptions.value.cols,
    rows: mappedOptions.value.rows,
    interval: motions[motion.value].interval,
  }))

  const style = computed(() => {
    const { colors } = animation.value

    return {
      ...Object.fromEntries(
        colors.map((color, index) => [
          `--magic-dot-matrix-color-${index + 1}`,
          color,
        ])
      ),
      ...(colors[0] && {
        '--magic-dot-matrix-inactive-color': `color-mix(in srgb, ${colors[0]} 15%, transparent)`,
      }),
    }
  })

  // Private functions
  function update() {
    const { sequence, colors } = animateEmoji({
      emoji: toValue(emoji),
      ...mappedOptions.value,
    })

    animation.value = { sequence, colors }
  }

  // The canvas only exists in the browser, and rendering after mount keeps
  // the hydrated markup identical to the server’s.
  tryOnMounted(() => {
    watch([() => toValue(emoji), mappedOptions], update, { immediate: true })
  })

  return {
    sequence,
    options: matrixOptions,
    style,
    motion,
  }
}

export type UseMagicDotMatrixEmojiReturn = ReturnType<
  typeof useMagicDotMatrixEmoji
>
