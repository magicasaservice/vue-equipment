<template>
  <div class="component-preview">
    <slot />
    <button @click="copy(sourceCode)" class="">Copy code</button>
    <div
      class="language-vue vp-adaptive-theme"
      v-html="highlightedSourceCode"
    />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { ref, defineProps } from 'vue'

interface Props {
  code: string
  highlightedCode: string
}

const props = defineProps<Props>()

const sourceCode = ref(decodeURIComponent(props.code ?? ''))
const highlightedSourceCode = ref(
  decodeURIComponent(props.highlightedCode ?? '')
)
const { copy } = useClipboard()
</script>
