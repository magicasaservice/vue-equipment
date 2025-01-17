<template>
  <div class="flex flex-col items-center gap-8">
    <magic-auto-size
      :class="{
        'bg-[black]': current === 'a',
        'bg-[white]': current === 'b',
      }"
    >
      <div v-if="current === 'a'" class="w-[20rem] aspect-[16/9]" />
      <div v-if="current === 'b'" class="w-[40rem] aspect-[2/1]" />
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
