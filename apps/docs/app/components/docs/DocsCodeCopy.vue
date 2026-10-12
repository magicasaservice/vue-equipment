<template>
  <docs-code-action
    :label="copied ? 'Copied' : 'Copy to clipboard'"
    :icon="copied ? 'check' : 'copy-clipboard'"
    @click="copy"
  />
</template>

<script setup lang="ts">
const { value } = defineProps<{ value?: string }>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (!value) {
    return
  }
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1600)
}

onUnmounted(() => clearTimeout(timer))
</script>
