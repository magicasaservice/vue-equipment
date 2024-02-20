<template>
  <div class="magic-command-view" v-if="isActive">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  inject,
  toValue,
  onMounted,
  onUnmounted,
} from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { useCommandStore } from '../composables/private/useCommandStore'
import { useCommandView } from '../composables/private/useCommandView'
import { CommandInstanceId } from '../symbols'

interface Props {
  id?: string
  default?: boolean
}

const props = withDefaults(defineProps<Props>(), { default: true })
const commandId = inject(CommandInstanceId, '')

const { activeView, selectView } = useCommandView(commandId)

const mappedId = computed(() => {
  return props.id || uuid()
})

const isActive = computed(() => {
  return toValue(mappedId) === activeView.value
})

const { addView, removeView } = useCommandStore()

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
</script>
