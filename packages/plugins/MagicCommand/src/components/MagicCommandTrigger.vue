<template>
  <div
    class="magic-command-trigger"
    ref="elRef"
    :class="{ '-active': view?.active, '-disabled': mappedDisabled }"
    :data-id="`${mappedId}-trigger`"
    @click="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :is-active="view?.active" :is-disabled="mappedDisabled" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch, nextTick } from 'vue'
import { useCommandView } from '../composables/private/useCommandView'
import { useCommandItem } from '../composables/private/useCommandItem'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandItemId,
} from '../symbols'

import type { CommandTrigger } from '../types'
import { useCommandState } from '../composables/private/useCommandState'

interface MagicCommandTriggerProps {
  viewId?: string
  disabled?: boolean
  trigger?: CommandTrigger[]
  action?: 'close' | 'open'
}

const props = defineProps<MagicCommandTriggerProps>()
const elRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicCommandInstanceId, undefined)
const viewId = inject(MagicCommandViewId, undefined)
const itemId = inject(MagicCommandItemId, undefined)
const mappedId = computed(() => props.viewId ?? viewId)

if (!instanceId) {
  throw new Error(
    'MagicCommandTrigger must be nested inside MagicCommandProvider'
  )
}

if (!mappedId.value) {
  throw new Error(
    'MagicCommandTrigger must either be provided a viewId or be nested inside MagicCommandView'
  )
}

const { initializeState } = useCommandState(instanceId)
const state = initializeState()

const { getView, selectView, unselectView } = useCommandView(instanceId)
const view = getView(mappedId.value)

const { getItem } = useCommandItem({ instanceId, viewId: mappedId.value })
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => props.disabled ?? item?.disabled)

const mappedTrigger = computed<CommandTrigger[]>(
  () => props.trigger ?? ['click']
)

const mappedAction = computed(() => props.action ?? 'open')

function onMouseenter() {
  if (
    mappedTrigger.value.includes('mouseenter') &&
    !mappedDisabled.value &&
    mappedId.value
  ) {
    switch (mappedAction.value) {
      case 'close':
        unselectView(mappedId.value)
        break
      case 'open':
        selectView(mappedId.value)
        break
    }
  }
}

async function onClick(e: MouseEvent) {
  if (
    mappedTrigger.value.includes('click') &&
    !mappedDisabled.value &&
    e.button === 0 &&
    mappedId.value
  ) {
    switch (mappedAction.value) {
      case 'close':
        unselectView(mappedId.value)
        break
      case 'open':
        if (!state.active) {
          state.active = true
          await nextTick()
        }

        selectView(mappedId.value)
        break
    }
  }
}

watch(
  elRef,
  (value) => {
    if (view?.children && value) {
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
