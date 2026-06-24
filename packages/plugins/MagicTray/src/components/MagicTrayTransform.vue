<template>
  <div class="magic-tray-transform" :style="{ transform }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useTrayState } from '../composables/private/useTrayState'
import { MagicTrayInstanceId } from '../symbols'

import type { TraySide, TrayTransformAxis } from '../types/index'

interface MagicTrayTransformProps {
  axis?: TrayTransformAxis
  factor?: number
  disabled?: boolean
}

const {
  axis = 'both',
  factor = 1,
  disabled = false,
} = defineProps<MagicTrayTransformProps>()

const instanceId = inject(MagicTrayInstanceId, undefined)

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicTray',
  source: 'MagicTrayTransform',
})

magicError.assert(instanceId, {
  message: 'MagicTrayTransform must be nested inside MagicTrayProvider',
  errorCode: 'missing_instance_id',
})

const mappedId = instanceId ?? ''

const { initializeState } = useTrayState(mappedId)
const state = initializeState()

function clipDistance(side: TraySide) {
  return Math.max(0, state.dragged[side] - state.overshoot.outer[side])
}

const transform = computed(() => {
  if (disabled) {
    return 'none'
  }

  const x =
    axis === 'y' ? 0 : factor * (clipDistance('left') - clipDistance('right'))
  const y =
    axis === 'x' ? 0 : factor * (clipDistance('top') - clipDistance('bottom'))

  return `translate3d(${x}px, ${y}px, 0)`
})
</script>
