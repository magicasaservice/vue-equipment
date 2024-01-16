<template>
  <div class="m-auto rounded flex w-60 gap-2 bg-gray-500/5">
    <button @click="toggle" class="w-full h-full px-6 py-4">
      Toggle drawer
    </button>
  </div>
  <magic-drawer
    :id="id"
    :class="className"
    :options="{
      position: 'bottom',
      beforeMount: { open: true, animate: false },
    }"
  >
    <div
      tabindex="1"
      class="bg-gray-100 w-full h-[calc(50vh+var(--magic-drawer-drag-overshoot))] rounded-lg"
    />
  </magic-drawer>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useDrawerApi, useDrawerEmitter } from '@maas/vue-equipment/plugins'
import type { DrawerEvents } from './src/types'

const id = 'magic-drawer-demo'
const className = 'magic-drawer--test-class'
const drawerApi = useDrawerApi(id)
const { open, close } = drawerApi

function callback(
  event: keyof DrawerEvents,
  id: DrawerEvents[keyof DrawerEvents]
) {
  console.log(event, id)
}

function toggle() {
  drawerApi.isActive.value ? close() : open()
}

useDrawerEmitter().on('*', callback)

onBeforeUnmount(() => {
  useDrawerEmitter().off('*', callback)
})
</script>
