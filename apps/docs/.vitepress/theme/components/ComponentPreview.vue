<template>
  <div class="component-preview">
    <slot />
    <div class="language-Vue vp-adaptive-theme">
      <button title="Copy Code" class="copy"></button>
      <div v-if="mappedCode" v-html="mappedCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

interface Props {
  code: string
}

const { code } = defineProps<Props>()
const mappedCode = ref(decodeURIComponent(code ?? ''))
</script>
