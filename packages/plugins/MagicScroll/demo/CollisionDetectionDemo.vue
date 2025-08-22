<template>
  <magic-scroll-provider
    :target="parentRef"
    class="bg-surface-base aspect-square w-full"
  >
    <div ref="parentRef" class="relative h-full w-full overflow-auto">
      <magic-scroll-scene
        class="flex flex-col items-center justify-evenly gap-[100vh] pb-[100vh]"
      >
        <span
          class="type-surface-body-sm text-surface-subtle flex aspect-square w-full items-center justify-center"
        >
          Scroll down
        </span>
        <magic-scroll-collision
          v-for="i in 4"
          :id="`collision-${i}`"
          :key="i"
          class="bg-surface-high flex aspect-square w-full items-center justify-center"
        >
          <m-badge size="lg" mode="tone">{{ `Collision ${i}` }}</m-badge>
        </magic-scroll-collision>
      </magic-scroll-scene>
    </div>
  </magic-scroll-provider>
  <magic-toast-provider
    id="magic-scroll-collision-detection-demo"
    :options="{ position: 'bottom-right' }"
  />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, defineAsyncComponent, ref } from 'vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'
import { MBadge } from '@maas/mirror/vue'

const parentRef = ref<HTMLElement | undefined>(undefined)
const component = defineAsyncComponent(
  () => import('./components/CollisionDemoToast.vue')
)

const { add } = useMagicToast('magic-scroll-collision-detection-demo')

function callback(payload: MagicEmitterEvents['collision']) {
  add({ component, duration: 5000, props: { payload } })
}

useMagicEmitter().on('collision', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('collision', callback)
})
</script>
