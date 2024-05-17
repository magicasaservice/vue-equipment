<template>
  <div
    class="magic-menu-item"
    ref="elRef"
    :class="{ '-active': isActive }"
    :id="mappedId"
    @mouseenter="guardedSelect"
    @pointermove.passive="guardedSelect"
    @touchstart.passive="guardedSelect"
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
  onMounted,
} from 'vue'
import { useEventListener, onKeyStroke, useMouseInElement } from '@vueuse/core'
import { uuid } from '@maas/vue-equipment/utils'
import {
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
} from '../symbols'
import { useMenuState } from '../composables/private/useMenuState'
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
const parentTree = inject(MagicMenuParentTree, [])
const parentId = computed(() => parentTree[parentTree.length - 1])

const mappedId = computed(() => {
  return props.id || `magic-menu-item-${uuid()}`
})

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

const { initializeState } = useMenuState(toValue(instanceId))
const state = initializeState()

const { initializeItem, selectItem, unselectItem, deleteItem } =
  useMenuItem(instanceId)
const item = initializeItem({ id: mappedId.value, parentTree })

const { selectView, unselectView, getNestedView } = useMenuView(instanceId)
const { elementX, isOutside, elementWidth } = useMouseInElement(elRef)

const isActive = computed(() => {
  return item.active.value
})

function guardedSelect() {
  if (state.active.value && state.mode.value === 'mouse' && !isActive.value) {
    selectItem(mappedId.value)

    // Select nested view, if it exists
    const nextView = getNestedView(mappedId.value)
    if (nextView) {
      selectView(nextView.id)
    }
  }
}

function unselect() {
  // Check for active nested views
  if (!getNestedView(mappedId.value)?.active) {
    unselectItem(mappedId.value)
  }
}

function checkMousePosition() {
  if (elementX.value < elementWidth.value) {
    const possibleNestedView = getNestedView(mappedId.value)

    if (possibleNestedView) {
      unselectView(possibleNestedView.id)
    }
  }
}

async function listenerCallback() {
  if (isActive.value && !!props.callback) {
    await nextTick()
    props.callback()
  }
}

useEventListener(elRef, props.listener, listenerCallback)

if (props.keys.length) {
  onKeyStroke(props.keys, listenerCallback)
}

// Cursor moved outside the element
watch(isOutside, (value) => {
  if (value) {
    checkMousePosition()
  }
})

onBeforeUnmount(() => {
  deleteItem(mappedId.value)
})

provide(MagicMenuItemActive, isActive)
provide(MagicMenuParentTree, mappedParentTree.value)
</script>
