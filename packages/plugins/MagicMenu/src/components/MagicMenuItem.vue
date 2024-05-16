<template>
  <div
    class="magic-menu-item"
    ref="elRef"
    :class="{ '-active': isActive }"
    :id="mappedId"
    @mouseenter="onActive"
    @touchstart="onActive"
  >
    <slot :is-active="isActive" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  ref,
  provide,
  nextTick,
  toValue,
  onBeforeUnmount,
} from 'vue'
import { useEventListener, onKeyStroke } from '@vueuse/core'
import { uuid } from '@maas/vue-equipment/utils'
import {
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
} from '../symbols'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuView } from '../composables/private/useMenuView'

interface MagicMenuItemProps {
  id?: string
  callback?: Function | false
  listener?: ('click' | 'mouseenter' | 'touchstart')[]
  keys?: string[]
}

const props = withDefaults(defineProps<MagicMenuItemProps>(), {
  listener: () => ['click'],
  keys: () => ['Enter'],
})

const elRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicMenuInstanceId, undefined)
const mappedId = computed(() => {
  return props.id || `magic-menu-item-${uuid()}`
})

const parentTree = inject(MagicMenuParentTree, [])
const mappedParentTree = computed(() => [
  ...toValue(parentTree),
  mappedId.value,
])

const mappedParentId = computed(() => parentTree[parentTree.length - 1])

if (!instanceId) {
  throw new Error('MagicMenuItem must be used inside a MagicMenuProvider')
}

const { initializeItem, selectItem, deleteItem } = useMenuItem(instanceId)
const item = initializeItem({ id: mappedId.value, parentTree })

const { selectView, getNestedView, unselectNestedViews } =
  useMenuView(instanceId)

const isActive = computed(() => {
  return item.active.value
})

function onActive() {
  selectItem(mappedId.value)

  // Unselect any nested views of siblings
  unselectNestedViews(mappedParentId.value)

  const possibleNestedView = getNestedView(mappedId.value)

  if (possibleNestedView) {
    selectView(possibleNestedView.id)
  }
}

function listenerCallback() {
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

onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})

provide(MagicMenuItemActive, isActive)
provide(MagicMenuParentTree, mappedParentTree.value)
</script>
