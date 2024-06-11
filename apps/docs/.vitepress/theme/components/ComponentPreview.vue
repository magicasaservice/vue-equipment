<template>
  <div class="component-preview">
    <slot />
    <div class="language-Vue vp-adaptive-theme">
      <button title="Copy Code" class="copy"></button
      ><span class="lang">{{ lang }}</span>
      <div v-if="code" v-html="code" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

interface Props {
  code: string
}

const props = defineProps<Props>()
const code = ref(decodeURIComponent(props.code ?? ''))
</script>
