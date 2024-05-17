<template>
  <teleport to="body" v-if="isActive">
    <div class="magic-menu-view" :id="mappedId" role="menu">
      <magic-menu-float>
        <slot />
      </magic-menu-float>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, inject, watch, provide, toValue, onBeforeUnmount } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { MagicMenuInstanceId, MagicMenuParentTree } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'

interface MagicMenuViewProps {
  id?: string
}

const props = defineProps<MagicMenuViewProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const mappedId = computed(() => {
  return props.id || `magic-menu-view-${uuid()}`
})

if (!instanceId) {
  throw new Error('MagicMenuView must be used inside a MagicMenuProvider')
}

const parentTree = inject(MagicMenuParentTree, [toValue(instanceId)])
const parentId = computed(() => parentTree[parentTree.length - 1])

const mappedParentTree = computed(() => [
  ...toValue(parentTree),
  mappedId.value,
])

const { initializeView, deleteView } = useMenuView(instanceId)
const view = initializeView({ id: mappedId.value, parentTree })

const { getItem } = useMenuItem(instanceId)
const parentItem = computed(() => getItem(parentId.value))

const isActive = computed(() => {
  return view.active.value
})

const parentActive = computed(() => {
  return parentItem.value?.active
})

// Deactivate the view if the parent item is deactivated
watch(parentActive, (value) => {
  if (!value) {
    view.active.value = false
  }
})

onBeforeUnmount(() => {
  deleteView(mappedId.value)
})

provide(MagicMenuParentTree, mappedParentTree.value)
</script>
