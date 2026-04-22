import { defineComponent } from 'vue'
import MagicPie from '../src/components/MagicPie.vue'
import { useMagicPie } from '../src/composables/useMagicPie'

export function createPie(
  pieId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicPie },
    setup() {
      const api = useMagicPie(pieId)
      return { ...api }
    },
    template: `
      <MagicPie id="${pieId}" :options="options" />
    `,
    data() {
      return { options }
    },
  })
}
