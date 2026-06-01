import { defineComponent } from 'vue'
import MagicDraggable from '../src/components/MagicDraggable.vue'
import { useMagicDraggable } from '../src/composables/useMagicDraggable'

export function createDraggable(
  draggableId: string,
  options: Record<string, unknown> = {}
) {
  return defineComponent({
    components: { MagicDraggable },
    setup() {
      const api = useMagicDraggable(draggableId)
      return { ...api }
    },
    template: `
      <MagicDraggable id="${draggableId}" :options="options">
        <div class="inner-content" style="width:50px;height:50px;">Content</div>
      </MagicDraggable>
    `,
    data() {
      return { options }
    },
  })
}
