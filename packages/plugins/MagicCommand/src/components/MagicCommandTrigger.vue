<template>
  <vue-primitive
    ref="el"
    :data-id="`${mappedViewId}-trigger`"
    :data-active="mappedActive"
    :data-disabled="mappedDisabled"
    :as-child="asChild"
    class="magic-command-trigger"
    @click="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :view-active="view?.active" :trigger-disabled="mappedDisabled" />
  </vue-primitive>
</template>

<script lang="ts" setup>
import { computed, inject, useTemplateRef, toValue, watch } from 'vue'
import { VuePrimitive } from '@maas/vue-primitive'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
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
  disabled?: boolean
  action?: Action
  trigger?: Interaction[]
  asChild?: boolean
}

const {
  viewId,
  disabled = undefined,
  action = 'open' as Action,
  trigger = ['click'] as Interaction[],
} = defineProps<MagicCommandTriggerProps>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCommand',
  source: 'MagicCommandTrigger',
})

const elRef = useTemplateRef<InstanceType<typeof VuePrimitive>>('el')

const instanceId = inject(MagicCommandInstanceId, undefined)
const itemActive = inject(MagicCommandItemActive, undefined)
const itemDisabled = inject(MagicCommandItemDisabled, undefined)

const injectedViewId = inject(MagicCommandViewId, undefined)
const mappedViewId = computed(() => viewId ?? injectedViewId)

magicError.assert(instanceId, {
  message: 'MagicCommandTrigger must be nested inside MagicCommandProvider',
  errorCode: 'missing_instance_id',
})

magicError.assert(mappedViewId.value, {
  message:
    'MagicCommandTrigger must be nested inside MagicCommandView or a viewId must be provided',
  errorCode: 'missing_view_id',
})

const { getView } = useCommandView(instanceId)
const view = getView(mappedViewId.value)

const mappedActive = computed(() => toValue(itemActive) ?? false)
const mappedDisabled = computed(
  () => disabled ?? toValue(itemDisabled) ?? false
)

const options = inject(MagicCommandProviderOptions, undefined)

const { onMouseenter, onClick, onKeypress } = useCommandTrigger({
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
const { logWarning } = magicError

if (options?.keyListener?.enter) {
  for (const key of options.keyListener.enter) {
    const mappedKey = keys[key]

    if (!mappedKey) {
      logWarning(`The key “${key}” is not supported by MagicCommand`)
      continue
    }

    watch(mappedKey, (value) => {
      if (value) {
        onKeypress()
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
