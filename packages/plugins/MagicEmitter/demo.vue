<template></template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'

function callback(payload: keyof MagicEmitterEvents) {
  const [event, id] = payload
  console.log(event, id)
}

useMagicEmitter().on('*', callback)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})
</script>
