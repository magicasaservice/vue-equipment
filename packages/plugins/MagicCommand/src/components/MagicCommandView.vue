<template>
  <div class="magic-command-view" v-if="isActive" ref="elRef">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  inject,
  toValue,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
} from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { useCommandStore } from '../composables/private/useCommandStore'
import { useCommandView } from '../composables/private/useCommandView'
import { MagicCommandInstanceId } from '../symbols'

interface MagicCommandViewProps {
  id?: string
  default?: boolean
}

const props = withDefaults(defineProps<MagicCommandViewProps>(), {
  default: false,
})
const commandId = inject(MagicCommandInstanceId, '')
const elRef = ref<HTMLElement | undefined>(undefined)

const { activeView, selectView } = useCommandView()

const mappedId = computed(() => {
  return props.id || uuid()
})

const isActive = computed(() => {
  return toValue(mappedId) === activeView.value
})

const items = computed(() => {
  return findInstance(toValue(commandId))?.items
})

const { addView, removeView, findInstance, sortItems } = useCommandStore()

onMounted(() => {
  if (toValue(commandId)) {
    addView(toValue(commandId), mappedId.value)
  }

  if (props.default) {
    selectView(mappedId.value)
  }
})

onUnmounted(() => {
  if (toValue(commandId)) {
    removeView(toValue(commandId), mappedId.value)
  }
})

// Update sorting for MagicCommandItems
watch(
  () => items.value?.length,
  () => {
    nextTick(() => {
      if (elRef.value) {
        sortItems(toValue(commandId), elRef.value)
      }
    })
  }
)
</script>
