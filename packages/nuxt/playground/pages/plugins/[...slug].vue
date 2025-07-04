<template>
  <div
    class="bg-surface-low flex h-screen w-screen items-center justify-center p-24"
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
