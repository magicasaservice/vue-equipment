<template>
  <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
    <button @click="open" class="w-full h-full px-6 py-4">Open palette</button>
  </div>
  <magic-command :id="id">
    <default-view />
    <project-view />
  </magic-command>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import {
  useCommandApi,
  useCommandEmitter,
  type CommandEvents,
} from '@maas/vue-equipment/plugins'

import DefaultView from './demo/DefaultView.vue'
import ProjectView from './demo/ProjectView.vue'

const id = 'magic-command-demo'
const commandApi = useCommandApi(id)
const { open } = commandApi

function callback(
  event: keyof CommandEvents,
  id: CommandEvents[keyof CommandEvents]
) {
  console.log(event, id)
}

useCommandEmitter().on('*', callback)

onBeforeUnmount(() => {
  useCommandEmitter().off('*', callback)
})
</script>
