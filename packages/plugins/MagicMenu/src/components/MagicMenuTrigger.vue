<template>
  <primitive
    ref="el"
    :data-id="`${mappedViewId}-trigger`"
    :data-active="view?.active"
    :data-disabled="mappedDisabled"
    :tabindex="mappedTabindex"
    :as-child="asChild"
    class="magic-menu-trigger"
    @click="onClick"
    @contextmenu="onClick"
    @mouseenter="onMouseenter"
  >
    <slot :view-active="view?.active" :trigger-disabled="mappedDisabled" />
  </primitive>
</template>

<script lang="ts" setup>
import { computed, inject, useTemplateRef, toValue, watch } from 'vue'
import { Primitive } from '@maas/vue-primitive'
import { useMenuState } from '../composables/private/useMenuState'
import { useMenuView } from '../composables/private/useMenuView'
import { useMenuItem } from '../composables/private/useMenuItem'
import { useMenuTrigger } from '../composables/private/useMenuTrigger'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuItemId,
} from '../symbols'

import type { Interaction } from '../types'
import { onKeyStroke } from '@vueuse/core'

interface MagicMenuTriggerProps {
  instanceId?: string
  viewId?: string
  disabled?: boolean
  trigger?: Interaction[]
  asChild?: boolean
}

const { instanceId, viewId, disabled, trigger } =
  defineProps<MagicMenuTriggerProps>()
const elRef = useTemplateRef<InstanceType<typeof Primitive>>('el')

const injectedInstanceId = inject(MagicMenuInstanceId, undefined)
const injectedViewId = inject(MagicMenuViewId, undefined)
const itemId = inject(MagicMenuItemId, undefined)

const mappedInstanceId = computed(() => instanceId ?? injectedInstanceId)
const mappedViewId = computed(() => viewId ?? injectedViewId)

if (!mappedInstanceId.value) {
  throw new Error(
    'MagicMenuRemote must be nested inside MagicMenuProvider or an instanceId must be provided'
  )
}

if (!mappedViewId.value) {
  throw new Error(
    'MagicMenuTrigger must be nested inside MagicMenuView or a viewId must be provided'
  )
}

const { getView, getRelativeViewIndex } = useMenuView(mappedInstanceId.value)
const view = getView(mappedViewId.value)
const viewIndex = getRelativeViewIndex(mappedViewId.value)

const { initializeState } = useMenuState(mappedInstanceId.value)
const state = initializeState()

const { getItem } = useMenuItem({
  instanceId: mappedInstanceId.value,
  viewId: mappedViewId.value,
})
const item = getItem(itemId ?? '')

const mappedDisabled = computed(() => disabled ?? item?.disabled ?? false)

const mappedTrigger = computed<Interaction[]>(() => {
  if (trigger?.length) {
    return trigger
  }

  switch (state.options.mode) {
    case 'menubar':
      return view?.parent.item
        ? ['mouseenter', 'click']
        : state.active
        ? ['mouseenter', 'click']
        : ['click']
    case 'dropdown':
      return view?.parent.item ? ['mouseenter', 'click'] : ['click']
    case 'context':
      return view?.parent.item ? ['mouseenter', 'click'] : ['right-click']
    case 'navigation':
      return ['mouseenter']
    default:
      return []
  }
})

const mappedTabindex = computed(() => {
  if (viewIndex === 0 && state.options.mode !== 'context' && !itemId) {
    return 0
  } else {
    return undefined
  }
})

const { onMouseenter, onClick, onEnter } = useMenuTrigger({
  instanceId: mappedInstanceId.value,
  viewId: mappedViewId.value,
  itemId,
  mappedDisabled,
  mappedTrigger,
  elRef,
})

watch(
  () => view?.active,
  async (value) => {
    if (value) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      toValue(elRef)?.$el?.blur()
    }
  }
)

onKeyStroke('Enter', onEnter)
</script>

<style>
.magic-menu-trigger {
  cursor: var(--magic-menu-trigger-cursor, pointer);
}

.magic-menu-trigger[data-disabled='true'] {
  pointer-events: none;
}
</style>
