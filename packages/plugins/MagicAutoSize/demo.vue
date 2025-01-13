<template>
  <div class="flex flex-col items-center gap-8">
    <magic-auto-size
      class="p-6"
      :class="{ 'bg-[red]': current === 'a', 'bg-[blue]': current === 'b' }"
    >
      <div v-if="current === 'a'" class="w-[30rem] aspect-[2/1]" />
      <div v-if="current === 'b'" class="inline-block">
        <div class="w-[15rem] aspect-[1/2]" />
      </div>
    </magic-auto-size>

    <m-button @click="toggleContent"> Change Content </m-button>
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
