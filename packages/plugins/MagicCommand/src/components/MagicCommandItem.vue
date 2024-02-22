<template>
  <div
    class="magic-command-item"
    ref="elRef"
    :data-item-id="mappedId"
    :aria-selected="isActive"
  >
    <slot :is-active="isActive" />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  inject,
  toValue,
  nextTick,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from 'vue'
import { useEventListener, onKeyStroke } from '@vueuse/core'
import { uuid } from '@maas/vue-equipment/utils'
import { useCommandStore } from '../composables/private/useCommandStore'
import { useCommandItem } from '../composables/private/useCommandItem'
import { CommandInstanceId } from '../symbols'

interface Props {
  id?: string
  default?: boolean
  callback: Function | false
  listener?: ('click' | 'hover')[]
  keys?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  listener: () => ['click'],
  keys: () => ['Enter'],
})
const elRef = ref<HTMLElement | undefined>(undefined)

const commandId = inject(CommandInstanceId, '')
const { selectItem, activeItem } = useCommandItem(commandId)

const mappedId = computed(() => {
  return props.id || uuid()
})

const isActive = computed(() => {
  return toValue(mappedId) === activeItem.value
})

function listenerCallback() {
  selectItem(mappedId.value)
  nextTick(() => {
    if (props.callback) {
      props.callback()
    }
  })
}

function getComponentIndex(): number {
  let parent = getCurrentInstance()?.parent

  // Traverse up to the specified wrapper component
  while (parent && parent.type.__name !== 'MagicCommandView') {
    parent = parent.parent
  }

  if (!parent) {
    console.error('MagicCommandView not found, can’t register MagicCommandItem')
    return -1
  }

  const children = Array.from(
    (parent.refs.elRef as HTMLElement).querySelectorAll('.magic-command-item')
  ) as HTMLElement[]

  if (!children.length) {
    console.error(
      'MagicCommandView has no children, can’t register MagicCommandItem'
    )
    return -1
  }

  const index = children.findIndex(
    (child) => child.dataset.id === mappedId.value
  )

  return index
}

useEventListener(elRef, props.listener, listenerCallback)

if (props.keys.length) {
  onKeyStroke(props.keys, () => (isActive.value ? listenerCallback() : null))
}

const { addItem, removeItem } = useCommandStore()

onMounted(() => {
  if (toValue(commandId)) {
    addItem(toValue(commandId), mappedId.value)
  }

  nextTick(() => {
    if (props.default) {
      selectItem(mappedId.value)
    }
  })
})

onUnmounted(() => {
  if (toValue(commandId)) {
    removeItem(toValue(commandId), mappedId.value)
  }
})
</script>

<style>
.magic-command-item {
  cursor: pointer;
}
</style>
