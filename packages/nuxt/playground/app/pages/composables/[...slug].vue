<template>
  <component :is="defaultDemo" />
</template>

<script lang="ts" setup>
import { camelCase } from 'scule'

const route = useRoute()

function getDemoComponent() {
  const slug = route.params.slug?.[0] ?? ''
  const pluginName = camelCase(slug)
  return import(`../../../../../composables/${pluginName}/demo/DefaultDemo.vue`)
}
const defaultDemo = defineAsyncComponent(getDemoComponent)
</script>
