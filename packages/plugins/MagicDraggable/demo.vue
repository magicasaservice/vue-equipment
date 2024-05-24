<template>
  <div>
    <magic-draggable
      id="demo-draggable"
      :options="{
        snapPoints: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        initial: {
          snapPoint: 'top-left',
        },
      }"
    >
      <div class="bg-[red] aspect-square w-40 rounded-md" />
    </magic-draggable>
    <magic-draggable
      id="demo-contained-draggable"
      :options="{
        snapPoints: [
          'top-left',
          'top-center',
          'top-right',
          'center-left',
          'center',
          'center-right',
          'bottom-left',
          'bottom-center',
          'bottom-right',
        ],
        initial: { snapPoint: 'center' },
        threshold: {
          distance: 32,
        },
      }"
      class="border-solid border-2 border-gray-500 aspect-square"
    >
      <div class="bg-[yellow] aspect-square w-20 rounded-full" />
    </magic-draggable>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>

<style>
#demo-contained-draggable {
  --magic-draggable-position: relative;
  --magic-draggable-z-index: 1;
}
</style>
