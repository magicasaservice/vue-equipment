<template>
  <div class="w-full flex justify-center">
    <m-button @click="open">Open modal</m-button>
  </div>
  <magic-modal :id="id" :class="className">
    <div
      tabindex="1"
      class="bg-surface-elevation-high w-[40rem] h-[30rem] rounded-surface-md"
    />
  </magic-modal>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { MButton } from '@maas/mirror/vue'
import {
  useMagicEmitter,
  useMagicModal,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'

const id = 'magic-modal-demo'
const className = 'magic-modal--test-class'
const modalApi = useMagicModal(id)
const { open } = modalApi

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
