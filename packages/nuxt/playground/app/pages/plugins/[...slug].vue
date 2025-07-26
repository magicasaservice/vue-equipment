<template>
  <div
    class="bg-surface-elevation-low flex h-screen w-screen items-center justify-center p-24"
    data-color-mode="dark"
  >
    <component :is="defaultDemo" />
  </div>
</template>

<script lang="ts" setup>
import { pascalCase } from 'scule'

const route = useRoute()

function getDemoComponent() {
  const slug = route.params.slug?.[0] ?? ''
  const pluginName = pascalCase(slug)
  return import(`../../../../../plugins/${pluginName}/demo/DefaultDemo.vue`)
}
const defaultDemo = defineAsyncComponent(getDemoComponent)
</script>
