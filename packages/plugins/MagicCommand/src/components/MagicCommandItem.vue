<template>
  <div
    class="magic-command-item"
    ref="elRef"
    :data-id="mappedId"
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
} from 'vue'
import { useEventListener, onKeyStroke } from '@vueuse/core'
import { uuid } from '@maas/vue-equipment/utils'
import { useCommandStore } from '../composables/private/useCommandStore'
import { useCommandItem } from '../composables/private/useCommandItem'
import { MagicCommandInstanceId } from '../symbols'

interface MagicCommandItemProps {
  id?: string
  default?: boolean
  callback: Function | false
  listener?: ('click' | 'mouseenter' | 'touchstart')[]
  keys?: string[]
}

const props = withDefaults(defineProps<MagicCommandItemProps>(), {
  listener: () => ['click'],
  keys: () => ['Enter'],
})
const elRef = ref<HTMLElement | undefined>(undefined)

const commandId = inject(MagicCommandInstanceId, '')
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
