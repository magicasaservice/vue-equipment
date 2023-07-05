<template>
  <div
    class="w-30 h-30 bg-black text-white sticky top-[4rem] flex items-center justify-center"
  >
    {{ percentage }}
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import { ScrollProgressKey } from './src/types/injection-symbols/magic-scroll'

const scrollProgress = inject(ScrollProgressKey, ref(0))
const percentage = computed(() => Math.round(scrollProgress.value * 100))
</script>
