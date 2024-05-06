<template>
  <magic-command-view
    id="project-view"
    :class="{
      'w-[40rem] max-h-[30rem] rounded-xl': isModal,
      'w-full h-full': !isModal,
    }"
    class="bg-neutral-800 border border-solid border-neutral-600 overflow-hidden flex flex-col"
  >
    <magic-command-head class="p-2">
      <div class="w-full border border-neutral-600 p-3 border-b-solid">
        <input type="text" placeholder="Search Projects" />
      </div>
    </magic-command-head>
    <magic-command-body class="h-full pb-2">
      <magic-command-group>
        <magic-command-item
          v-for="nth in 10"
          :key="nth"
          :callback="() => itemCallback(nth)"
          :default="nth === 1"
          v-slot="{ isActive }"
        >
          <demo-item :is-active="isActive">Project {{ nth }}</demo-item>
        </magic-command-item>
      </magic-command-group>
    </magic-command-body>
    <magic-command-footer class="px-2">
      <div
        class="w-full border border-neutral-600 p-2 border-t-solid flex items-center"
      >
        <button
          @click="selectLastView"
          class="leading-none text-xs text-neutral-600"
        >
          Go Back
        </button>
      </div>
    </magic-command-footer>
  </magic-command-view>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useMagicCommand, CommandInstanceId } from '@maas/vue-equipment/plugins'

import DemoItem from './DemoItem.vue'

interface Props {
  isModal?: boolean
}

defineProps<Props>()

const commandId = inject(CommandInstanceId, '')

const commandApi = useMagicCommand(commandId)
const { selectLastView } = commandApi

function itemCallback(nth: number) {
  console.log(nth)
}
</script>
