<template>
  <div
    class="magic-command-item"
    :data-id="mappedId"
    :data-disabled="disabled"
    :data-active="item.active"
    :data-pointer-disabled="pointerDisabled"
    @mouseenter="guardedSelect"
    @mousemove="guardedSelect"
    @touchstart.passive="guardedSelect"
    @click="onClick"
  >
    <slot :item-active="item.active" :item-disabled="disabled" />
    <div v-if="pointerDisabled" class="magic-command-item__pointer-guard" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  provide,
  onBeforeUnmount,
  useId,
  onMounted,
} from 'vue'
import {
  useMagicError,
  type UseMagicErrorReturn,
} from '@maas/vue-equipment/plugins/MagicError'
import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandState } from '../composables/private/useCommandState'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandContentId,
  MagicCommandItemId,
  MagicCommandItemActive,
  MagicCommandItemDisabled,
} from '../symbols'

interface MagicCommandItemProps {
  id?: string
  initial?: boolean
  disabled?: boolean
}

const {
  id,
  initial = false,
  disabled = false,
} = defineProps<MagicCommandItemProps>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const magicError: UseMagicErrorReturn = useMagicError({
  prefix: 'MagicCommand',
  source: 'MagicCommand',
})

const instanceId = inject(MagicCommandInstanceId, undefined)
const viewId = inject(MagicCommandViewId, undefined)
const contentId = inject(MagicCommandContentId, undefined)

magicError.assert(instanceId, {
  message: 'MagicCommandItem must be nested inside MagicCommandProvider',
  errorCode: 'missing_instance_id',
})

magicError.assert(viewId, {
  message: 'MagicCommandItem must be nested inside MagicCommandView',
  errorCode: 'missing_view_id',
})

magicError.assert(contentId, {
  message: 'MagicCommandItem must be nested inside MagicCommandContent',
  errorCode: 'missing_content_id',
})

const mappedId = computed(() => id ?? `magic-command-item-${useId()}`)

// Register item
const { initializeItem, deleteItem, selectItem } = useCommandItem({
  instanceId,
  viewId,
})

// Guarded select
// Check for mode and active state
const { initializeState } = useCommandState(instanceId)
const state = initializeState()
const item = initializeItem({
  id: mappedId.value,
  disabled: disabled ?? false,
})

const pointerDisabled = computed(() => state.input.type !== 'pointer')
const mappedDisabled = computed(() => disabled ?? item?.disabled)
const mappedActive = computed(() => item?.active)

function guardedSelect() {
  if (state.input.type === 'pointer' && !item.disabled && !item.active) {
    selectItem(mappedId.value)
  }
}

function onClick(event: MouseEvent) {
  emit('click', event)

  guardedSelect()
}

// Pass id and states to children
provide(MagicCommandItemId, mappedId.value)
provide(MagicCommandItemActive, mappedActive)
provide(MagicCommandItemDisabled, mappedDisabled)

// Lifecycle
onMounted(() => {
  if (initial) {
    selectItem(mappedId.value)
  }
})

onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})
</script>

<style>
.magic-command-item {
  position: relative;
  cursor: var(--magic-command-item-cursor, default);
}

.magic-command-item__pointer-guard {
  position: absolute;
  inset: 0;
}
</style>
