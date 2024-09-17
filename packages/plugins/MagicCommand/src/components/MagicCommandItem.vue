<template>
  <div
    class="magic-menu-item"
    ref="elRef"
    :data-id="mappedId"
    :class="{ '-active': item.active, '-disabled': disabled }"
    :aria-selected="item.active"
    @mouseenter="guardedSelect"
    @mousemove="guardedSelect"
    @touchstart.passive="guardedSelect"
    @mouseleave="guardedUnselect"
    @click="onClick"
  >
    <slot :is-active="item.active" :is-disabled="disabled" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  provide,
  onBeforeUnmount,
  onMounted,
  useId,
} from 'vue'
import { useCommandState } from '../composables/private/useCommandState'
import { useCommandItem } from '../composables/private/useCommandItem'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandContentId,
  MagicCommandItemId,
  MagicCommandItemActive,
} from '../symbols'

interface MagicMenuItemProps {
  id?: string
  disabled?: boolean
  initial?: boolean
}

const props = defineProps<MagicMenuItemProps>()
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const instanceId = inject(MagicCommandInstanceId, undefined)
const viewId = inject(MagicCommandViewId, undefined)
const contentId = inject(MagicCommandContentId, undefined)

if (!instanceId) {
  throw new Error('MagicCommandItem must be nested inside MagicCommandProvider')
}

if (!viewId) {
  throw new Error('MagicCommandItem must be nested inside MagicCommandView')
}

if (!contentId) {
  throw new Error('MagicCommandItem must be nested inside MagicCommandContent')
}

const mappedId = computed(() => props.id ?? `magic-command-item-${useId()}`)

const { initializeState } = useCommandState(instanceId)
const state = initializeState()

// Register item
const { initializeItem, deleteItem, selectItem, unselectItem } = useCommandItem(
  {
    instanceId,
    viewId,
  }
)

// Guarded select
// Check for mode and active state
const item = initializeItem({
  id: mappedId.value,
  disabled: props.disabled ?? false,
})

function guardedSelect() {
  if (!item.active && !item.disabled && state.input.type === 'pointer') {
    selectItem(mappedId.value)
  }
}

function guardedUnselect() {
  // if (item.active) {
  //   unselectItem(mappedId.value)
  // }
}

function onClick(event: MouseEvent) {
  emit('click', event)

  if (!item.disabled && !item.active) {
    selectItem(mappedId.value)
  }
}

// Pass id and active state to children
const isActive = computed(() => item.active)

provide(MagicCommandItemId, mappedId.value)
provide(MagicCommandItemActive, isActive)

// Lifecycle
onMounted(() => {
  if (props.initial) {
    selectItem(mappedId.value)
  }
})

onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})

// interface MagicCommandItemProps {
//   id?: string
//   initial?: boolean
//   callback: Function | false
//   listener?: ('click' | 'mouseenter' | 'touchstart')[]
//   keys?: string[]
// }

// const props = withDefaults(defineProps<MagicCommandItemProps>(), {
//   listener: () => ['click'],
//   keys: () => ['Enter'],
// })
// const elRef = ref<HTMLElement | undefined>(undefined)

// const instanceId = inject(MagicCommandInstanceId, '')
// const { selectItem, activeItem } = useCommandItem(instanceId)

// const mappedId = computed(() => {
//   return props.id || uuid()
// })

// const isActive = computed(() => {
//   return toValue(mappedId) === activeItem.value
// })

// function listenerCallback() {
//   selectItem(mappedId.value)
//   nextTick(() => {
//     if (props.callback) {
//       props.callback()
//     }
//   })
// }

// useEventListener(elRef, props.listener, listenerCallback)

// if (props.keys.length) {
//   onKeyStroke(props.keys, () => (isActive.value ? listenerCallback() : null))
// }

// const { addItem, removeItem } = useCommandState()

// onMounted(() => {
//   if (toValue(commandId)) {
//     addItem(toValue(commandId), mappedId.value)
//   }

//   nextTick(() => {
//     if (props.initial) {
//       selectItem(mappedId.value)
//     }
//   })
// })

// onUnmounted(() => {
//   if (toValue(commandId)) {
//     removeItem(toValue(commandId), mappedId.value)
//   }
// })
</script>

<style>
.magic-command-item {
  cursor: pointer;
}
</style>
