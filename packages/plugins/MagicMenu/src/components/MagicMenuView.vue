<template>
  <teleport to="body" v-if="isActive">
    <magic-menu-float :parent-id="mappedParentId">
      <div class="magic-menu-view" :id="mappedId" role="menu">
        <slot />
      </div>
    </magic-menu-float>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, toValue } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { MagicMenuInstanceId, MagicMenuParentTree } from '../symbols'
import { useMenuView } from '../composables/private/useMenuView'

interface MagicCommandViewProps {
  id?: string
  parentId?: string
}

const props = defineProps<MagicCommandViewProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const mappedId = computed(() => {
  return props.id || `magic-menu-view-${uuid()}`
})

if (!instanceId) {
  throw new Error('MagicMenuView must be used inside a MagicMenuProvider')
}

const parentTree = inject(MagicMenuParentTree, [toValue(instanceId)])

const mappedParentTree = computed(() => [
  ...toValue(parentTree),
  mappedId.value,
])

const mappedParentId = computed(
  () => props.parentId || parentTree[parentTree.length - 1]
)

const { initializeView, deleteView } = useMenuView(instanceId)
const view = initializeView({ id: mappedId.value, parentTree })

const isActive = computed(() => {
  return view.active.value
})

onBeforeUnmount(() => {
  deleteView(mappedId.value)
})

provide(MagicMenuParentTree, mappedParentTree.value)
</script>
