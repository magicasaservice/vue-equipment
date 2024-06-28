<template>
  <div class="flex flex-col items-center gap-8">
    <magic-auto-size
      :class="{ 'bg-[red]': current === 'a', 'bg-[blue]': current === 'b' }"
    >
      <div class="w-[30rem] aspect-[2/1]" v-if="current === 'a'" />
      <div class="w-[15rem] aspect-[1/2]" v-if="current === 'b'" />
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
