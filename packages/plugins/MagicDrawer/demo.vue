<template>
  <div class="m-auto rounded flex flex-wrap md:w-120 gap-4">
    <button
      @click="toggle"
      class="w-full h-full px-6 py-4 bg-gray-500/5 md:flex-1"
    >
      Open drawer
    </button>
    <button
      @click="drawerSnapApi.snapTo('300px')"
      class="w-full h-full px-6 py-4 bg-gray-500/5 md:flex-1"
    >
      Snap to 300px
    </button>
    <button
      @click="drawerSnapApi.open"
      class="w-full h-full px-6 py-4 bg-gray-500/5 md:flex-1"
    >
      Snap drawer
    </button>
  </div>
  <magic-drawer
    :id="id"
    :class="className"
    :options="{
      position: 'bottom',
    }"
  >
    <div
      tabindex="1"
      class="bg-gray-100 w-full h-full rounded-lg absolute inset-0 overflow-scroll"
    >
      <div
        v-for="i in 100"
        :key="i"
        class="p-4 text-black w-full flex justify-center"
      >
        {{ i }}
      </div>
    </div>
  </magic-drawer>

  <magic-drawer
    :id="snapId"
    :options="{
      position: 'bottom',
      snapPoints: ['150px', '300px', 0.5, 1],
      snapPoint: '150px',
      beforeMount: {
        open: false,
        animate: false,
      },
      backdrop: false,
    }"
  >
    <div tabindex="1" class="bg-gray-100 w-full h-full rounded-lg" />
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

const snapId = 'magic-drawer-snap'
const drawerSnapApi = useDrawerApi(snapId)

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
