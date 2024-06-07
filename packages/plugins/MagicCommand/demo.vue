<template>
  <magic-command-provider :id="id">
    <div class="flex flex-wrap gap-4 justify-center">
      <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
        <magic-command-trigger
          view-id="initial-view"
          class="w-full h-full px-6 py-4 text-center"
        >
          Open palette
        </magic-command-trigger>
      </div>
    </div>

    <magic-command-modal>
      <magic-command-renderer
        class="w-[40rem] h-[30rem] relative inset-0 border border-solid border-neutral-600 flex flex-col"
      />
    </magic-command-modal>

    <magic-command-view :initial="true" id="initial-view">
      <magic-command-content class="overflow-auto bg-neutral-800">
        <div class="px-2 pt-2">
          <div class="w-full border border-neutral-600 p-3 border-b-solid">
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div class="py-2">
          <span class="p-4 text-xs text-neutral-600">Suggestions</span>
          <magic-command-item @click="toggleDynamicItem" :initial="true">
            <demo-item>{{ dynamic ? 'Remove' : 'Add ' }} Filter</demo-item>
          </magic-command-item>
          <magic-command-item>
            <magic-command-view>
              <magic-command-trigger>
                <demo-item>View Projects</demo-item>
              </magic-command-trigger>
              <magic-command-content
                class="h-full w-full bg-neutral-800 overflow-auto"
              >
                <div class="sticky top-0 px-4 py-4 bg-neutral-900">
                  <div class="w-full">
                    <input type="text" placeholder="Search Projects" />
                  </div>
                </div>
                <div class="pb-2 pt-2">
                  <magic-command-item
                    v-for="nth in 20"
                    :key="nth"
                    :initial="nth === 1"
                  >
                    <demo-item>Project {{ nth }}</demo-item>
                  </magic-command-item>
                </div>
                <div class="sticky bottom-0 px-2 bg-neutral-800">
                  <div
                    class="w-full border border-neutral-600 px-2 py-4 border-t-solid flex items-center"
                  >
                    <magic-command-trigger
                      action="close"
                      class="leading-none text-xs text-neutral-600"
                    >
                      Go Back
                    </magic-command-trigger>
                  </div>
                </div>
              </magic-command-content>
            </magic-command-view>
          </magic-command-item>
        </div>
        <div>
          <span class="p-4 text-xs text-neutral-600">Filter</span>
          <magic-command-item v-if="dynamic">
            <demo-item>All</demo-item>
          </magic-command-item>
          <magic-command-item
            v-for="nth in 20"
            :key="nth"
            @click="itemCallback(nth)"
          >
            <demo-item>{{ nth }}</demo-item>
          </magic-command-item>
        </div>
      </magic-command-content>
    </magic-command-view>
  </magic-command-provider>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick } from 'vue'
import {
  useMagicCommand,
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'

import DemoItem from './demo/DemoItem.vue'

const id = 'magic-command-demo'
const dynamic = ref(false)

function toggleDynamicItem() {
  dynamic.value = !dynamic.value
}

function itemCallback(nth: number | string) {
  console.log(nth)
}

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  // console.log(id, payload)
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
