<template>
  <div
    class="magic-command-trigger"
    ref="elRef"
    :class="{ '-active': view?.active, '-disabled': mappedDisabled }"
    :data-id="`${viewId}-trigger`"
    @click="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :is-active="view?.active" :is-disabled="mappedDisabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import { useCommandView } from '../composables/private/useCommandView'
import { useCommandItem } from '../composables/private/useCommandItem'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandItemId,
} from '../symbols'

import type { CommandTrigger } from '../types'

interface MagicCommandTriggerProps {
  disabled?: boolean
  trigger?: CommandTrigger[]
}

const props = defineProps<MagicCommandTriggerProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicCommandInstanceId, undefined)
const viewId = inject(MagicCommandViewId, undefined)
const itemId = inject(MagicCommandItemId, undefined)

if (!instanceId) {
  throw new Error(
    'MagicCommandTrigger must be nested inside MagicCommandProvider'
  )
}

if (!viewId) {
  throw new Error('MagicCommandTrigger must be nested inside MagicCommandView')
}

const { getView, selectView } = useCommandView(instanceId)
const view = getView(viewId)

const { getItem } = useCommandItem({ instanceId, viewId })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => props.disabled ?? item?.disabled)

const mappedTrigger = computed<CommandTrigger[]>(() => {
  if (props.trigger?.length) {
    return props.trigger
  } else {
    return ['click']
  }
})

function onMouseenter() {
  if (
    mappedTrigger.value.includes('mouseenter') &&
    !mappedDisabled.value &&
    viewId
  ) {
    selectView(viewId)
  }
}

function onClick(e: MouseEvent) {
  if (
    mappedTrigger.value.includes('click') &&
    !mappedDisabled.value &&
    e.button === 0 &&
    viewId
  ) {
    selectView(viewId)
  }
}

watch(
  elRef,
  (value) => {
    if (view && value) {
      view.children.trigger = value
    }
  },
  { immediate: true }
)
</script>

<style>
.magic-command-trigger {
  cursor: var(--magic-command-trigger-cursor, pointer);
}
</style>
