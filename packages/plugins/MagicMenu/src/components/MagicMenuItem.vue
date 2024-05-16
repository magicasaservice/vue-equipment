<template>
  <div
    class="magic-menu-item"
    ref="elRef"
    :class="{ '-active': isActive }"
    :id="mappedId"
    @mouseenter="select"
    @touchstart="select"
    @mouseleave="unselect"
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
  watch,
  onBeforeUnmount,
} from 'vue'
import { useEventListener, onKeyStroke, useMouseInElement } from '@vueuse/core'
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
const parentId = computed(() => parentTree[parentTree.length - 1])
const mappedParentTree = computed(() => [
  ...toValue(parentTree),
  mappedId.value,
])

if (!instanceId) {
  throw new Error('MagicMenuItem must be used inside a MagicMenuProvider')
}

if (!parentId.value) {
  throw new Error('MagicMenuItem must be used inside a MagicMenuView')
}

const { initializeItem, selectItem, unselectItem, deleteItem } =
  useMenuItem(instanceId)
const item = initializeItem({ id: mappedId.value, parentTree })

const { selectView, unselectView, getNestedView, unselectNestedViews } =
  useMenuView(instanceId)

const { elementX, isOutside, elementWidth } = useMouseInElement(elRef)

const isActive = computed(() => {
  return item.active.value
})

function select() {
  selectItem(mappedId.value)

  // Unselect any nested views of siblings
  unselectNestedViews(parentId.value)

  const possibleNestedView = getNestedView(mappedId.value)

  if (possibleNestedView) {
    selectView(possibleNestedView.id)
  }
}

function unselect() {
  // Only unselect the item if there is no active nested view present
  const possibleNestedView = getNestedView(mappedId.value)
  if (!possibleNestedView?.active) {
    unselectItem(mappedId.value)
  }
}

function unselectNestedView() {
  const possibleNestedView = getNestedView(mappedId.value)

  if (possibleNestedView) {
    unselectView(possibleNestedView.id)
  }
}

function trackMouse() {
  if (elementX.value < elementWidth.value) {
    unselectNestedView()
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

watch(isOutside, (value) => {
  if (value) {
    trackMouse()
  }
})

onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})

provide(MagicMenuItemActive, isActive)
provide(MagicMenuParentTree, mappedParentTree.value)
</script>
