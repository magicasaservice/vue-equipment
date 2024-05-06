<template>
  <div class="flex flex-wrap gap-4 justify-center">
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="open" class="w-full h-full px-6 py-4">
        Open palette
      </button>
    </div>
    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button @click="toggleWrapper" class="w-full h-full px-6 py-4">
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
  useMagicCommand,
  type CommandEvents,
} from '@maas/vue-equipment/plugins'

import DefaultView from './demo/DefaultView.vue'
import ProjectView from './demo/ProjectView.vue'

const id = 'magic-command-demo'
const commandApi = useMagicCommand(id)
const { open, emitter } = commandApi

const wrapper = ref<'modal' | 'drawer'>('modal')

function callback(
  event: keyof CommandEvents,
  id: CommandEvents[keyof CommandEvents]
) {
  console.log(event, id)
}

function toggleWrapper() {
  wrapper.value = wrapper.value === 'modal' ? 'drawer' : 'modal'
}

emitter.on('*', callback)

onBeforeUnmount(() => {
  emitter.off('*', callback)
})
</script>

<style>
#magic-command-demo {
  --magic-drawer-drag-overshoot: 0rem;
}
</style>
