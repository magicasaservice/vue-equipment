<template>
  <div class="m-auto rounded flex flex-col w-60 gap-2 bg-gray-500/5">
    <button @click="open" class="w-full h-full px-6 py-4">Open palette</button>
  </div>
  <magic-command :id="id">
    <magic-command-view
      class="bg-gray-500 w-[40rem] h-[30rem] rounded-lg flex flex-col"
    >
      <magic-command-head class="bg-gray-300 rounded-t-lg">
        <magic-command-input>
          <input type="text" placeholder="Search" />
        </magic-command-input>
      </magic-command-head>
      <magic-command-body class="h-full">
        <magic-command-group>
          <h2 class="py-2 text-sm">Headline</h2>
          <magic-command-item
            v-for="nth in 20"
            :key="nth"
            :callback="() => itemCallback(nth)"
            :default="nth === 1"
            v-slot="{ isActive }"
          >
            <span
              class="p-2 flex items-center rounded-sm"
              :class="{ 'bg-blue-500': isActive }"
            >
              Item {{ nth }}
            </span>
          </magic-command-item>
        </magic-command-group>
      </magic-command-body>
      <magic-command-footer class="bg-gray-300 rounded-b-lg">
        <button @click="close">Close</button>
      </magic-command-footer>
    </magic-command-view>
  </magic-command>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import {
  useCommandApi,
  useCommandEmitter,
  type CommandEvents,
} from '@maas/vue-equipment/plugins'

const id = 'magic-command-demo'
const commandApi = useCommandApi(id)
const { open, close } = commandApi

function itemCallback(nth: number) {
  alert(nth)
}

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
