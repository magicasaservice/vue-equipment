<template>
  <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
    <button @click="open" class="w-full h-full px-6 py-4">Open drawer</button>
  </div>
  <magic-drawer :id="id" :class="className" :options="{ position: 'bottom' }">
    <div tabindex="1" class="bg-gray-100 w-full h-[75vh] rounded-lg" />
  </magic-drawer>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useDrawerApi, useDrawerEmitter } from '@maas/vue-equipment/plugins'
import type { DrawerEvents } from './src/types'

const id = 'magic-drawer-demo'
const className = 'magic-drawer--test-class'
const drawerApi = useDrawerApi(id)
const { open } = drawerApi

function callback(
  event: keyof DrawerEvents,
  id: DrawerEvents[keyof DrawerEvents]
) {
  console.log(event, id)
}

useDrawerEmitter().on('*', callback)

onBeforeUnmount(() => {
  useDrawerEmitter().off('*', callback)
})
</script>
