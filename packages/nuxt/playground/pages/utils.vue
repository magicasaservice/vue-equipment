<template>
  <div
    class="w-full h-screen flex flex-col items-start justify-start gap-12 p-8"
  >
    <pre>{{ clampValue }}</pre>
    <pre>{{ mapValue }}</pre>
    <pre>{{ uniq }}</pre>
    <pre>{{ isIOS }}</pre>
    <pre>{{ uuid }}</pre>
  </div>
</template>

<script lang="ts" setup>
import {
  clampValue,
  uniq,
  mapValue,
  isIOS,
  uuid,
} from '@maas/vue-equipment/utils'
</script>
