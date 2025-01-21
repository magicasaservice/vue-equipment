<template>
  <primitive
    ref="elRef"
    :data-id="`${mappedViewId}-trigger`"
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
import { useCommandTrigger } from '../composables/private/useCommandTrigger'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandItemId,
  MagicCommandItemActive,
  MagicCommandItemDisabled,
} from '../symbols'

import type { Interaction, Action } from '../types'
import { onKeyStroke } from '@vueuse/core'

interface MagicCommandTriggerProps {
  viewId?: string
  disabled?: boolean
  action?: Action
  active?: boolean
  trigger?: Interaction[]
  asChild?: boolean
}

const {
  viewId,
  trigger = ['click'] as Interaction[],
  action = 'open' as Action,
  active = undefined,
  disabled = undefined,
} = defineProps<MagicCommandTriggerProps>()
const elRef = ref<InstanceType<typeof Primitive> | undefined>(undefined)

const instanceId = inject(MagicCommandInstanceId, undefined)
const itemId = inject(MagicCommandItemId, undefined)
const itemActive = inject(MagicCommandItemActive, undefined)
const itemDisabled = inject(MagicCommandItemDisabled, undefined)

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

const mappedActive = computed(() => active ?? toValue(itemActive) ?? false)
const mappedDisabled = computed(
  () => disabled ?? toValue(itemDisabled) ?? false
)

const { onMouseenter, onClick, onEnter } = useCommandTrigger({
  instanceId,
  viewId: mappedViewId.value,
  mappedActive,
  mappedDisabled,
  trigger,
  action,
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

function guardedEnter(e: KeyboardEvent) {
  console.log('guarded', active, itemId, view)
  onEnter(e)
}

onKeyStroke('Enter', guardedEnter)
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-menu-trigger-cursor, pointer);
}

.magic-menu-trigger.-disabled {
  pointer-events: none;
}
</style>
