<template>
  <div class="flex gap-2">
    <m-button @click="onClick">Add Toast</m-button>
    <m-button :disabled="toastCount === 0" @click="hide('zoom')">
      Hide (zoom)
    </m-button>
    <m-button :disabled="hidden === 0" @click="show('zoom')">
      Show (zoom)
    </m-button>
  </div>
  <magic-toast-provider
    id="magic-toast-hide-show-transition-demo"
    :options="{
      layout: {
        expand: false,
        max: 10,
      },
      initial: {
        expanded: true,
      },
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'

import '@maas/vue-equipment/utils/css/keyframes/zoom-in.css'
import '@maas/vue-equipment/utils/css/keyframes/zoom-out.css'

const count = ref(0)

const component = defineAsyncComponent(
  () => import('./components/DemoToast.vue')
)
const {
  add,
  hide,
  show,
  count: toastCount,
  hidden,
} = useMagicToast('magic-toast-hide-show-transition-demo')

function onClick() {
  count.value += 1

  const props = {
    message: count.value % 2 ? 'Magic as a Service™' : 'Vue Equipment',
  }

  add({ component, props })
}
</script>

<style>
/* Custom transition used only for hide('zoom') / show('zoom'),
   passed as the transition name override on those calls. */
.zoom-enter-active {
  animation: zoom-in var(--magic-toast-animation-duration) var(--ease-in-out);
}

.zoom-leave-active {
  animation: zoom-out var(--magic-toast-animation-duration) var(--ease-in-out);
  position: absolute;
}

.zoom-move {
  transition: all var(--magic-toast-animation-duration) var(--ease-in-out);
}
</style>
