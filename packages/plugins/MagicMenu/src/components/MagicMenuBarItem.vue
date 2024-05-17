<template>
  <button
    class="magic-menu-bar-item"
    ref="elRef"
    :class="{ '-active': isActive }"
    :id="mappedId"
    :tabindex="isActive ? 0 : -1"
    :aria-expanded="isActive"
    aria-haspopup="menu"
    role="menuitem"
    @mouseenter="guardedSelect"
    @touchstart.passive="guardedSelect"
  >
    <slot :is-active="isActive" />
  </button>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick, watch, inject, provide, toValue } from 'vue'
import { uuid } from '@maas/vue-equipment/utils'
import { useEventListener, onKeyStroke } from '@vueuse/core'
import {
  MagicMenuInstanceId,
  MagicMenuItemActive,
  MagicMenuParentTree,
} from '../symbols'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuBarItemProps {
  id?: string
  callback?: Function | false
  listener?: ('click' | 'hover')[]
  keys?: string[]
}

const props = withDefaults(defineProps<MagicMenuBarItemProps>(), {
  listener: () => ['click'],
  keys: () => ['Enter'],
})

const elRef = ref<HTMLElement | undefined>(undefined)

const instanceId = inject(MagicMenuInstanceId, undefined)

const mappedId = computed(() => {
  return props.id || `magic-menu-bar-item-${uuid()}`
})

if (!instanceId) {
  throw new Error('MagicMenuBarItem must be used inside a MagicMenuProvider')
}

const { initializeState } = useMenuState(toValue(instanceId))
const state = initializeState()

const parentTree = inject(MagicMenuParentTree, [])
const mappedParentTree = computed(() => [
  ...toValue(parentTree),
  mappedId.value,
])

const { initializeItem, selectItem } = useMenuItem(instanceId)
const item = initializeItem({
  id: mappedId.value,
  parentTree,
})

const { selectView, getNestedView } = useMenuView(instanceId)

const isActive = computed(() => {
  return item.active.value
})

function guardedSelect() {
  if (state.active.value && state.mode.value === 'mouse') {
    selectItem(mappedId.value)
  }
}

function listenerCallback() {
  selectItem(mappedId.value)

  const possibleNestedView = getNestedView(mappedId.value)

  if (possibleNestedView) {
    selectView(possibleNestedView.id)
  }

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

// Open nested view if active
watch(isActive, (value) => {
  if (value) {
    const possibleNestedView = getNestedView(mappedId.value)

    if (possibleNestedView) {
      selectView(possibleNestedView.id)
    }
  }
})

provide(MagicMenuItemActive, isActive)
provide(MagicMenuParentTree, mappedParentTree.value)
</script>
