<template>
  <div class="flex flex-wrap gap-4 justify-center">
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button class="w-full h-full px-6 py-4" @click="open">
        Open palette
      </button>
    </div>
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button class="w-full h-full px-6 py-4" @click="toggleWrapper">
        Switch to {{ wrapper === 'modal' ? 'drawer' : 'modal' }}
      </button>
    </div>
  </div>
  <magic-command-provider :id="id">
    <magic-command-modal v-if="wrapper === 'modal'">
      <default-view :is-modal="true" />
      <project-view :is-modal="true" />
    </magic-command-modal>
    <magic-command-drawer v-if="wrapper === 'drawer'">
      <default-view :is-modal="false" />
      <project-view :is-modal="false" />
    </magic-command-drawer>
  </magic-command-provider>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { useMagicCommand } from '../src/composables/useMagicCommand'
import type { ValueOf } from '@maas/vue-equipment/utils'

import DefaultView from './DefaultView.vue'
import ProjectView from './ProjectView.vue'

const id = 'magic-command-demo'
const commandApi = useMagicCommand(id)
const { open } = commandApi

const wrapper = ref<'modal' | 'drawer'>('modal')

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

function toggleWrapper() {
  wrapper.value = wrapper.value === 'modal' ? 'drawer' : 'modal'
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>

<style>
#magic-command-demo {
  --magic-drawer-drag-overshoot: 0rem;
}
</style>
