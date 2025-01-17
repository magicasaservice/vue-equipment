<template>
  <div class="flex flex-col items-center gap-8">
    <magic-auto-size class="bg-surface-elevation-high inline-block">
      <div v-if="current === 'a'" class="w-[20rem] aspect-[3/4]" />
      <div v-if="current === 'b'" class="w-[35rem] aspect-[16/9]" />
    </magic-auto-size>

    <m-button @click="toggleContent">Resize</m-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MButton } from '@maas/mirror/vue'

const current = ref('a')

function toggleContent() {
  current.value = current.value === 'a' ? 'b' : 'a'
}
</script>
