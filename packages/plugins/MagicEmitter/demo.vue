<template>
  <div />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins'
import type { ValueOf } from '@maas/vue-equipment/utils'

function callback(
  id: keyof MagicEmitterEvents,
  payload: ValueOf<MagicEmitterEvents>
) {
  console.log(id, payload)
}

useMagicEmitter().on('*', callback)
useMagicEmitter().on(
  'beforeEnter',
  (payload: MagicEmitterEvents['beforeEnter']) => {
    console.log('beforeEnter', payload)
  }
)

onBeforeUnmount(() => {
  useMagicEmitter().off('*', callback)
})

onMounted(() => {
  useMagicEmitter().emit('beforeEnter', 'your-id')
})
</script>
