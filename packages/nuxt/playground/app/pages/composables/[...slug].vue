<template>
  <component :is="defaultDemo" />
</template>

<script lang="ts" setup>
import { camelCase } from 'scule'

const route = useRoute()
const defaultDemo = defineAsyncComponent(
  () =>
    import(
      `../../../../composables/${camelCase(
        route.params.slug[0]
      )}/demo/DefaultDemo.vue`
    )
)
</script>
