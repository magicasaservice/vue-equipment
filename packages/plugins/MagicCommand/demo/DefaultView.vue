<template>
  <magic-command-view
    id="default-view"
    :default="true"
    class="bg-neutral-800 border border-solid border-neutral-600 w-[40rem] max-h-[30rem] rounded-xl overflow-hidden flex flex-col"
  >
    <magic-command-head class="p-2">
      <div class="w-full border border-neutral-600 p-3 border-b-solid">
        <input type="text" placeholder="Search" />
      </div>
    </magic-command-head>
    <magic-command-body class="h-full pb-2">
      <magic-command-group>
        <h2 class="p-4 text-xs text-neutral-600">Suggestions</h2>
        <magic-command-item
          v-slot="{ isActive }"
          :default="true"
          :callback="projectItemCallback"
        >
          <demo-item :is-active="isActive">View Projects</demo-item>
        </magic-command-item>
        <magic-command-item v-slot="{ isActive }" :callback="toggleDynamicItem">
          <demo-item :is-active="isActive"
            >{{ dynamic ? 'Remove' : 'Add ' }} Filter</demo-item
          >
        </magic-command-item>
      </magic-command-group>
      <magic-command-group>
        <h2 class="p-4 text-xs text-neutral-600">Filter</h2>
        <magic-command-item
          v-slot="{ isActive }"
          v-if="dynamic"
          :callback="() => itemCallback('dynamic')"
        >
          <demo-item :is-active="isActive">All</demo-item>
        </magic-command-item>
        <magic-command-item
          v-for="nth in 20"
          :key="nth"
          :callback="() => itemCallback(nth)"
          v-slot="{ isActive }"
        >
          <demo-item :is-active="isActive">{{ nth }}</demo-item>
        </magic-command-item>
      </magic-command-group>
    </magic-command-body>
  </magic-command-view>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useCommandApi, CommandInstanceId } from '@maas/vue-equipment/plugins'
import DemoItem from './DemoItem.vue'

interface Props {
  hasDynamicItem?: boolean
}

defineProps<Props>()

const commandId = inject(CommandInstanceId, '')

const commandApi = useCommandApi(commandId)
const { selectView } = commandApi

const dynamic = ref(false)

function toggleDynamicItem() {
  dynamic.value = !dynamic.value
}

function itemCallback(nth: number | string) {
  console.log(nth)
}

function projectItemCallback() {
  selectView('project-view')
}
</script>
