<template>
  <div
    class="magic-cookie-item"
    :data-optional="item.optional"
    :data-active="item.active"
  >
    <slot :item="item" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, onBeforeUnmount, useId } from 'vue'
import { useCookieItem } from '../composables/private/useCookieItem'
import {
  MagicCookieInstanceId,
  MagicCookieItemId,
  MagicCookieItemActive,
} from '../symbols'

interface MagicCookieItemProps {
  id?: string
  optional?: boolean
  maxAge?: number
}

const { id, optional, maxAge } = defineProps<MagicCookieItemProps>()

const instanceId = inject(MagicCookieInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicCookieItem must be nested inside MagicCookieProvider')
}

const mappedId = computed(() => id ?? `magic-cookie-item-${useId()}`)
const mappedActive = computed(() => item.active)

// Register item
const { initializeItem, deleteItem } = useCookieItem({
  instanceId,
})

// Guarded select
// Check for mode and active state
const item = initializeItem({
  id: mappedId.value,
  optional: optional,
  maxAge: maxAge,
})

// Pass id and active state to children
provide(MagicCookieItemId, mappedId.value)
provide(MagicCookieItemActive, mappedActive)

// Lifecycle
onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})
</script>

<style>
.magic-cookie-item {
  cursor: var(--magic-cookie-item-cursor, default);
}
</style>
