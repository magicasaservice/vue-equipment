<template>
  <magic-command-view
    id="default-view"
    :default="true"
    class="bg-neutral-800 border border-solid border-neutral-600 flex flex-col"
  >
    <div class="px-2 pt-2">
      <div class="w-full border border-neutral-600 p-3 border-b-solid">
        <input type="text" placeholder="Search" />
      </div>
    </div>
    <magic-command-content class="h-full py-2">
      <div>
        <span class="p-4 text-xs text-neutral-600">Suggestions</span>
        <magic-command-item :default="true">
          <demo-item>View Projects</demo-item>
        </magic-command-item>
        <magic-command-item @click="toggleDynamicItem">
          <demo-item>{{ dynamic ? 'Remove' : 'Add ' }} Filter</demo-item>
        </magic-command-item>
      </div>
      <div>
        <span class="p-4 text-xs text-neutral-600">Filter</span>
        <magic-command-item v-if="dynamic" @click="itemCallback('dynamic')">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoItem from './DemoItem.vue'

const dynamic = ref(false)

function toggleDynamicItem() {
  dynamic.value = !dynamic.value
}

function itemCallback(nth: number | string) {
  console.log(nth)
}
</script>
