import { defineComponent } from 'vue'
import MagicMarquee from '../src/components/MagicMarquee.vue'
import { useMagicMarquee } from '../src/composables/useMagicMarquee'

export function createMarquee(
  marqueeId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicMarquee },
    setup() {
      const api = useMagicMarquee(marqueeId)
      return { ...api }
    },
    template: `
      <MagicMarquee id="${marqueeId}" :options="options">
        <span class="inner-content">Item</span>
      </MagicMarquee>
    `,
    data() {
      return { options }
    },
  })
}
