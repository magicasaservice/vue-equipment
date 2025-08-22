<template>
  <div
    class="flex h-screen w-full flex-col items-start justify-start gap-12 p-8"
  >
    <pre>{{ clampValue }}</pre>
    <pre>{{ mapValue }}</pre>
    <pre>{{ uniq }}</pre>
    <pre>{{ isIOS }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { clampValue, uniq, mapValue, isIOS } from '@maas/vue-equipment/utils'
</script>
