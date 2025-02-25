<template>
  <primitive
    ref="elRef"
    :data-id="`${mappedViewId}-trigger`"
    :data-active="mappedActive"
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
import { computed, inject, useTemplateRef, toValue, watch } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useCommandView } from '../composables/private/useCommandView'
import { useCommandTrigger } from '../composables/private/useCommandTrigger'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandItemActive,
  MagicCommandItemDisabled,
  MagicCommandProviderOptions,
} from '../symbols'

import type { Interaction, Action } from '../types'
import { useMagicKeys } from '@vueuse/core'

interface MagicCommandTriggerProps {
  viewId?: string
  active?: boolean
  disabled?: boolean
  action?: Action
  trigger?: Interaction[]
  asChild?: boolean
}

const {
  viewId,
  active = undefined,
  disabled = undefined,
  action = 'open' as Action,
  trigger = ['click'] as Interaction[],
} = defineProps<MagicCommandTriggerProps>()

const elRef = useTemplateRef<InstanceType<typeof Primitive>>('elRef')

const instanceId = inject(MagicCommandInstanceId, undefined)
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

const options = inject(MagicCommandProviderOptions, undefined)

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

const keys = useMagicKeys()

if (options?.keyListener?.enter) {
  for (const key of options.keyListener.enter) {
    watch(keys[key], (value) => {
      if (value) {
        onEnter()
      }
    })
  }
}
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-command-trigger-cursor, pointer);
}

.magic-menu-trigger[data-disabled='true'] {
  pointer-events: none;
}
</style>
