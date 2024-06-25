<template>
  <div class="flex flex-col items-center gap-8">
    <magic-auto-size
      :class="{ 'bg-red': current === 'a', 'bg-blue': current === 'b' }"
    >
      <div class="w-120 aspect-2/1" v-if="current === 'a'" />
      <div class="w-60 aspect-1/2" v-if="current === 'b'" />
    </magic-auto-size>

    <div class="rounded flex flex-col w-60 gap-2 bg-gray-500/5">
      <button class="w-full h-full px-6 py-4" @click="toggleContent">
        Change Content
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref('a')

function toggleContent() {
  current.value = current.value === 'a' ? 'b' : 'a'
}
</script>
