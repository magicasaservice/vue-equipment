<template>
  <div
    class="w-screen h-screen flex items-center justify-center bg-surface-elevation-low p-24"
    data-color-mode="dark"
  >
    <component :is="defaultDemo" />
  </div>
</template>

<script lang="ts" setup>
import { pascalCase } from 'scule'

const route = useRoute()
const defaultDemo = defineAsyncComponent(
  () =>
    import(
      `../../../../plugins/${pascalCase(
        route.params.slug[0]
      )}/demo/DefaultDemo.vue`
    )
)
</script>
