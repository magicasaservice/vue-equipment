<template>
  <div class="m-auto rounded flex flex-wrap md:w-120 gap-4">
    <button
      @click="drawerApi.open"
      class="w-full h-full px-6 py-4 bg-gray-500/5 md:flex-1"
    >
      Standard drawer
    </button>
    <button
      @click="drawerSnapApi.open"
      class="w-full h-full px-6 py-4 bg-gray-500/5 md:flex-1"
    >
      Snap drawer
    </button>
    <button
      @click="drawerHorizontalApi.open"
      class="w-full h-full px-6 py-4 bg-gray-500/5"
    >
      Horizontal snap drawer
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
      class="bg-gray-100 w-full h-full absolute inset-0 overflow-auto flex flex-col items-start justify-end gap-4 p-4 pb-24"
    >
      <a href="/plugins/MagicModal/">MagicModal</a>
      <!-- <nuxt-link to="/magic-modal">MagicModal (Nuxt)</nuxt-link> -->
      <input type="checkbox" v-model="checkbox" />
      <input
        type="text"
        v-model="text"
        class="bg-white text-black dark:bg-gray-300"
      />
    </div>
  </magic-drawer>

  <magic-drawer
    :id="snapId"
    :options="{
      snap: {
        points: ['150px', 1],
        initial: '150px',
      },
    }"
  >
    <div class="bg-gray-100 w-full h-full absolute inset-0 overflow-auto pb-24">
      <div v-for="i in 25" :key="i" class="p-4 text-black w-full">
        {{ i }}
      </div>
      <input
        type="text"
        v-model="text"
        class="bg-white text-black dark:bg-gray-300"
      />
    </div>
  </magic-drawer>

  <magic-drawer
    :id="horizontalId"
    :options="{
      position,
      focusTrap: false,
      snap: {
        points: ['150px', 0.5, 1],
        initial: '150px',
      },
    }"
  >
    <div
      ref="scrollable"
      class="bg-gray-100 absolute inset-0 overflow-x-auto flex"
    >
      <span v-for="i in 50" :key="i" class="p-4 text-black w-full">
        {{ i }}
      </span>
    </div>
  </magic-drawer>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import {
  useDrawerApi,
  useDrawerEmitter,
  type DrawerEvents,
} from '@maas/vue-equipment/plugins'

const className = 'magic-drawer--test-class'

const id = 'magic-drawer-demo'
const drawerApi = useDrawerApi(id)

const snapId = 'magic-drawer-snap-demo'
const drawerSnapApi = useDrawerApi(snapId)

const horizontalId = 'magic-drawer-horizontal-demo'
const drawerHorizontalApi = useDrawerApi(horizontalId)

const scrollable = ref<HTMLDivElement | undefined>(undefined)
const position = ref('right')

const checkbox = ref(false)
const text = ref('')

function callback(
  event: keyof DrawerEvents,
  id: DrawerEvents[keyof DrawerEvents]
) {
  console.log(event, id)

  if (event === 'enter' && id === horizontalId && position.value === 'left') {
    scrollable.value!.scrollLeft = scrollable.value?.scrollWidth || 0
  }
}

useDrawerEmitter().on('*', callback)

onBeforeUnmount(() => {
  useDrawerEmitter().off('*', callback)
})
</script>

<style>
#magic-drawer-horizontal-demo {
  --magic-drawer-height: 100svh;
}
</style>
