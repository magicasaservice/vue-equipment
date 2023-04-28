import { defineComponent } from 'vue'
import { collisionDetect } from '../mixins/collision-detect'

// export default defineComponent({
//   mixins: [collisionDetect],
//   render() {
//     return this.$slots.default
//   },
// })

export default {
  mixins: [collisionDetect],
  setup(_props, ctx) {
    return () => ctx.slots.default()
  },
}
