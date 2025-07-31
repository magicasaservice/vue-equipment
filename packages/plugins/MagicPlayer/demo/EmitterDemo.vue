<template>
  <div ref="el" class="aspect-[16/9] w-full">
    <magic-player-provider
      id="magic-player-emitter-demo"
      :options="{
        src: 'https://stream.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8.m3u8',
        srcType: 'hls',
      }"
    >
      <magic-player-video />
      <magic-player-poster>
        <img
          src="https://image.mux.com/3wVFr42nN3VqIVv01ugl00oSJTzKlhsZ01ep2yKz5vqeZ8/thumbnail.png"
          alt="Poster"
        />
      </magic-player-poster>
      <magic-player-overlay />
      <magic-player-video-controls>
        <template #popover>
          <magic-player-mux-popover />
        </template>
      </magic-player-video-controls>
    </magic-player-provider>
    <magic-toast-provider
      id="magic-player-emitter-demo-toast"
      :options="{
        position: 'bottom-right',
        layout: { max: 6, expand: 'hover' },
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, defineAsyncComponent, useTemplateRef } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'

const component = defineAsyncComponent(
  () => import('./components/EmitterDemoToast.vue')
)

const { add } = useMagicToast('magic-player-emitter-demo-toast')

const elRef = useTemplateRef('el')
const isVisible = useElementVisibility(elRef)

function callback(
  id: keyof MagicEmitterEvents,
  payload: MagicEmitterEvents[keyof MagicEmitterEvents]
) {
  if (isVisible.value && payload === 'magic-player-emitter-demo') {
    add({ component, duration: 5000, props: { event: id } })
  }
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>

<style>
@import '@maas/vue-equipment/plugins/MagicPlayer/css/magic-player-video-controls.css';
</style>
