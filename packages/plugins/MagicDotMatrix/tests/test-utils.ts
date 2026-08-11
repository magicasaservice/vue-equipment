import { defineComponent } from 'vue'
import MagicDotMatrix from '../src/components/MagicDotMatrix.vue'
import { useMagicDotMatrix } from '../src/composables/useMagicDotMatrix'
import type { DotMatrixSequence, MagicDotMatrixOptions } from '../src/types'

export function createDotMatrix(
  matrixId: string,
  sequence: DotMatrixSequence,
  options: MagicDotMatrixOptions = {}
) {
  return defineComponent({
    components: { MagicDotMatrix },
    setup() {
      const api = useMagicDotMatrix(matrixId)
      return { ...api }
    },
    data() {
      return { sequence, options }
    },
    template: `
      <MagicDotMatrix id="${matrixId}" :sequence="sequence" :options="options" />
    `,
  })
}
