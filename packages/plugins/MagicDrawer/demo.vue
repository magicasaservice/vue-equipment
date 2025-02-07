<template>
  <div class="m-auto rounded flex flex-wrap items-center md:w-120 gap-4">
    <div class="w-full flex flex-wrap gap-4">
      <m-button class="flex-1" @click="drawerApi.open">
        Standard drawer
      </m-button>
      <m-button class="flex-1" @click="drawerSnapApi.open">
        Snap drawer
      </m-button>
    </div>
    <div class="w-full flex flex-wrap gap-4">
      <m-button class="flex-1" @click="drawerHorizontalApi.open">
        Horizontal snap drawer
      </m-button>
      <m-button class="flex-1" @click="drawerScrollApi.open"
        >Mousewheel snap drawer</m-button
      >
    </div>
  </div>
  <magic-drawer
    :id="id"
    :class="className"
    :options="{
      position: 'bottom',
    }"
  >
    <div
      class="bg-surface-elevation-high text-surface w-full h-full absolute inset-0 overflow-auto flex flex-col items-start justify-end gap-4 p-4 pb-24"
    >
      <a href="/plugins/MagicModal/">MagicModal</a>
      <m-checkbox v-model="checkbox" />
      <m-input v-model="text" type="text" label="Label" />
    </div>
  </magic-drawer>

  <magic-drawer
    :id="snapId"
    :options="{
      snapPoints: ['150px', 1],
      initial: {
        snapPoint: '150px',
      },
    }"
  >
    <div
      class="bg-surface-elevation-high w-full h-full absolute inset-0 overflow-auto pb-24"
    >
      <div class="p-4 flex gap-2">
        <m-button @click="drawerSnapApi.snapTo(1)"> Snap to 1 </m-button>
        <m-button @click="drawerSnapApi.snapTo('150px')">
          Snap to 150px
        </m-button>
      </div>
      <div class="bg-surface-elevation-higher p-2.5">
        <m-input v-model="text" label="Label" />
        <div v-for="i in 25" :key="i" class="p-4 text-surface w-full">
          {{ i }}
        </div>
      </div>
    </div>
  </magic-drawer>

  <magic-drawer
    :id="horizontalId"
    :options="{
      position,
      focusTrap: false,
      snapPoints: ['150px', 1],
      initial: {
        snapPoint: '150px',
      },
    }"
  >
    <div
      ref="scrollable"
      class="bg-surface-elevation-high absolute inset-0 overflow-x-auto flex"
    >
      <span v-for="i in 50" :key="i" class="p-4 text-surface w-full">
        {{ i }}
      </span>
    </div>
  </magic-drawer>

  <magic-drawer
    :id="scrollId"
    :options="{
      enableMousewheel: true,
      snapPoints: ['150px', 1],
      initial: {
        snapPoint: '150px',
      },
    }"
  >
    <div
      class="bg-surface-elevation-high w-full h-full absolute inset-0 overflow-auto pb-24"
    >
      <div class="p-4 flex gap-2">
        <m-button @click="drawerScrollApi.snapTo(1)"> Snap to 1 </m-button>
        <m-button @click="drawerScrollApi.snapTo('150px')">
          Snap to 150px
        </m-button>
      </div>
    </div>
  </magic-drawer>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { MButton, MCheckbox, MInput } from '@maas/mirror/vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import { useMagicDrawer } from './src/composables/useMagicDrawer'
import type { ValueOf } from '@maas/vue-equipment/utils'

const className = 'magic-drawer--test-class'

const id = 'magic-drawer-demo'
const drawerApi = useMagicDrawer(id)

const snapId = 'magic-drawer-snap-demo'
const drawerSnapApi = useMagicDrawer(snapId)

const horizontalId = 'magic-drawer-horizontal-demo'
const drawerHorizontalApi = useMagicDrawer(horizontalId)

const scrollId = 'magic-drawer-scroll-demo'
const drawerScrollApi = useMagicDrawer(scrollId)

const scrollable = ref<HTMLDivElement | undefined>(undefined)
const position = ref('right')

const checkbox = ref(false)
const text = ref('')

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

function enterCallback(payload: ValueOf<MagicEmitterEvents>) {
  if (payload === horizontalId && position.value === 'left') {
    scrollable.value!.scrollLeft = scrollable.value?.scrollWidth || 0
  }
}

useMagicEmitter().on('*', callback)
useMagicEmitter().on('enter', enterCallback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
  useMagicEmitter().off('enter', enterCallback)
})
</script>

<style>
#magic-drawer-horizontal-demo {
  --magic-drawer-height: 100svh;
}
</style>
