<template>
  <primitive
    ref="elRef"
    :data-id="`${viewId}-trigger`"
    :data-active="view?.active"
    :data-disabled="mappedDisabled"
    :as-child="asChild"
    class="magic-command-trigger"
    @click="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :view-active="view?.active" :trigger-disabled="mappedDisabled" />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toValue, watch } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useCommandView } from '../composables/private/useCommandView'
import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandTrigger } from '../composables/private/useCommandTrigger'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandItemId,
} from '../symbols'

import type { Interaction } from '../types'
import { onKeyStroke } from '@vueuse/core'

interface MagicCommandTriggerProps {
  viewId?: string
  disabled?: boolean
  trigger?: Interaction[]
  asChild?: boolean
}

const {
  viewId,
  disabled,
  trigger = ['click'] as Interaction[],
} = defineProps<MagicCommandTriggerProps>()
const elRef = ref<InstanceType<typeof Primitive> | undefined>(undefined)

const instanceId = inject(MagicCommandInstanceId, undefined)
const itemId = inject(MagicCommandItemId, undefined)

const injectedViewId = inject(MagicCommandViewId, undefined)
const mappedViewId = computed(() => viewId ?? injectedViewId)

if (!instanceId) {
  throw new Error(
    'MagicCommandTrigger must be nested inside MagicCommandProvider'
  )
}

if (!mappedViewId.value) {
  throw new Error('MagicCommandTrigger must be nested inside MagicCommandView')
}

const { getView } = useCommandView(instanceId)
const view = getView(mappedViewId.value)

const { getItem } = useCommandItem({ instanceId, viewId: mappedViewId.value })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => disabled ?? item?.disabled ?? false)

const { onMouseenter, onClick, onEnter } = useCommandTrigger({
  instanceId,
  viewId: mappedViewId.value,
  itemId,
  mappedDisabled,
  trigger,
  elRef,
})

watch(
  () => view?.active,
  async (value) => {
    if (value) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      toValue(elRef)?.$el?.blur()
    }
  }
)

onKeyStroke('Enter', onEnter)
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-menu-trigger-cursor, pointer);
}

.magic-menu-trigger.-disabled {
  pointer-events: none;
}
</style>
